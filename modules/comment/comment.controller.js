import commentModel from "../../DB/model/comment.model.js";
import proModel from "../../DB/model/products.model.js";



export const addComment = async (req, res) => {
  try {
    const { title, prodId } = req.body;
    const prod = await proModel.findById(prodId)
    if (!prod) { return res.status(400).json({ message: "Product not found" }) }
    const comment = new commentModel({ title, prodId, createdBy: req.user._id });
    const savedComment = comment.save();
    savedComment ? res.status(200).json({ msg: "Comment added", comment }) : res.status(400).json({ message: "fail" })
  } catch (error) {
    console.log(error);
    res.json({ message: "Catch er" });
  }
};

