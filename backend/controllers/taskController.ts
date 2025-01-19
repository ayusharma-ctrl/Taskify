import mongoose from 'mongoose';
import { Request, Response } from 'express';
import cron from 'node-cron';
import { ITask, Task } from "../models/taskModel";
import { AuthenticatedRequest } from '../middlewares/auth';
import { contract, account } from '../utils/blockchain';
import { formatTaskArray, sanitizeReceipt, signTransaction } from '../utils/helper';
import { User } from '../models/userModel';
import { IUserTask } from '../lib';
import { Notification } from '../models/notificationModel';
import { GoogleGenerativeAI } from "@google/generative-ai";


export const addTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // read the data from req body
        const { title, description, status, priority, deadline }: { title: string, description: string, status: string, priority: string, deadline: Date } = req.body;

        // validation check
        if (![title, status].every(field => field && field.trim().length > 0)) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the required details before submitting!"
            });
        }

        // id of authenticated user
        const { _id } = req.user!;

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
        const tx = contract.methods.addTask(title, description, status, priority, new Date(deadline).getTime(), _id?.toString());

        // Sign the transaction
        await signTransaction(tx);

        const updatedTasks = await contract.methods.getTasks(_id?.toString()).call({ from: account.address });
        const sanitizedTasks = sanitizeReceipt(updatedTasks);
        const formatTasks = formatTaskArray(sanitizedTasks);

        // send the response
        return res.status(200).json({
            success: true,
            message: "Task has been added successfully!",
            tasks: formatTasks || []
        });
    }
    catch (e: any) {
        console.log(e)
        return res.status(500).json({ success: false, message: e.message })
    }
}

export const getAllTasks = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { _id } = req.user!;

        const tasks = await contract.methods.getTasks(_id?.toString()).call({ from: account.address });

        const sanitizedTasks = sanitizeReceipt(tasks);

        const formatTasks = formatTaskArray(sanitizedTasks);

        return res.status(200).json({
            success: true,
            tasks: formatTasks || []
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// export const getAllTasks = async (req: AuthenticatedRequest, res: Response) => {
//     try {
//         const { _id } = req.user!;
//         const tasks: ITask[] = await Task.find({ createdBy: _id });
//         res.status(200).json({success: true, tasks: tasks || []});
//     } catch (err) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }

export const getTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // validation check
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        // find task in db
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        return res.status(200).json({ success: true, task });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;

        // validation check
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        // read the data from req body
        const { title, description, status, priority, deadline }: { title: string, description: string, status: string, priority: string, deadline: Date } = req.body;

        // validation check
        if (![title, status].every(field => field && field.trim().length > 0)) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the details before submitting!"
            })
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
        const tx = contract.methods.updateTask(id, title, description, status, priority, deadline);

        // Sign the transaction
        await signTransaction(tx);

        const { _id } = req.user!; // user id

        const updatedTasks = await contract.methods.getTasks(_id?.toString()).call({ from: account.address });
        const sanitizedTasks = sanitizeReceipt(updatedTasks);
        const formatTasks = formatTaskArray(sanitizedTasks);

        return res.status(200).json({
            success: true,
            message: "Task has been updated successfully!",
            tasks: formatTasks || []
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// method to update task status
export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // validation check
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        // read the data from req body
        const { status }: { status: string } = req.body;

        // validation check
        if (status?.length === 0) {
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

        const tx = contract.methods.updateTaskStatus(id, status);
        await signTransaction(tx);

        return res.status(200).json({
            success: true,
            message: "Task has been updated successfully!",
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deleteTask = async (req: Request, res: Response) => {
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
        const tx = contract.methods.deleteTask(id);
        await signTransaction(tx);

        // if (!result) {
        //     return res.status(404).json({ success: false, error: 'Task not found' });
        // }

        return res.status(204).json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// method to get active notifications
export const getActiveNotifications = async (userId: mongoose.Types.ObjectId) => {
    try {
        const notifications = await Notification.find({
            createdFor: userId,
            expiresAt: { $gt: new Date() }
        });

        return notifications || [];
    } catch (error) {
        console.log(error);
    }
}

// method to generate push notifications for overdue tasks reminder and ai feedback on pending tasks
const sendOverdueTaskReminders = async () => {
    try {
        // get list of all users
        const users = await User.find();

        if (!users || !users.length) return;

        const tasks = await contract.methods.getOverdueTasks().call();
        const sanitizedTasks = sanitizeReceipt(tasks);
        const structTasks: IUserTask[] = formatTaskArray(sanitizedTasks);

        users.forEach((user) => {

            if (user?._id) generateAiSummary(user?._id?.toString());

            const userSpecificTasks = structTasks.filter(task => task?.createdBy === user?._id?.toString());
            if (userSpecificTasks && userSpecificTasks?.length > 0) {
                userSpecificTasks.forEach(async (task) => {
                    const notification = new Notification({
                        type: "reminder",
                        description: `Task "${task?.title}" is overdue.`,
                        createdFor: user?._id,
                        expiresAt: new Date(new Date().setHours(23, 59, 59, 999)), // Set expiry to midnight
                    });
                    await notification.save();
                });
            }
        });

    } catch (error) {
        console.log(error);
    }
}

const generateAiSummary = async (user_id: string) => {
    try {
        if (!user_id) return;

        // get all tasks for this user
        const updatedTasks = await contract.methods.getTasks(user_id).call();
        const sanitizedTasks = sanitizeReceipt(updatedTasks);
        const structTasks: IUserTask[] = formatTaskArray(sanitizedTasks);

        if (!structTasks?.length) return;

        const pendingTasks = structTasks.filter(task => task?.status !== "finished");

        if (!pendingTasks?.length) return;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
        Here is a list of pending tasks of user with title, description, status, priority, and deadline (date in milliseconds).

        ${JSON.stringify(pendingTasks)}
        
        Please do a quick analysis of each tasks. Try to understand and observe the importance of each task. Generate the summary on basis
        of your observation (not more than 30-40 words) and suggest if we need to prioritize specific task irrespective of their current status.

        Do not address tasks like Task 1, address them with their title.

        Example output: "Re-evaluate Task: 'Issue: play icon recording timestamp'. While currently low priority, consider the potential user experience impact of the recording timestamp issue. If this issue negatively affects a significant number of users, its priority should be raised."

        `

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        const notification = new Notification({
            type: "summary",
            description: text,
            createdFor: new mongoose.Types.ObjectId(user_id),
            expiresAt: new Date(new Date().setHours(23, 59, 59, 999)), // Set expiry to midnight
        });
        await notification.save();

    } catch (error) {
        console.log(error);
    }
}

// Schedule the cron job (runs daily at 2 AM)
cron.schedule('0 2 * * *', sendOverdueTaskReminders);
