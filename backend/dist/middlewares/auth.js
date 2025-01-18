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
exports.isUserAuthenticated = void 0;
const userModel_1 = require("../models/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Check user is authenticated by verifying their token
const isUserAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get the token from the request cookies
        const cookie_token = req.cookies['auth-token'];
        const header_token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        // If the token doesn't exist, return an error message
        if (!cookie_token && !header_token) {
            return res.status(401).json({
                success: false,
                message: "Please login first!",
            });
        }
        const token = cookie_token || header_token;
        // Verify the token using the JWT secret
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Find the user associated with the decoded email
        const user = yield userModel_1.User.find({ email: decodedToken.email });
        // If the user doesn't exist, return an error message
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }
        // Set the user object in the request for future use
        req.user = user[0];
        // Continue to the next middleware function
        next();
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
});
exports.isUserAuthenticated = isUserAuthenticated;
