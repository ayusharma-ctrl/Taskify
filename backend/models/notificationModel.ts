import mongoose, { Schema, Document } from 'mongoose';

const notificationSchema = new Schema({
    type: {
        type: String,
        required: true,
        trim: true,
        enum: ["reminder", "summary"],
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    createdFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
    },
}, { timestamps: true });

export interface INotification extends Document {
    type: "reminder" | "summary";
    description: string;
    createdAt: Date;
    updatedAt: Date;
    createdFor: mongoose.Types.ObjectId;
    expiresAt: Date;
}

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);