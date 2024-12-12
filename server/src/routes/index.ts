import express from 'express';
import userRouter from './userRouter';
import { login, logout } from '../controllers/authControllers';
import NFTRouter from './nftRouter';

const routes = express.Router();

routes.use("/user", userRouter);
routes.use('/nft', NFTRouter);

// endpoints for user authentication
routes.post("/login", login);
routes.post("/logout", logout);


export default routes;

