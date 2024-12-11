import express from 'express';
import userRouter from './userRouter';
import { login, logout } from '../controllers/authControllers';

const routes = express.Router();

routes.use("/user", userRouter);

// endpoints for user authentication
routes.post("/login", login);
routes.post("/logout", logout);


export default routes;

