import { Document, model, Schema } from "mongoose";

export interface IVoucherModel extends Document {
  name: String;
  status?: "Y" | "N";
  thumbnail?: String;
  category: Schema.Types.ObjectId;
  nominals: Schema.Types.ObjectId[];
  user?: Schema.Types.ObjectId;
}

const VoucherSchema = new Schema({
  name: {
    type: String,
    require: [true, "Nama game harus diisi!"],
  },
  status: {
    type: String,
    enum: ['Y', 'N'],
    default: 'Y'
  },
  thumbnail: {
    type: String
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  nominals: [{
    type: Schema.Types.ObjectId,
    ref: 'Nominal'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});

export default model<IVoucherModel>("Voucher", VoucherSchema);
