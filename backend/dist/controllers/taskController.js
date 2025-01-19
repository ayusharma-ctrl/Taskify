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
exports.getActiveNotifications = exports.deleteTask = exports.updateStatus = exports.updateTask = exports.getTask = exports.getAllTasks = exports.addTask = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_cron_1 = __importDefault(require("node-cron"));
const taskModel_1 = require("../models/taskModel");
const blockchain_1 = require("../utils/blockchain");
const helper_1 = require("../utils/helper");
const userModel_1 = require("../models/userModel");
const notificationModel_1 = require("../models/notificationModel");
const generative_ai_1 = require("@google/generative-ai");
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
        const updatedTasks = yield blockchain_1.contract.methods.getTasks(_id === null || _id === void 0 ? void 0 : _id.toString()).call({ from: blockchain_1.account.address });
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
        const { _id } = req.user;
        const tasks = yield blockchain_1.contract.methods.getTasks(_id === null || _id === void 0 ? void 0 : _id.toString()).call({ from: blockchain_1.account.address });
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
        const { _id } = req.user; // user id
        const updatedTasks = yield blockchain_1.contract.methods.getTasks(_id === null || _id === void 0 ? void 0 : _id.toString()).call({ from: blockchain_1.account.address });
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
// method to get active notifications
const getActiveNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield notificationModel_1.Notification.find({
            createdFor: userId,
            expiresAt: { $gt: new Date() }
        });
        return notifications || [];
    }
    catch (error) {
        console.log(error);
    }
});
exports.getActiveNotifications = getActiveNotifications;
// method to generate push notifications for overdue tasks reminder and ai feedback on pending tasks
const sendOverdueTaskReminders = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get list of all users
        const users = yield userModel_1.User.find();
        if (!users || !users.length)
            return;
        const tasks = yield blockchain_1.contract.methods.getOverdueTasks().call();
        const sanitizedTasks = (0, helper_1.sanitizeReceipt)(tasks);
        const structTasks = (0, helper_1.formatTaskArray)(sanitizedTasks);
        users.forEach((user) => {
            var _a;
            if (user === null || user === void 0 ? void 0 : user._id)
                generateAiSummary((_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString());
            const userSpecificTasks = structTasks.filter(task => { var _a; return (task === null || task === void 0 ? void 0 : task.createdBy) === ((_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString()); });
            if (userSpecificTasks && (userSpecificTasks === null || userSpecificTasks === void 0 ? void 0 : userSpecificTasks.length) > 0) {
                userSpecificTasks.forEach((task) => __awaiter(void 0, void 0, void 0, function* () {
                    const notification = new notificationModel_1.Notification({
                        type: "reminder",
                        description: `Task "${task === null || task === void 0 ? void 0 : task.title}" is overdue.`,
                        createdFor: user === null || user === void 0 ? void 0 : user._id,
                        expiresAt: new Date(new Date().setHours(23, 59, 59, 999)), // Set expiry to midnight
                    });
                    yield notification.save();
                }));
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
const generateAiSummary = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!user_id)
            return;
        // get all tasks for this user
        const updatedTasks = yield blockchain_1.contract.methods.getTasks(user_id).call();
        const sanitizedTasks = (0, helper_1.sanitizeReceipt)(updatedTasks);
        const structTasks = (0, helper_1.formatTaskArray)(sanitizedTasks);
        if (!(structTasks === null || structTasks === void 0 ? void 0 : structTasks.length))
            return;
        const pendingTasks = structTasks.filter(task => (task === null || task === void 0 ? void 0 : task.status) !== "finished");
        if (!(pendingTasks === null || pendingTasks === void 0 ? void 0 : pendingTasks.length))
            return;
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
        Here is a list of pending tasks of user with title, description, status, priority, and deadline (date in milliseconds).

        ${JSON.stringify(pendingTasks)}
        
        Please do a quick analysis of each tasks. Try to understand and observe the importance of each task. Generate the summary on basis
        of your observation (not more than 30-40 words) and suggest if we need to prioritize specific task irrespective of their current status.

        Do not address tasks like Task 1, address them with their title.

        Example output: "Re-evaluate Task: 'Issue: play icon recording timestamp'. While currently low priority, consider the potential user experience impact of the recording timestamp issue. If this issue negatively affects a significant number of users, its priority should be raised."

        `;
        const result = yield model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const notification = new notificationModel_1.Notification({
            type: "summary",
            description: text,
            createdFor: new mongoose_1.default.Types.ObjectId(user_id),
            expiresAt: new Date(new Date().setHours(23, 59, 59, 999)), // Set expiry to midnight
        });
        yield notification.save();
    }
    catch (error) {
        console.log(error);
    }
});
// Schedule the cron job (runs daily at 2 AM)
node_cron_1.default.schedule('0 2 * * *', sendOverdueTaskReminders);
