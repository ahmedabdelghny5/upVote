import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  prodId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }
}, {
  timestamps: true
});


const commentModel = model('comment', commentSchema)


export default commentModel