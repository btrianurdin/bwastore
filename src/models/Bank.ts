import { Document, model, Schema } from "mongoose";

export interface IBankModel extends Document {
  name: String;
  bankName: String;
  noRekening: String;
}

const BankSchema = new Schema({
  name: {
    type: String,
    require: [true, "Nama pemilik harus diisi!"],
  },
  bankName: {
    type: String,
    require: [true, "Nama bank harus diisi!"],
  },
  noRekening: {
    type: String,
    require: [true, "Nomor rekening bank harus diisi!"],
  },
}, {timestamps: true});

export default model<IBankModel>("Bank", BankSchema);
