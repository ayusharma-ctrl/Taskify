import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Database is connected.")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}