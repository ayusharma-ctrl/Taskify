import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";


export interface AuthenticatedRequest extends Request {
    user?: IUser;
}

interface CustomJwtPayload extends JwtPayload {
    email: string;
}

// Check user is authenticated by verifying their token
export const isUserAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Get the token from the request cookies
        const cookie_token = req.cookies['auth-token'];

        const header_token = req.headers['authorization']?.split(' ')[1];

        // If the token doesn't exist, return an error message
        if (!cookie_token && !header_token) {
            return res.status(401).json({
                success: false,
                message: "Please login first!",
            });
        }

        const token = cookie_token || header_token;

        // Verify the token using the JWT secret
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;

        // Find the user associated with the decoded email
        const user: any = await User.find({ email: decodedToken.email });

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
};