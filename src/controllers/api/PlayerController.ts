import { Request, Response } from "express";
import { unlink, unlinkSync } from "fs";
import { join } from "path";
import Category from "../../models/Category";
import Nominal from "../../models/Nominal";
import Payment from "../../models/Payment";
import Bank from "../../models/Bank";
import Voucher, { IVoucherModel } from "../../models/Voucher";
import Transaction from "../../models/Transaction";
import Player, { IPlayerModel } from "../../models/Player";
import ApiAuthController from "./ApiAuthContoller";

export default class PlayerController {
  static async landingPage(req: Request, res: Response) {
    try {
      const voucher = await Voucher.find()
        .select("_id name status cetegory thumbnail")
        .populate("category");

      res.status(200).json({
        status: "succes",
        data: voucher,
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err?.message || "Kesalahan saat request data!",
      });
    }
  }

  static async detailPage(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const voucher = await Voucher.findOne({ _id: id })
        .populate("category")
        .populate("nominals")
        .populate("user", "_id name phoneNumber");
      
      const payments = await Payment.find()
        .populate('banks');

      res.status(200).json({
        status: "success",
        data: {
          detail: voucher,
          payments,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err?.message || "Kesalahan saat request data!",
      });
    }
  }

  static async allCategory(req: Request, res: Response) {
    try {
      const categories = await Category.find();

      res.status(200).json({
        status: "success",
        data: categories,
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err?.message || "Kesalahan saat request data!",
      });
    }
  }

  static async checkout(req: Request, res: Response) {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = req.body;

      try {
        const resVoucher = await Voucher.findOne({ _id: voucher })
          .select("name category thumbnail user")
          .populate("category")
          .populate("user");

        const resNominal = await Nominal.findOne({ _id: nominal });
        if (!resNominal) throw new Error("Nominal tidak ditemukan!");
        const resPayment = await Payment.findOne({ _id: payment });
        if (!resPayment) throw new Error("Payment tidak ditemukan!");
        const resBank = await Bank.findOne({ _id: bank });
        if (!resBank) throw new Error("Bank tidak ditemukan!");

        const tax = (resNominal["price"] as number) * (10 / 100);
        const value = (resNominal["price"] as number) - tax;

        const payload = {
          historyVoucherTopup: {
            gameName: resVoucher["name"],
            category: resVoucher["category"]
              ? resVoucher["category"]["name"]
              : "",
            thumbnail: resVoucher["thumbnail"],
            coinName: resNominal["coinName"],
            coinQuantity: resNominal["coinQuantity"],
            price: resNominal["price"],
          },
          historyPayment: {
            name: resBank["name"],
            type: resPayment["type"],
            bankName: resBank["bankName"],
            noRekening: resBank["noRekening"],
          },
          name: name,
          accountUser: accountUser,
          tax: tax,
          value: value,
          player: req["player"]["id"],
          historyUser: {
            name: resVoucher["user"] ? resVoucher["user"]["_id"] : "",
            phoneNumber: resVoucher["user"]
              ? resVoucher["user"]["phoneNumber"]
              : "",
          },
          category: resVoucher["category"] ? resVoucher["category"]["_id"] : "",
          user: resVoucher["user"] ? resVoucher["user"]["_id"] : "",
        };

        const transaction = new Transaction(payload);
        transaction
          .save()
          .then(() => {
            res.status(200).json({
              status: "success",
              data: payload,
            });
          })
          .catch((err) => {
            res.status(500).json({
              status: "error",
              message: err?.message,
            });
          });
      } catch (err) {
        res.status(404).json({
          status: "error",
          message: err.message,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err?.message || "Kesalahan saat request data!",
      });
    }
  }

  static async profile(req: Request, res: Response) {
    try {
      const player = await Player.findById(req["player"]["id"])
        .select("_id email phoneNumber username name avatar");

      res.status(200).json({
        status: "success",
        data: player
      })

    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err?.message || "Terjadi kesalahan saat request data!"
      })
    }
  }

  static async profileEdit(req: Request, res: Response) {
    try {
      const { name = "", phoneNumber = "" } = req.body as IPlayerModel;

      let editObj = {
        name,
        phoneNumber
      };

      if (name.length < 1) delete editObj.name;
      if (phoneNumber.length < 1) delete editObj.phoneNumber;

      if (req.file) {
        editObj["avatar"] = req.file.filename
      }

      const oldAvatar = await Player.findById(req["player"]["id"]).select("avatar");

      Player.findOneAndUpdate({_id: req["player"]["id"]}, editObj, {
        new: true, runValidators: true
      })
      .then(result => {
        if (req.file && oldAvatar.avatar) {
          unlinkSync(
            join(__dirname, `../../../public/uploads/${oldAvatar.avatar}`)
          );
        }
        res.status(200).json({
          status: "success",
          data: {
            id: result["_id"],
            name: result["name"],
            phoneNumber: result["phoneNumber"],
            avatar: result["avatar"]
          },
        });
      })
      .catch(err => {
        if (req.file) {
          unlink(req.file.path, () => {
            ApiAuthController.errorReturn(422, res, err);
          });
        } else {
          ApiAuthController.errorReturn(422, res, err);
        }
      })
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err?.message || "Terjadi kesalahan saat request data!"
      })
    }
  }


}
