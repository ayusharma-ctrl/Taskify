"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.account = exports.contract = exports.web3 = void 0;
const web3_1 = __importDefault(require("web3"));
const TodoContract_json_1 = require("../artifacts/contracts/TodoContract.sol/TodoContract.json");
require('dotenv').config();
const { API_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;
const web3 = new web3_1.default(API_URL);
exports.web3 = web3;
const contract = new web3.eth.Contract(TodoContract_json_1.abi, CONTRACT_ADDRESS);
exports.contract = contract;
const account = web3.eth.accounts.privateKeyToAccount(`0x${PRIVATE_KEY}`);
exports.account = account;
web3.eth.accounts.wallet.add(account);
module.exports = { web3, contract, account };
