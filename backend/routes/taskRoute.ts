import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth';
import { addTask, getAllTasks, getTask, updateTask, deleteTask } from '../controllers/taskController';

const router = express.Router();

//api to add a new task
router.post("/", isUserAuthenticated, addTask);

//api to fetch all the tasks
router.get("/", isUserAuthenticated, getAllTasks);

//api to fetch task data by id
router.get("/:id", isUserAuthenticated, getTask);

//api to update task data by id
router.put("/:id", isUserAuthenticated, updateTask);

//api to delete task by id
router.delete("/:id", isUserAuthenticated, deleteTask);

export default router;