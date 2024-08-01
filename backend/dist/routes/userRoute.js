"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
//api to add new user
router.post("/signup", userController_1.signup);
//api to login
router.post("/signin", userController_1.signin);
//api to logout
router.get("/signout", userController_1.signout);
//api to get user's profile
router.get("/user", auth_1.isUserAuthenticated, userController_1.getUserProfile);
//api to update user's password
router.put("/password-update", auth_1.isUserAuthenticated, userController_1.updatePassword);
exports.default = router;
