import express from 'express';
import { createNFTController, getNFTController, getNFTsController } from '../controllers/NFTControllers';

const NFTRouter = express.Router();

NFTRouter.get("/", getNFTsController);

NFTRouter.get("/:address", getNFTController);

NFTRouter.post("/", createNFTController);

export default NFTRouter;