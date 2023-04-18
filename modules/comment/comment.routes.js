import { Router } from "express";
import { auth } from "../../middlewares/authentication.js";
const router = Router();
import * as commController from './comment.controller.js'


router.post('/', auth(), commController.addComment)


export default router;
