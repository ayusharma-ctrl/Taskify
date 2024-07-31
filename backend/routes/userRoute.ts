import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth';
import { getUserProfile, signin, signout, signup, updatePassword } from '../controllers/userController';


const router = express.Router();

//api to add new user
router.post("/signup", signup);

//api to login
router.post("/signin", signin);

//api to logout
router.get("/signout", signout);

//api to get user's profile
router.get("/user", isUserAuthenticated, getUserProfile);

//api to update user's password
router.put("/password-update", isUserAuthenticated, updatePassword);


export default router;