//======================== Sign Up ===================

import userModel from "../../DB/model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../../utils/cloudinary.js";
import proModel from "../../DB/model/products.model.js";
import { catchError } from "../../service/catcherror.js";
import { appError } from "../../service/appError.js";


export const signUp = catchError(async (req, res, next) => {

  const { name, email, password, } = req.body;
  const userCheck = await userModel.findOne({ email }); //{} null
  if (!userCheck) {
    const hashPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
    const newUser = new userModel({ name, email, password: hashPassword });
    const savedUser = await newUser.save();
    if (!savedUser) {
      next(new appError("sign up fail", 401))
    }
    res.json({ message: "Sign up success", savedUser });
  }
  next(new appError("email is already registered", 401))

})

//============================= Sign In ====================
export const signin = catchError(async (req, res) => {

  const { email, password } = req.body;
  const userExist = await userModel.findOne({ email });
  if (userExist) {
    const match = bcrypt.compareSync(password, userExist.password); // boolean
    if (match) {
      const token = jwt.sign(
        { id: userExist._id, email: userExist.email },
        process.env.TOKEN_SIGNATURE,
        // {expiresIn:}
      );
      res.json({ message: "Login Success", token });
    } else {
      next(new appError("in-valid login information", 401))
    }
  } else {
    next(new appError("in-valid login information", 401))
  }
})

///////////////profile picture //////////////////////////////////
export const profilePicture = catchError(async (req, res, next) => {
  const id = req.user._id;
  if (!req.file) { return res.json({ message: "plz enter your pic" }); }
  // const imgUrl = req.file.destination + '/' + req.file.filename
  const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
    folder: `/user/${id}`
  })
  const user = await userModel.findByIdAndUpdate({ _id: id }, { profilePic: secure_url }, { new: true });
  user ? res.status(200).json({ message: "success" }) : next(new appError("fail", 401))

})
///////////////cover picture //////////////////////////////////

export const cover = catchError(async (req, res, next) => {
  const id = req.user._id;
  if (!req.files) { return res.json({ message: "plz enter your pic" }); }
  let imgUrl = [];
  for (const file of req.files) {
    imgUrl.push(file.destination + '/' + file.filename)
  }
  const user = await userModel.findByIdAndUpdate({ _id: id }, { cover: imgUrl }, { new: true });
  user ? res.status(200).json({ message: "success" }) : next(new appError("fail", 401))
})

export const allUsers = catchError(async (req, res, next) => {
  const users = await userModel.find()
  let arrUsers = [];
  for (const user of users) {
    const product = await proModel.find({ createdBy: user._id }).populate([{
      path: 'createdBy',
      select: "name email"
    }])
    let covertUser = user.toObject()
    covertUser.product = product
    arrUsers.push(covertUser);
  }
  res.status(200).json(arrUsers);
})