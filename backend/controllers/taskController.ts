import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { ITask, Task } from "../models/taskModel";
import { AuthenticatedRequest } from '../middlewares/auth';
import { contract, account } from '../utils/blockchain';
import { formatTaskArray, sanitizeReceipt, signTransaction } from '../utils/helper';


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

        const updatedTasks = await contract.methods.getTasks().call({ from: account.address });
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
        const tasks = await contract.methods.getTasks().call({ from: account.address });

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

export const updateTask = async (req: Request, res: Response) => {
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

        const updatedTasks = await contract.methods.getTasks().call({ from: account.address });
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
