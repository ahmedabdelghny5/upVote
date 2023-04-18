
import jwt from "jsonwebtoken";
import userModel from "../DB/model/user.model.js";
import { appError } from "../service/appError.js";

export const auth = () => {
  return async (req, res, next) => {
    try {
      const { auth } = req.headers;
      if (!auth) {
        // return res.json({ message: "Please enter your token" });
        return next(new appError("Please enter your token",401))
      }
      if (!auth.startsWith(process.env.PREFIX_TOKEN)) {
        return res.json({ message: "Wrong prefix" });
      }
      //   console.log(auth);
      const token = auth.split(process.env.PREFIX_TOKEN)[1];
      // console.log(token);
      const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE);
      // console.log(decoded);
      if (!decoded || !decoded.id) {
        return res.json({ message: "in-valid token payload" });
      }
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.json({ message: "this user doesnot exist any more" });
      }
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      res.json({ message: "catch error  in auth" });
    }
  };
};

