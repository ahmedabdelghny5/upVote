import { Router } from "express";
import { auth } from "../../middlewares/authentication.js";
import { HME, multerValidation, myMulter } from "../../utils/multer.js";
import { myMulterCloudinary } from "../../utils/multerCloudinary.js";
// import { HME, multerValidation, myMulter } from "../../utils/multer.js";
const router = Router();
import * as userController from "./user.controller.js";


router.post('/signup'  , userController.signUp)
router.post('/signin' , userController.signin)
router.get('/allUsers' , userController.allUsers)
// router.patch('/profilePicture',auth(),myMulter('/profile',multerValidation.image).single("image"),HME, userController.profilePicture)
router.patch('/profilePicture',auth(),myMulterCloudinary(multerValidation.image).single("image"),HME, userController.profilePicture)
router.patch('/cover',auth(),myMulter('/cover',multerValidation.image).array("image"),HME, userController.cover)

export default router;
