"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_expire = Number(process.env.JWT_COOKIE_EXPIRE) | 20;
const sendToken = (user, res, message, statusCode = 200) => {
    const token = jsonwebtoken_1.default.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: cookie_expire * 24 * 60 * 60 * 1000,
    });
    const userData = {
        name: user.name,
        email: user.email,
    };
    res.status(statusCode).cookie("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        expires: new Date(Date.now() + cookie_expire * 24 * 60 * 60 * 1000),
    }).json({
        success: true,
        message,
        user: userData,
    });
};
exports.sendToken = sendToken;
