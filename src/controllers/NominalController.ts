import { Request, Response } from "express";
import Nominal from "../models/Nominal";

export default class NominalController {
  static async index(req: Request, res: Response) {
    const nominals = await Nominal.find();
    const message = req.flash("msg");

    res.render("admin/nominal/view_nominal", {
      navActive: "/nominal",
      nominals,
      message,
    });
  }

  static async create(req: Request, res: Response) {
    res.render("admin/nominal/create", {
      navActive: "/nominal",
    });
  }

  static async store(req: Request, res: Response) {
    try {
      const { coinName, coinQuantity, price } = req.body;

      const nominal = new Nominal({
        coinName,
        coinQuantity,
        price 
      });

      await nominal.save();

      req.flash("msg", ["success", "Berhasil menambah Nominal!"]);
      res.redirect("/nominal");
    } catch (err) {
      req.flash("msg", ["danger", "Gagal menambah Nominal!"]);
      res.redirect("/nominal");
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const nominal = await Nominal.findById(req.params.id);

      res.render("admin/nominal/edit", {
        navActive: "/nominal",
        nominal,
      });
    } catch (err) {
      req.flash("msg", ["danger", "Data Nominal tidak ditemukan!"]);
      res.redirect("/nominal");
    }
  }

  static async update(req: Request, res: Response) {
    try {
      await Nominal.findByIdAndUpdate(req.params.id, {
        coinName: req.body.coinName,
        coinQuantity: req.body.coinQuantity,
        price: req.body.price,
      });

      req.flash("msg", ["success", "Berhasil mengubah Nominal!"]);
      res.redirect("/nominal");
    } catch (err) {
      req.flash("msg", ["danger", "Gagal mengubah Nominal!"]);
      res.redirect("/nominal");
    }
  }

  static async destroy(req: Request, res: Response) {
    try {
      await Nominal.findByIdAndRemove(req.params.id);

      req.flash("msg", ["success", "Berhasil menghapus Nominal!"]);
      res.redirect("/nominal");
    } catch (err) {
      req.flash("msg", ["danger", "Gagal menghapus Nominal!"]);
      res.redirect("/nominal");
    }
  }
}
