import { Document, model, Schema } from "mongoose";

export interface ICategoryModel extends Document {
  name: string;
}

const CategorySchema = new Schema({
  name: {
    type: String,
    require: [true, "Nama Kategori harus diisi!"]
  }
}, {timestamps: true})

export default model<ICategoryModel>("Category", CategorySchema);