"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.account = exports.contract = exports.web3 = void 0;
const web3_1 = __importDefault(require("web3"));
const fs_1 = __importDefault(require("fs"));
const web3 = new web3_1.default(process.env.API_URL);
exports.web3 = web3;
const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = JSON.parse(fs_1.default.readFileSync("../artifacts/contracts/TodoContract.sol/TodoContract.json", "utf8"));
const contract = new web3.eth.Contract(abi, contractAddress);
exports.contract = contract;
const privateKey = process.env.PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
exports.account = account;
web3.eth.accounts.wallet.add(account);
module.exports = { web3, contract, account };
