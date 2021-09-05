import { Document, model, Schema } from "mongoose";
import { IHistoryPayment, IHistoryUser, IHistoryVoucerTopup } from "../interfaces/Transaction";

export interface ITransactionModel extends Document {
  historyVoucherTopup: IHistoryVoucerTopup;
  historyPayment: IHistoryPayment;
  name: String;
  accountUser: String;
  tax: Number;
  value: Number;
  status: "pending" | "success" | "failed";
  player: Schema.Types.ObjectId;
  historyUser: IHistoryUser;
  category: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
}

const TransactionSchema = new Schema({
  historyVoucherTopup: {
    gameName: { type: String, require: [true, "Nama Game harus diisi!"]},
    category: { type: String, require: [true, "Kategori harus diisi!"]},
    thumbnail: { type: String},
    coinName: { type: String, require: [true, "Nama Koin harus diisi!"]},
    coinQuantity: { type: String, require: [true, "Jumlah Koin harus diisi!"]},
    price: { type: Number},
  },
  historyPayment: {
    name: { type: String, require: [true, "Nama harus diisi!"]},
    type: { type: String, require: [true, "Tipe Pembayaran harus diisi!"]},
    bankName: { type: String, required: [true, "Nama Bank harus diisi!"]},
    noRekening: { type: String, require: [true, "Nomor rekening harus diisi!"]}
  },
  name: {
    type: String,
    require: [true, "Nama harus diisi!"],
    maxLength: [225, "Panjang Nama maksimal 255 karakter"],
    minLength: [3, "Panjang Nama minimal 3 karakter"]
  },
  accountUser: {
    type: String,
    require: [true, "Nama akun harus diisi"],
    maxLength: [225, "Panjang Nama maksimal 255 karakter"],
    minLength: [3, "Panjang Nama minimal 3 karakter"]
  },
  tax: {
    type: Number,
    default: 0
  },
  value: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: "Player"
  },
  historyUser: {
    name: { type: String, require: [true, "Nama Player harus diisi!"]},
    phoneNumber: {
      type: String,
      require: [true, "Nomor Handpone harus diisi!"],
      maxLength: [13, "Nomor Handpone terlalu panjang!"],
      minLength: [9, "Nomor Handphone terlalu pendek!"]
    }
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {timestamps: true});

export default model<ITransactionModel>("Transaction", TransactionSchema);
