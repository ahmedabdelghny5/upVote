import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: { type: String, required: true },
    cover:Array
  },
  {
    timestamps: true,
  }
);

const userModel = model("User", userSchema);

export default userModel;
