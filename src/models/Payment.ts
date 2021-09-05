import { Document, model, Schema } from "mongoose";

export interface IPaymentModel extends Document {
  type: String;
  status: String;
  banks: Schema.Types.ObjectId[];
}

const PaymentSchema = new Schema({
  type: {
    type: String,
    require: [true, "Tipe pembayaran harus diisi!"],
  },
  status: {
    type: String,
    enum: ["Y", "N"],
    default: "Y"
  },
  banks: [{
    type: Schema.Types.ObjectId,
    ref: "Bank"
  }],
}, {timestamps: true});

export default model<IPaymentModel>("Payment", PaymentSchema);
