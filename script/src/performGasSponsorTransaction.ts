import { ethers } from "ethers";
import { PROVIDER, USER_ADDRESS, SPONSOR_ADDRESS, USER_PRIVATE_KEY, SPONSOR_PRIVATE_KEY, GAS_SPONSOR_CONTRACT, NONCE, CHAIN_ID, RECIPIENT_ADDRESS, NFT_CONTRACT_ADDRESS } from "./constant";
import {SPONSOR_CONTRACT_ABI} from "./abi";
import { signSponsorshipMessage } from "./eip7702";

const performGasSponsorTransaction = async () => {
  try{
    const sponsorWallet = new ethers.Wallet(SPONSOR_PRIVATE_KEY, PROVIDER)
    const tokenId = 0
    
    // For ERC-721 NFT transfer
    const nftInterface = new ethers.Interface([
      'function transferFrom(address from, address to, uint256 tokenId)'
    ]);
    
    // const transferCall = {
    //   data: nftInterface.encodeFunctionData('transferFrom', [
    //     USER_ADDRESS, 
    //     RECIPIENT_ADDRESS, 
    //     tokenId
    //   ]),
    //   to: NFT_CONTRACT_ADDRESS, // NFT contract address
    //   value: ethers.parseEther('0') // No ETH value for NFT transfer
    // }

    const transferCall = {
      data: '0x',
      to: RECIPIENT_ADDRESS,
      value: ethers.parseEther('0')
    }

    const eoaContract = new ethers.Contract(USER_ADDRESS, SPONSOR_CONTRACT_ABI, PROVIDER);

    let nonceToUse = BigInt(NONCE) + 1n;

    const signature = await signSponsorshipMessage(
      transferCall,
      SPONSOR_ADDRESS,
      Number(nonceToUse),
      USER_PRIVATE_KEY,
      CHAIN_ID
    );

    console.log('1. Transfer details:', {
      to: RECIPIENT_ADDRESS,
      value: ethers.formatEther(transferCall.value),
      data: transferCall.data
    });

    console.log('3. Recipient address:', RECIPIENT_ADDRESS);
    console.log('3. Sponsor:', SPONSOR_ADDRESS);
    console.log('4. Nonce to use:', nonceToUse);
    console.log('5. Chain ID:', CHAIN_ID);

    const verifyDigest = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ['uint256', 'address', 'uint256', 'bytes32', 'address', 'uint256'],
        [
          CHAIN_ID,
          transferCall.to,
          transferCall.value,
          ethers.keccak256(transferCall.data),
          SPONSOR_ADDRESS,
          Number(nonceToUse)
        ]
      )
    );
    try {
      const recoveredAddress = ethers.verifyMessage(ethers.getBytes(verifyDigest), signature);
      console.log('6. Signature verification:');
      console.log('   - Expected signer:', USER_ADDRESS);
      console.log('   - Recovered signer:', recoveredAddress);
      console.log('   - Signature valid:', recoveredAddress.toLowerCase() === USER_ADDRESS.toLowerCase());
    } catch (e) {
      console.error('Signature verification failed:', e);
    }

    const executeData = eoaContract.interface.encodeFunctionData(
      'execute((bytes,address,uint256),address,uint256,bytes)', 
      [
        {
          data: transferCall.data,
          to: transferCall.to,
          value: transferCall.value
        }, // Call struct as object
        SPONSOR_ADDRESS,
        nonceToUse,
        signature
      ]
    );

    console.log('=== DEBUG: Function encoding ===');
    console.log('Function selector:', executeData.slice(0, 10));
    console.log('Full execute data:', executeData);

    const sponsorNonce = await PROVIDER.getTransactionCount(SPONSOR_ADDRESS);
    const feeData = await PROVIDER.getFeeData();

    // check EOA state
    const eoaCode = await PROVIDER.getCode(USER_ADDRESS);
    if (eoaCode.startsWith('0xef0100')) {
      const delegatedTo = '0x' + eoaCode.slice(8, 48);
      console.log('Delegated to:', delegatedTo);
      console.log('Expected implementation:', GAS_SPONSOR_CONTRACT);
      console.log('Delegation matches:', delegatedTo.toLowerCase() === GAS_SPONSOR_CONTRACT?.toLowerCase());
    }


    // Try to simulate the transaction first

    try {
      console.log('=== DEBUG: Simulating transaction ===');
      const simulationResult = await PROVIDER.call({
        from: SPONSOR_ADDRESS,
        to: USER_ADDRESS,
        data: executeData,
        value: ethers.parseEther('0.01'),
        gasLimit: 500000
      });
      console.log('Simulation result:', simulationResult);
    } catch (simError: any) {
      console.error('=== DEBUG: Simulation failed ===');
      console.error('Error:', simError);
      console.error('Error data:', simError.data);
      console.error('Error reason:', simError.reason);
      
      // Try to decode the error
      if (simError.data) {
        try {
          const errorInterface = new ethers.Interface([
            'error GasSponsor__InvalidSigner()',
            'error GasSponsor__NonceAlreadyUsed()',
            'error GasSponsor__InsufficientTestTokenBalance()',
            'error GasSponsor__TestTokenTransferFailed()',
            'error GasSponsor__ExternalCallFailed()',
            'error GasSponsor__NotAuthorized()'
          ]);
          const decodedError = errorInterface.parseError(simError.data);
          console.error('Decoded error:', decodedError);
          throw new Error(`Contract error: ${decodedError?.name || 'Unknown'}`);
        } catch (decodeError) {
          console.error('Could not decode error');
        }
      }
    }

    // Regular transaction from sponsor to EOA
    // Sponsor sends NO value - only pays for gas
    // The EOA will use its own ETH for the transaction
    const sponsoredTx = {
      type: 0, // Regular transaction
      chainId: CHAIN_ID,
      nonce: sponsorNonce,
      gasPrice: feeData.gasPrice || ethers.parseUnits('10', 'gwei'),
      gasLimit: 500000,
      to: USER_ADDRESS, // Call execute on the delegated EOA
      value: 0, // No value needed - EOA pays for its own transaction
      data: executeData
    };

    const tx = await sponsorWallet.sendTransaction(sponsoredTx);
    console.log('Sponsored transaction sent:', tx.hash);

    const receipt = await tx.wait();

    console.log(receipt)
  } catch (error) {
    console.error('Error performing gas sponsor transaction:', error);
  }
}

performGasSponsorTransaction();