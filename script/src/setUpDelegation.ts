import { ethers } from "ethers";
import {USER_ADDRESS, SPONSOR_ADDRESS, GAS_SPONSOR_CONTRACT, USER_PRIVATE_KEY, SPONSOR_PRIVATE_KEY, PROVIDER, CHAIN_ID} from "./constant";
import {checkDelegation} from "./eip7702";


const setUpDelegation = async () => {
    const currentDelegation = await checkDelegation(USER_ADDRESS)
    if (currentDelegation.isDelegated) {
      // check if delegated to the right contract
      if(currentDelegation.delegatedTo?.toLowerCase() != GAS_SPONSOR_CONTRACT?.toLowerCase()) {
        throw new Error("Delegated to the wrong contract");
      }
    }
    else {
      // set up new delegation
      const userWallet = new ethers.Wallet(USER_PRIVATE_KEY, PROVIDER)
      const sponsorWallet = new ethers.Wallet(SPONSOR_PRIVATE_KEY, PROVIDER)

      const eoaNonce = await PROVIDER.getTransactionCount(USER_ADDRESS);
      const sponsorNonce = await PROVIDER.getTransactionCount(SPONSOR_ADDRESS);

      // Create authorization for delegation
      const authorization = await userWallet.authorize({
        address: GAS_SPONSOR_CONTRACT as string,
        nonce: eoaNonce, // Use current nonce for cross-wallet delegation
        chainId: CHAIN_ID
      });

      const feeData = await PROVIDER.getFeeData();

      // Send EIP-7702 transaction to establish delegation
      const delegationTx = {
        type: 4, // EIP-7702
        chainId: CHAIN_ID,
        nonce: sponsorNonce,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || ethers.parseUnits('1', 'gwei'),
        maxFeePerGas: feeData.maxFeePerGas || ethers.parseUnits('20', 'gwei'),
        gasLimit: 300000,
        to: USER_ADDRESS, // Send to EOA to establish delegation
        value: 0, // No value needed for delegation
        data: '0x', // Empty data for pure delegation
        authorizationList: [authorization]
      };
      const tx = await sponsorWallet.sendTransaction(delegationTx);
      console.log('Delegation transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      if (receipt?.status !== 1) {
        throw new Error('Delegation transaction failed');
      }
    }
}

setUpDelegation();