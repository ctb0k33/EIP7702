export const SPONSOR_CONTRACT_ABI= [
  {
   "type": "receive",
   "stateMutability": "payable"
  },
  {
   "type": "function",
   "name": "TEST_TOKEN",
   "inputs": [],
   "outputs": [
    {
     "name": "",
     "type": "address",
     "internalType": "address"
    }
   ],
   "stateMutability": "view"
  },
  {
   "type": "function",
   "name": "TEST_TOKEN_PER_TRANSACTION",
   "inputs": [],
   "outputs": [
    {
     "name": "",
     "type": "uint256",
     "internalType": "uint256"
    }
   ],
   "stateMutability": "view"
  },
  {
   "type": "function",
   "name": "execute",
   "inputs": [
    {
     "name": "calls",
     "type": "tuple[]",
     "internalType": "struct GasSponsor.Call[]",
     "components": [
      {
       "name": "data",
       "type": "bytes",
       "internalType": "bytes"
      },
      {
       "name": "to",
       "type": "address",
       "internalType": "address"
      },
      {
       "name": "value",
       "type": "uint256",
       "internalType": "uint256"
      }
     ]
    }
   ],
   "outputs": [],
   "stateMutability": "payable"
  },
  {
   "type": "function",
   "name": "execute",
   "inputs": [
    {
     "name": "userCall",
     "type": "tuple",
     "internalType": "struct GasSponsor.Call",
     "components": [
      {
       "name": "data",
       "type": "bytes",
       "internalType": "bytes"
      },
      {
       "name": "to",
       "type": "address",
       "internalType": "address"
      },
      {
       "name": "value",
       "type": "uint256",
       "internalType": "uint256"
      }
     ]
    },
    {
     "name": "sponsor",
     "type": "address",
     "internalType": "address"
    },
    {
     "name": "nonce",
     "type": "uint256",
     "internalType": "uint256"
    },
    {
     "name": "signature",
     "type": "bytes",
     "internalType": "bytes"
    }
   ],
   "outputs": [],
   "stateMutability": "payable"
  },
  {
   "type": "function",
   "name": "getEOAETHBalance",
   "inputs": [],
   "outputs": [
    {
     "name": "",
     "type": "uint256",
     "internalType": "uint256"
    }
   ],
   "stateMutability": "view"
  },
  {
   "type": "function",
   "name": "getEOATestTokenBalance",
   "inputs": [],
   "outputs": [
    {
     "name": "",
     "type": "uint256",
     "internalType": "uint256"
    }
   ],
   "stateMutability": "view"
  },
  {
   "type": "function",
   "name": "isNonceUsed",
   "inputs": [
    {
     "name": "nonce",
     "type": "uint256",
     "internalType": "uint256"
    }
   ],
   "outputs": [
    {
     "name": "",
     "type": "bool",
     "internalType": "bool"
    }
   ],
   "stateMutability": "view"
  },
  {
   "type": "function",
   "name": "nonceUsed",
   "inputs": [
    {
     "name": "",
     "type": "uint256",
     "internalType": "uint256"
    }
   ],
   "outputs": [
    {
     "name": "",
     "type": "bool",
     "internalType": "bool"
    }
   ],
   "stateMutability": "view"
  },
  {
   "type": "event",
   "name": "TransactionSponsored",
   "inputs": [
    {
     "name": "eoa",
     "type": "address",
     "indexed": true,
     "internalType": "address"
    },
    {
     "name": "sponsor",
     "type": "address",
     "indexed": true,
     "internalType": "address"
    },
    {
     "name": "nonce",
     "type": "uint256",
     "indexed": false,
     "internalType": "uint256"
    },
    {
     "name": "testTokenPaid",
     "type": "uint256",
     "indexed": false,
     "internalType": "uint256"
    },
    {
     "name": "callTo",
     "type": "address",
     "indexed": false,
     "internalType": "address"
    },
    {
     "name": "callValue",
     "type": "uint256",
     "indexed": false,
     "internalType": "uint256"
    }
   ],
   "anonymous": false
  },
  {
   "type": "error",
   "name": "ECDSAInvalidSignature",
   "inputs": []
  },
  {
   "type": "error",
   "name": "ECDSAInvalidSignatureLength",
   "inputs": [
    {
     "name": "length",
     "type": "uint256",
     "internalType": "uint256"
    }
   ]
  },
  {
   "type": "error",
   "name": "ECDSAInvalidSignatureS",
   "inputs": [
    {
     "name": "s",
     "type": "bytes32",
     "internalType": "bytes32"
    }
   ]
  },
  {
   "type": "error",
   "name": "GasSponsor__ExternalCallFailed",
   "inputs": []
  },
  {
   "type": "error",
   "name": "GasSponsor__InsufficientETHBalance",
   "inputs": []
  },
  {
   "type": "error",
   "name": "GasSponsor__InsufficientTestTokenBalance",
   "inputs": []
  },
  {
   "type": "error",
   "name": "GasSponsor__InvalidSigner",
   "inputs": []
  },
  {
   "type": "error",
   "name": "GasSponsor__NonceAlreadyUsed",
   "inputs": []
  },
  {
   "type": "error",
   "name": "GasSponsor__NotAuthorized",
   "inputs": []
  },
  {
   "type": "error",
   "name": "GasSponsor__RefundedFailed",
   "inputs": []
  },
  {
   "type": "error",
   "name": "GasSponsor__TestTokenTransferFailed",
   "inputs": []
  },
  {
   "type": "error",
   "name": "ReentrancyGuardReentrantCall",
   "inputs": []
  }
 ]