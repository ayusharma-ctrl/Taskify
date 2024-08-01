import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { sendToken } from '../utils/sendToken';
import { AuthenticatedRequest } from '../middlewares/auth';

// method to add new user
export const signup = async (req: Request, res: Response) => {
    try {
        // destruct the data entered by user from req body
        const { username, email, password }: { username: string, email: string, password: string } = req.body;

        // validation check
        if (!email || !username || !password) {
            return res.status(404).json({
                success: false,
                message: "Please enter all the details before submitting!"
            })
        }

        // find user details with entered email
        let user = await User.findOne({ email })
        if (user) {
            return res.status(404).json({
                success: false,
                message: "User is already exist!"
            })
        }

        // password validation
        if (email === password) {
            return res.status(404).json({
                success: false,
                message: "Password can not be same as email! Please choose a different password."
            })
        }

        // encrypt password before saving to db, hashing + saltrounds
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            name: username,
            email,
            password: hashedPassword,
        })

        return res.status(201).json({
            success: true,
            message: "Registered successfully, please signin!",
            user: { name: user?.name, email: user?.email },
        });
    }
    catch (e: any) {
        return res.status(500).json({ success: false, message: e.message })
    }
}

// method to signin
export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials!"
            });
        }

        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Please register first!"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(404).json({
                success: false,
                message: "Invalid username or password!"
            })
        }

        sendToken({ name: user.name, email: user.email }, res, `Welcome back ${user.name}!`, 200);
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
}

// method to fetch user profile
export const getUserProfile = (req: AuthenticatedRequest, res: Response) => {
    try {
        res.json({
            success: true,
            user: req.user // only authorized users can see their profile data
        })
    }
    catch (e: any) {
        res.status(500).json({ success: false, message: e.message });
    }
}

// method to signout user
export const signout = (req: Request, res: Response) => {
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
}

// method to update user password
export const updatePassword = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // read input from body
        const { oldPassword, newPassword }: { oldPassword: string, newPassword: string } = req.body;

        const { email } = req.user!; // we aleady have user info

        // validation check
        if (!oldPassword || !newPassword || !email) {
            return res.status(404).json({
                success: false,
                message: "Please enter all the details before submitting!"
            })
        }

        if (newPassword === oldPassword) {
            return res.status(404).json({
                success: false,
                message: "New Password should be unique!"
            });
        }

        // fetch user from db
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Something went wrong"
            })
        }

        // password validation and comparing passwords
        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

        // return if old password entered by user is incorrect
        if (!isOldPasswordCorrect) {
            return res.status(404).json({
                success: false,
                message: "Old Password is invalid!"
            })
        }

        // encrypting new password before saving to db
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // close session
        return res.status(201).cookie("auth-token", null, {
            expires: new Date(Date.now()),
        }).json({
            success: true,
            message: "Password updated, signin now!"
        })
    }
    catch (e: any) {
        res.status(500).json({ success: false, message: e.message });
    }
}