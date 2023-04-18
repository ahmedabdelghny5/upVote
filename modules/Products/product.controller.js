
import commentModel from "../../DB/model/comment.model.js";
import proModel from "../../DB/model/products.model.js";
import userModel from "../../DB/model/user.model.js";
import { appError } from "../../service/appError.js";
import { catchError } from "../../service/catcherror.js";
import cloudinary from "../../utils/cloudinary.js";

export const addProduct = catchError(async (req, res, next) => {

  const { title, description } = req.body;
  if (!req.file) { return res.status(400).json({ message: "plz enter your pic" }) }
  const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
    folder: `/user/${req.user._id}`
  })
  const newProd = new proModel({ title, description, createdBy: req.user._id, prodPicture: secure_url });
  const savedProd = await newProd.save();
  savedProd ? res.json({ message: "Added success", savedProd }) : next(new appError("added failed", 401));
})

export const getProduct = catchError(async (req, res, next) => {
  const products = await proModel.find().populate([{
    path: "createdBy",
    select: "name email "
  }])
  let arrProd = [];
  // for (const product of products) {
  //   const comment =await commentModel.find({prodId:product._id}).populate([{
  //     path:"createdBy",
  //     select:"name email "
  //   }])
  //   const covertProd=product.toObject()
  //   covertProd.comment=comment
  //   arrProd.push(covertProd);
  // }
  const cursor = proModel.find({}).cursor();

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const comment = await commentModel.find({ prodId: doc._id }).populate([{
      path: "createdBy",
      select: "name email "
    }])
    const covertProd = doc.toObject()
    covertProd.comment = comment
    arrProd.push(covertProd);
  }
  res.status(200).json(arrProd);
})

/////////////////////////// like product ////////////////////////////
export const likeProduct = catchError(async (req, res, next) => {
  const { id } = req.params
  const prod = await proModel.findOneAndUpdate({ _id: id, like: { $nin: req.user._id } }, {
    $addToSet: { like: req.user._id },
    $pull: { unlike: req.user._id },
  }, { new: true })
  if (!prod) {
    const prod = await proModel.findOneAndUpdate({ _id: id, like: { $in: req.user._id } }, {
      $addToSet: { unlike: req.user._id },
      $pull: { like: req.user._id },
    }, { new: true })
    prod.totalCount = prod.like.length - prod.unlike.length
    prod.save()
    return res.status(200).json({ msg: "unlike", prod })
  }
  prod.totalCount = prod.like.length - prod.unlike.length
  prod.save()
  prod ? res.status(200).json({ msg: "like", prod }) : next(new appError("fail", 401));

})
///////////////////////////un like product //////////////////////////
export const unlikeProduct = catchError(async (req, res, next) => {
  const { id } = req.params
  const prod = await proModel.findOneAndUpdate({ _id: id, unlike: { $nin: req.user._id } }, {
    $addToSet: { unlike: req.user._id },
    $pull: { like: req.user._id },
  }, { new: true })
  if (!prod) {
    const prod = await proModel.findOneAndUpdate({ _id: id, unlike: { $in: req.user._id } }, {
      $addToSet: { like: req.user._id },
      $pull: { unlike: req.user._id },
    }, { new: true })
    prod.totalCount = prod.like.length - prod.unlike.length
    prod.save()
    return res.status(200).json({ msg: "like", prod })
  }
  prod.totalCount = prod.like.length - prod.unlike.length
  prod.save()
  prod ? res.status(200).json({ msg: "unlike", prod }) : res.status(400).json({ msg: "fail" });
})