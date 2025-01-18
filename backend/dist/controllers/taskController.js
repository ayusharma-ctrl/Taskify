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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateStatus = exports.updateTask = exports.getTask = exports.getAllTasks = exports.addTask = void 0;
const taskModel_1 = require("../models/taskModel");
const mongoose_1 = __importDefault(require("mongoose"));
const blockchain_1 = require("../utils/blockchain");
const addTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read the data from req body
        const { title, description, status, priority, deadline } = req.body;
        // validation check
        if (![title, status].every(field => field && field.trim().length > 0)) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the required details before submitting!"
            });
        }
        // id of authenticated user
        // const { _id } = req.user!;
        // save task in db
        // const task = await Task.create({
        //     title,
        //     description,
        //     status,
        //     priority,
        //     deadline,
        //     createdBy: _id,
        //     createdAt: new Date(),
        // })
        const tx = blockchain_1.contract.methods.addTask(title, description, status, priority, new Date(deadline).getTime());
        const gas = yield tx.estimateGas({ from: blockchain_1.account.address });
        const data = tx.encodeABI();
        const signedTx = yield blockchain_1.web3.eth.accounts.signTransaction({
            to: blockchain_1.contract.options.address,
            data,
            gas,
        }, blockchain_1.account.privateKey);
        const receipt = yield blockchain_1.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        // send the response
        return res.status(200).json({
            success: true,
            message: "Task has been added successfully!",
            receipt
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: e.message });
    }
});
exports.addTask = addTask;
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        const tasks = yield taskModel_1.Task.find({ createdBy: _id });
        res.status(200).json({ success: true, tasks: tasks || [] });
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getAllTasks = getAllTasks;
const getTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // validation check
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }
        // find task in db
        const task = yield taskModel_1.Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        return res.status(200).json({ success: true, task });
    }
    catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getTask = getTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // validation check
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }
        // read the data from req body
        const { title, description, status, priority, deadline } = req.body;
        // validation check
        if (![title, status].every(field => field && field.trim().length > 0)) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the details before submitting!"
            });
        }
        // find task in db
        const task = yield taskModel_1.Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        // save latest details
        task.title = title;
        task.description = description;
        task.status = status;
        task.priority = priority;
        task.deadline = deadline;
        yield task.save();
        return res.status(200).json({
            success: true,
            message: "Task has been updated successfully!",
            task
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateTask = updateTask;
// method to update task status
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // validation check
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }
        // read the data from req body
        const { status } = req.body;
        // validation check
        if ((status === null || status === void 0 ? void 0 : status.length) === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid status type!"
            });
        }
        // find task in db
        const task = yield taskModel_1.Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        // save latest status
        task.status = status;
        yield task.save();
        return res.status(200).json({
            success: true,
            message: "Task has been updated successfully!",
            task
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateStatus = updateStatus;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // validation check
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid task ID' });
        }
        const result = yield taskModel_1.Task.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }
        return res.status(204).json({ success: true, message: 'Task deleted successfully' });
    }
    catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteTask = deleteTask;
