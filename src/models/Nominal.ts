import { Document, model, Schema } from "mongoose";

export interface INominalModel extends Document {
  coinQuantity: Number;
  coinName: String,
  price: Number;
};

const NominalSchema = new Schema({
  coinQuantity: {
    type: Number,
    default: 0
  },
  coinName: {
    type: String,
    require: [true, 'Nama koin harus diisi!']
  },
  price: {
    type: Number,
    default: 0
  }
}, {timestamps: true});

export default model<INominalModel>("Nominal", NominalSchema);
