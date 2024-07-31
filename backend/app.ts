import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { config } from 'dotenv';
import { dbConnect } from './config/database';
import userRouter from './routes/userRoute';
import taskRouter from './routes/taskRoute';


//create a new instance of an express application
const app = express();

//setting up env file so that we can access the variables
config({
    path: ".env"
});


//connect to database
dbConnect();


//<---------------------------- Middlewares ---------------------------->
app.use(express.json()); // to parse json data
app.use(express.urlencoded({ extended: true })); // to parse urlencoded bodies
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL as string],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))


// route splitting
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/task', taskRouter);

//<--------------------------------------------------------------------->


// test Route
app.get("/", (req, res) => {
    return res.send(`<div style = "background:red;padding:100px;height:60vh">
    <h2>Welcome to my Server</h2>
    <p>Crework Fullstack Assignment</p>
    </div>`)
})

//server to listen all the http requests
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}!`);
})