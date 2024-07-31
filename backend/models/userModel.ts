import mongoose, { Document, Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password is too weak."],
        select: false
    },
});

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

export const User = mongoose.model<IUser>("User", userSchema);