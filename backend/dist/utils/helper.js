"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signTransaction = exports.sanitizeReceipt = exports.formatTaskArray = void 0;
const blockchain_1 = require("./blockchain");
const formatTaskArray = (data) => {
    return data.map((item) => {
        const task = {
            id: item === null || item === void 0 ? void 0 : item.id,
            title: item === null || item === void 0 ? void 0 : item.title,
            description: item === null || item === void 0 ? void 0 : item.description,
            status: item === null || item === void 0 ? void 0 : item.status,
            priority: item === null || item === void 0 ? void 0 : item.priority,
            deadline: item === null || item === void 0 ? void 0 : item.deadline,
            createdBy: item === null || item === void 0 ? void 0 : item.createdBy,
        };
        return task;
    });
};
exports.formatTaskArray = formatTaskArray;
const sanitizeReceipt = (data) => {
    return JSON.parse(JSON.stringify(data, (key, value) => typeof value === "bigint" ? value.toString() : value));
};
exports.sanitizeReceipt = sanitizeReceipt;
const signTransaction = (tx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Estimate gas
        const gas = yield tx.estimateGas({ from: blockchain_1.account.address });
        // Fetch the current gas price
        const gasPrice = yield blockchain_1.web3.eth.getGasPrice();
        // Encode the transaction data
        const data = tx.encodeABI();
        // Sign the transaction
        const signedTx = yield blockchain_1.web3.eth.accounts.signTransaction({
            to: blockchain_1.contract.options.address,
            data,
            gas,
            gasPrice,
            from: blockchain_1.account.address,
        }, blockchain_1.account.privateKey);
        yield blockchain_1.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }
    catch (err) {
        console.log(err);
        throw new Error('Failed to sign transaction!');
    }
});
exports.signTransaction = signTransaction;
