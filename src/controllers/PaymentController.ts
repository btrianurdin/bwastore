import { Request, Response } from "express";
import Bank, { IBankModel } from "../models/Bank";
import Payment, { IPaymentModel } from "../models/Payment";

export default class PaymentController {
  static async index(req: Request, res: Response) {
    const payments = await Payment.find()
      .populate("banks");
    const message = req.flash("msg");

    res.render("admin/payment/view_payment", {
      navActive: "/payment",
      payments,
      message,
    });
  }

  static async create(req: Request, res: Response) {
    const banks = await Bank.find();

    res.render("admin/payment/create", {
      navActive: "/payment",
      banks,
    });
  }

  static async store(req: Request, res: Response) {
    try {
      const { type, banks } = req.body as IPaymentModel;

      const payment = new Payment({
        type,
        banks,
      });

      await payment.save();

      req.flash("msg", ["success", "Berhasil menambah Jenis Pembayaran!"]);
      res.redirect("/payment");
    } catch (err) {
      console.log(err);
      req.flash("msg", ["danger", "Gagal menambah Jenis Pembayaran!"]);
      res.redirect("/payment");
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const banks = await Bank.find();
      const payment = await Payment.findById(req.params.id)
        .populate("banks");
      const paymentBanks = payment.banks.map(bank => bank["_id"] + "");

      res.render("admin/payment/edit", {
        navActive: "/payment",
        banks,
        payment,
        paymentBanks,
      });
    } catch (err) {
      req.flash("msg", ["danger", "Data Jenis Pembayaran tidak ditemukan!"]);
      res.redirect("/payment");
    }
  }

  static async update(req: Request, res: Response) {
    try {
      await Payment.findByIdAndUpdate(req.params.id, {
        type: req.body.type,
        banks: req.body.banks ?? [],
      });

      req.flash("msg", ["success", "Berhasil mengubah Jenis Pembayaran!"]);
      res.redirect("/payment");
    } catch (err) {
      req.flash("msg", ["danger", "Gagal mengubah Jenis Pembayaran!"]);
      res.redirect("/payment");
    }
  }

  static async destroy(req: Request, res: Response) {
    try {
      await Payment.findByIdAndRemove(req.params.id);

      req.flash("msg", ["success", "Berhasil menghapus Jenis Pembayaran!"]);
      res.redirect("/payment");
    } catch (err) {
      req.flash("msg", ["danger", "Gagal menghapus Jenis Pembayaran!"]);
      res.redirect("/payment");
    }
  }
}
