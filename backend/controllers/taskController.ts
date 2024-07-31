import { Request, Response } from 'express';
import { ITask, Task } from "../models/taskModel";
import { AuthenticatedRequest } from '../middlewares/auth';


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
        const task = await Task.create({
            title,
            description,
            status,
            priority,
            deadline,
            createdBy: _id
        })

        // send the response
        return res.status(200).json({
            success: true,
            message: "Task has been added successfully!",
            task
        });
    }
    catch (e: any) {
        return res.status(500).json({ success: false, message: e.message })
    }
}

export const getAllTasks = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { _id } = req.user!;
        const tasks: ITask[] = await Task.find({ createdBy: _id });
        res.status(200).json({success: true, tasks: tasks || []});
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

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

        return res.status(200).json({success: true, task});
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
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // save latest details
        task.title = title;
        task.description = description;
        task.status = status;
        task.priority = priority;
        task.deadline = deadline;
        await task.save();

        return res.status(200).json({
            success: true,
            message: "Task has been updated successfully!",
            task
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // validation check
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        const result = await Task.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ error: 'Task not found' });
        }

        return res.status(204).json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}