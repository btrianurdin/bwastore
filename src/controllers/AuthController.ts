import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import User, { IUserModel } from "../models/User";

export default class AuthController {
  static async loginIndex(req: Request, res: Response) {
    const message = req.flash("msg");

    if (!req.session.auth) {
      res.render("admin/auth/login", {
        message
      });
    } else {
      res.redirect("/");
    }
  }

  static async loginAction(req: Request, res: Response) {
    try {
      const { email, password } = req.body as IUserModel;

      if (email.length <= 0 || password.length <= 0) {
        throw new Error("Email / Password masih kosong!");
      }

      const users = await User.findOne({email: email});
      // If users with related email not found
      if (!users) throw new Error("Email / Password salah!");
      // If the users status is't active
      if (users.status !== "Y") throw new Error("Status anda belum aktif!");
      // Check user data password
      const checkPassword = await bcrypt.compare(password, users.password);
      if (checkPassword) {
        req.session.auth = {
          name: users.name,
          email: users.email,
          status: users.status
        };
        res.redirect("/");
      } else {
        throw new Error("Email / Password salah!");
      }
    } catch(err) {
      req.flash("msg", ["danger", err?.message]);
      res.redirect("/login");
    }
  }

  static async logout(req: Request, res: Response) {
    if (req.session.auth) {
      delete res.locals.auth;
      req.session.destroy((err) => console.log(err));
      res.redirect("/login");
    } else {
      res.redirect("/login");
    }
  }

  // static async store(req: Request, res: Response) {
  //   try {
  //     const { type, banks } = req.body as IPaymentModel;

  //     const payment = new Payment({
  //       type,
  //       banks,
  //     });

  //     await payment.save();

  //     req.flash("msg", ["success", "Berhasil menambah Jenis Pembayaran!"]);
  //     res.redirect("/payment");
  //   } catch (err) {
  //     console.log(err);
  //     req.flash("msg", ["danger", "Gagal menambah Jenis Pembayaran!"]);
  //     res.redirect("/payment");
  //   }
  // }

  // static async edit(req: Request, res: Response) {
  //   try {
  //     const banks = await Bank.find();
  //     const payment = await Payment.findById(req.params.id).populate("banks");
  //     const paymentBanks = payment.banks.map((bank) => bank["_id"] + "");

  //     res.render("admin/payment/edit", {
  //       navActive: "/payment",
  //       banks,
  //       payment,
  //       paymentBanks,
  //     });
  //   } catch (err) {
  //     req.flash("msg", ["danger", "Data Jenis Pembayaran tidak ditemukan!"]);
  //     res.redirect("/payment");
  //   }
  // }

  // static async update(req: Request, res: Response) {
  //   try {
  //     await Payment.findByIdAndUpdate(req.params.id, {
  //       type: req.body.type,
  //       banks: req.body.banks ?? [],
  //     });

  //     req.flash("msg", ["success", "Berhasil mengubah Jenis Pembayaran!"]);
  //     res.redirect("/payment");
  //   } catch (err) {
  //     req.flash("msg", ["danger", "Gagal mengubah Jenis Pembayaran!"]);
  //     res.redirect("/payment");
  //   }
  // }

  // static async destroy(req: Request, res: Response) {
  //   try {
  //     await Payment.findByIdAndRemove(req.params.id);

  //     req.flash("msg", ["success", "Berhasil menghapus Jenis Pembayaran!"]);
  //     res.redirect("/payment");
  //   } catch (err) {
  //     req.flash("msg", ["danger", "Gagal menghapus Jenis Pembayaran!"]);
  //     res.redirect("/payment");
  //   }
  // }
}
