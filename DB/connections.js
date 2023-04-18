import mongoose from "mongoose";

export const connectionDB = async () => {
  return await mongoose
    .connect(process.env.DB_URL_LOCAL)
    .then((res) => {
      console.log("DB Conncted successfully");
    })
    .catch((err) =>
      console.log({ message: "Fail to connecto to DB", error: err })
    );
};

mongoose.set('strictQuery', true)