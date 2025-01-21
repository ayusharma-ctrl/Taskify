import Web3 from "web3";
import { abi } from '../artifacts/contracts/TodoContract.sol/TodoContract.json';
require('dotenv').config();

const {API_URL, PRIVATE_KEY, CONTRACT_ADDRESS, ALCHEMY_WEBSOCKET_URL} = process.env;

const web3 = new Web3(API_URL);
const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

// instances for events
const web3Ws = new Web3(new Web3.providers.WebsocketProvider(ALCHEMY_WEBSOCKET_URL!)); // websockets for events
const contractWs = new web3Ws.eth.Contract(abi, CONTRACT_ADDRESS); // contract for websockets

const account = web3.eth.accounts.privateKeyToAccount(`0x${PRIVATE_KEY}`);
web3.eth.accounts.wallet.add(account);

module.exports = { web3, contract, contractWs, account };

export { web3, contract, contractWs, account }
