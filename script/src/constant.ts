import {ethers} from "ethers";
import "dotenv/config";

const rpcURL = process.env.RPC_URL;

const PROVIDER = new ethers.JsonRpcProvider(rpcURL)
const CHAIN_ID = 84532
const USER_ADDRESS:any = process.env.USER_ADDRESS;
const SPONSOR_ADDRESS:any = process.env.SPONSOR_ADDRESS;
const GAS_SPONSOR_CONTRACT = process.env.SPONSOR_CONTRACT_ADDRESS;
const USER_PRIVATE_KEY:any = process.env.USER_PRIVATE_KEY;
const SPONSOR_PRIVATE_KEY:any = process.env.SPONSOR_PRIVATE_KEY;
const RECIPIENT_ADDRESS:any = process.env.RECIPIENT_ADDRESS;
const NFT_CONTRACT_ADDRESS:any = process.env.NFT_CONTRACT_ADDRESS;
const NONCE = 1;


export {USER_ADDRESS, RECIPIENT_ADDRESS, NFT_CONTRACT_ADDRESS, PROVIDER, CHAIN_ID, GAS_SPONSOR_CONTRACT,USER_PRIVATE_KEY,SPONSOR_PRIVATE_KEY,SPONSOR_ADDRESS, NONCE};