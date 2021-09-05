import { Document, model, Schema } from "mongoose";
import { hashSync } from "bcrypt";

export interface IPlayerModel extends Document {
  email: String;
  name?: String;
  username?: String;
  password: string;
  role?: "admin" | "user";
  status?: "Y" | "N";
  avatar?: String;
  fileName?: String;
  phoneNumber?: String;
  favorite?: Schema.Types.ObjectId;
}

const PlayerSchema: Schema<IPlayerModel> = new Schema({
  email: {
    type: String,
    require: [true, "Email harus diisi!"],
  },
  name: {
    type: String,
    require: [true, "Nama harus diisi!"],
    maxLength: [225, "Panjang Nama maksimal 255 karakter"],
    minLength: [3, "Panjang Nama minimal 3 karakter"]
  },
  username: {
    type: String,
    require: [true, "Nama harus diisi!"],
    maxLength: [225, "Panjang Username maksimal 255 karakter"],
    minLength: [3, "Panjang Username minimal 3 karakter"]
  },
  password: {
    type: String,
    require: [true, "Password harus diisi!"],
    maxLength: [225, "Panjang Password maksimal 255 karakter"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  status: {
    type: String,
    enum: ["Y", "N"],
    default: "Y"
  },
  avatar: {
    type: String,
  },
  fileName: {
    type: String,
  },
  phoneNumber: {
    type: String,
    require: [true, "Nomor telepon harus diisi!"],
    maxLength: [13, "Nomor Handpone terlalu panjang!"],
    minLength: [9, "Nomor Handphone terlalu pendek!"]
  },
  favorite: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
}, {timestamps: true});

PlayerSchema.path("email").validate(async function (value: any) {
  try {
    const emailCount = await model<IPlayerModel>("Player", PlayerSchema).countDocuments({ email: value });
    return !emailCount;
  } catch (err) {
    throw err;
  }
}, '`{VALUE}` sudah terdaftar!');

PlayerSchema.pre("save", function(next) {
    this.password = hashSync(this.password, 10);
    next();
});

export default model<IPlayerModel>("Player", PlayerSchema);
