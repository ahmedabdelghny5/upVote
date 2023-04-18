import { Schema, model } from "mongoose";

const proSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  prodPicture: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  like: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  unlike: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});


const proModel = model('Product', proSchema)


export default proModel