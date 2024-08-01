import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { IUser } from '../lib';

const cookie_expire: number = Number(process.env.JWT_COOKIE_EXPIRE) | 20;

export const sendToken = (user: IUser, res: Response, message: string, statusCode: number = 200) => {
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET as string, {
        expiresIn: cookie_expire * 24 * 60 * 60 * 1000,
    });

    const userData = {
        name: user.name,
        email: user.email,
    }

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
}