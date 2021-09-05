import { Request, Response } from "express";
import Bank, { IBankModel } from "../models/Bank";

export default class BankController {
  static async index(req: Request, res: Response) {
    const banks = await Bank.find();
    const message = req.flash("msg");

    res.render("admin/bank/view_bank", {
      navActive: "/bank",
      banks,
      message,
    });
  }

  static async create(req: Request, res: Response) {
    res.render("admin/bank/create", {
      navActive: "/bank",
    });
  }

  static async store(req: Request, res: Response) {
    try {
      const { name, bankName, noRekening } = req.body as IBankModel;

      const bank = new Bank({
        name,
        bankName,
        noRekening,
      });

      await bank.save();

      req.flash("msg", ["success", "Berhasil menambah Akun Bank!"]);
      res.redirect("/bank");
    } catch (err) {
      req.flash("msg", ["danger", "Gagal menambah Akun Bank!"]);
      res.redirect("/bank");
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const bank = await Bank.findById(req.params.id);

      res.render("admin/bank/edit", {
        navActive: "/bank",
        bank,
      });
    } catch (err) {
      req.flash("msg", ["danger", "Data Bank tidak ditemukan!"]);
      res.redirect("/bank");
    }
  }

  static async update(req: Request, res: Response) {
    try {
      await Bank.findByIdAndUpdate(req.params.id, {
        name: req.body.name.toUpperCase(),
        bankName: req.body.bankName.toUpperCase(),
        noRekening: req.body.noRekening,
      });

      req.flash("msg", ["success", "Berhasil mengubah akun Bank!"]);
      res.redirect("/bank");
    } catch (err) {
      req.flash("msg", ["danger", "Gagal mengubah akun Bank!"]);
      res.redirect("/bank");
    }
  }

  static async destroy(req: Request, res: Response) {
    try {
      await Bank.findByIdAndRemove(req.params.id);

      req.flash("msg", ["success", "Berhasil menghapus akun Bank!"]);
      res.redirect("/bank");
    } catch (err) {
      req.flash("msg", ["danger", "Gagal menghapus akun Bank!"]);
      res.redirect("/bank");
    }
  }
}
