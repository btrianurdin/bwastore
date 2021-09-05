import { Document, model, Schema } from "mongoose";

export interface IUserModel extends Document {
  email: String;
  name?: String;
  password: string;
  role?: "admin" | "user";
  status?: "Y" | "N";
  phoneNumber?: String;
}

const UserSchema = new Schema({
  email: {
    type: String,
    require: [true, "Email harus diisi!"],
  },
  name: {
    type: String,
    require: [true, "Nama harus diisi!"]
  },
  password: {
    type: String,
    require: [true, "Password harus diisi!"]
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "admin"
  },
  status: {
    type: String,
    enum: ["Y", "N"],
    default: "Y"
  },
  phoneNumber: {
    type: String,
    require: [true, "Nomor telepon harus diisi!"]
  }
}, {timestamps: true});

export default model<IUserModel>("User", UserSchema);
