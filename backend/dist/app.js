"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const database_1 = require("./config/database");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const taskRoute_1 = __importDefault(require("./routes/taskRoute"));
//create a new instance of an express application
const app = (0, express_1.default)();
//setting up env file so that we can access the variables
(0, dotenv_1.config)({
    path: ".env"
});
//connect to database
(0, database_1.dbConnect)();
//<---------------------------- Middlewares ---------------------------->
app.use(express_1.default.json()); // to parse json data
app.use(express_1.default.urlencoded({ extended: true })); // to parse urlencoded bodies
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
// route splitting
app.use('/api/v1/auth', userRoute_1.default);
app.use('/api/v1/task', taskRoute_1.default);
//<--------------------------------------------------------------------->
// test Route
app.get("/", (req, res) => {
    return res.send(`<div style = "background:red;padding:100px;height:60vh">
    <h2>Welcome to my Server</h2>
    <p>Crework Fullstack Assignment</p>
    </div>`);
});
//server to listen all the http requests
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}!`);
});
