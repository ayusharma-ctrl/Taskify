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
exports.updatePassword = exports.signout = exports.getUserProfile = exports.signin = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = require("../models/userModel");
const sendToken_1 = require("../utils/sendToken");
// method to add new user
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // destruct the data entered by user from req body
        const { username, email, password } = req.body;
        // validation check
        if (!email || !username || !password) {
            return res.status(404).json({
                success: false,
                message: "Please enter all the details before submitting!"
            });
        }
        // find user details with entered email
        let user = yield userModel_1.User.findOne({ email });
        if (user) {
            return res.status(404).json({
                success: false,
                message: "User is already exist!"
            });
        }
        // password validation
        if (email === password) {
            return res.status(404).json({
                success: false,
                message: "Password can not be same as email! Please choose a different password."
            });
        }
        // encrypt password before saving to db, hashing + saltrounds
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        user = yield userModel_1.User.create({
            name: username,
            email,
            password: hashedPassword,
        });
        return res.status(201).json({
            success: true,
            message: "Registered successfully, please signin!",
            user: { name: user === null || user === void 0 ? void 0 : user.name, email: user === null || user === void 0 ? void 0 : user.email },
        });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
});
exports.signup = signup;
// method to signin
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials!"
            });
        }
        const user = yield userModel_1.User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Please register first!"
            });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(404).json({
                success: false,
                message: "Invalid username or password!"
            });
        }
        (0, sendToken_1.sendToken)({ name: user.name, email: user.email }, res, `Welcome back ${user.name}!`, 200);
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
});
exports.signin = signin;
// method to fetch user profile
const getUserProfile = (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user // only authorized users can see their profile data
        });
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};
exports.getUserProfile = getUserProfile;
// method to signout user
const signout = (req, res) => {
    try {
        res.status(200).cookie("auth-token", null, {
            expires: new Date(Date.now()),
        }).json({
            success: true,
            message: "Logged Out!"
        });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};
exports.signout = signout;
// method to update user password
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read input from body
        const { oldPassword, newPassword } = req.body;
        const { email } = req.user; // we aleady have user info
        // validation check
        if (!oldPassword || !newPassword || !email) {
            return res.status(404).json({
                success: false,
                message: "Please enter all the details before submitting!"
            });
        }
        if (newPassword === oldPassword) {
            return res.status(404).json({
                success: false,
                message: "New Password should be unique!"
            });
        }
        // fetch user from db
        const user = yield userModel_1.User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Something went wrong"
            });
        }
        // password validation and comparing passwords
        const isOldPasswordCorrect = yield bcrypt_1.default.compare(oldPassword, user.password);
        // return if old password entered by user is incorrect
        if (!isOldPasswordCorrect) {
            return res.status(404).json({
                success: false,
                message: "Old Password is invalid!"
            });
        }
        // encrypting new password before saving to db
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        // close session
        return res.status(201).cookie("auth-token", null, {
            expires: new Date(Date.now()),
        }).json({
            success: true,
            message: "Password updated, signin now!"
        });
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});
exports.updatePassword = updatePassword;
