"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const taskController_1 = require("../controllers/taskController");
const router = express_1.default.Router();
//api to add a new task
router.post("/", auth_1.isUserAuthenticated, taskController_1.addTask);
//api to fetch all the tasks
router.get("/", auth_1.isUserAuthenticated, taskController_1.getAllTasks);
//api to fetch task data by id
router.get("/:id", auth_1.isUserAuthenticated, taskController_1.getTask);
//api to update task data by id
router.put("/:id", auth_1.isUserAuthenticated, taskController_1.updateTask);
//api to update task status by id
router.put("/status/:id", auth_1.isUserAuthenticated, taskController_1.updateStatus);
//api to delete task by id
router.delete("/:id", auth_1.isUserAuthenticated, taskController_1.deleteTask);
exports.default = router;
