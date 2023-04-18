import { Router } from "express";
import { auth } from "../../middlewares/authentication.js";
import { HME, multerValidation, myMulterCloudinary } from "../../utils/multerCloudinary.js";
const router = Router();
import * as productCon from './product.controller.js'

router.post('/',auth(),myMulterCloudinary(multerValidation.image).single("image"),HME , productCon.addProduct)
router.get("/",productCon.getProduct)
router.put("/likeProduct/:id",auth(),productCon.likeProduct)
router.put("/unlikeProduct/:id",auth(),productCon.unlikeProduct)

export default router;
