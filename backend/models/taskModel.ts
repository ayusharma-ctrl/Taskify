import mongoose, { Schema, Document } from 'mongoose';

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: true
    },
    priority: {
        type: String,
    },
    deadline: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

export interface ITask extends Document {
    title: string;
    description: string;
    status: string;
    priority: string;
    deadline: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy: mongoose.Types.ObjectId;
}

export const Task = mongoose.model<ITask>("Task", taskSchema);