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
exports.deleteTask = exports.updateStatus = exports.updateTask = exports.getTask = exports.getAllTasks = exports.addTask = void 0;
const taskModel_1 = require("../models/taskModel");
const blockchain_1 = require("../utils/blockchain");
const helper_1 = require("../utils/helper");
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
        const { _id } = req.user;
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
        // Prepare the transaction
        const tx = blockchain_1.contract.methods.addTask(title, description, status, priority, new Date(deadline).getTime(), _id === null || _id === void 0 ? void 0 : _id.toString());
        // Sign the transaction
        yield (0, helper_1.signTransaction)(tx);
        const updatedTasks = yield blockchain_1.contract.methods.getTasks().call({ from: blockchain_1.account.address });
        const sanitizedTasks = (0, helper_1.sanitizeReceipt)(updatedTasks);
        const formatTasks = (0, helper_1.formatTaskArray)(sanitizedTasks);
        // send the response
        return res.status(200).json({
            success: true,
            message: "Task has been added successfully!",
            tasks: formatTasks || []
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
        const tasks = yield blockchain_1.contract.methods.getTasks().call({ from: blockchain_1.account.address });
        const sanitizedTasks = (0, helper_1.sanitizeReceipt)(tasks);
        const formatTasks = (0, helper_1.formatTaskArray)(sanitizedTasks);
        return res.status(200).json({
            success: true,
            tasks: formatTasks || []
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.getAllTasks = getAllTasks;
// export const getAllTasks = async (req: AuthenticatedRequest, res: Response) => {
//     try {
//         const { _id } = req.user!;
//         const tasks: ITask[] = await Task.find({ createdBy: _id });
//         res.status(200).json({success: true, tasks: tasks || []});
//     } catch (err) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }
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
        // const task = await Task.findById(id);
        // if (!task) {
        //     return res.status(404).json({ error: 'Task not found' });
        // }
        // // save latest details
        // task.title = title;
        // task.description = description;
        // task.status = status;
        // task.priority = priority;
        // task.deadline = deadline;
        // await task.save();
        // Prepare the transaction
        const tx = blockchain_1.contract.methods.updateTask(id, title, description, status, priority, deadline);
        // Sign the transaction
        yield (0, helper_1.signTransaction)(tx);
        const updatedTasks = yield blockchain_1.contract.methods.getTasks().call({ from: blockchain_1.account.address });
        const sanitizedTasks = (0, helper_1.sanitizeReceipt)(updatedTasks);
        const formatTasks = (0, helper_1.formatTaskArray)(sanitizedTasks);
        return res.status(200).json({
            success: true,
            message: "Task has been updated successfully!",
            tasks: formatTasks || []
        });
    }
    catch (err) {
        console.log(err);
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
        // const task = await Task.findById(id);
        // if (!task) {
        //     return res.status(404).json({ error: 'Task not found' });
        // }
        // // save latest status
        // task.status = status;
        // await task.save();
        const tx = blockchain_1.contract.methods.updateTaskStatus(id, status);
        yield (0, helper_1.signTransaction)(tx);
        return res.status(200).json({
            success: true,
            message: "Task has been updated successfully!",
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateStatus = updateStatus;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // task id
        // validate task id
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).json({ success: false, error: 'Invalid task ID' });
        // }
        if (!id) {
            return res.status(400).json({ success: false, error: 'Invalid task ID' });
        }
        // delete form mongoDb
        // const result = await Task.findByIdAndDelete(id);
        // delete from contract
        const tx = blockchain_1.contract.methods.deleteTask(id);
        yield (0, helper_1.signTransaction)(tx);
        // if (!result) {
        //     return res.status(404).json({ success: false, error: 'Task not found' });
        // }
        return res.status(204).json({ success: true, message: 'Task deleted successfully' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteTask = deleteTask;
