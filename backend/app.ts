import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { config } from 'dotenv';
import { dbConnect } from './config/database';
import userRouter from './routes/userRoute';
import taskRouter from './routes/taskRoute';
import http from 'http';
import { Server } from 'socket.io';


//create a new instance of an express application
const app = express();

const server = http.createServer(app); // create http server
export const socket = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL!],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    },
}); // socket instance

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

//<--------------------------------------------------------------------->

// socket
socket.on('connection', (socket) => {

    console.log("User connected");

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
})


//server to listen all the http requests
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}!`);
})