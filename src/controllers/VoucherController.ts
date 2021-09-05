import { Request, Response } from "express";
import { unlinkSync, existsSync } from "fs";
import { join } from "path";
import Voucher, { IVoucherModel } from "../models/Voucher";
import Category from "../models/Category";
import Nominal from "../models/Nominal";

export default class VoucherController {
  static async index(req: Request, res: Response) {
    const vouchers = await Voucher.find()
      .populate("category")
      .populate("nominals");

    const message = req.flash("msg");

    res.render("admin/voucher/view_voucher", {
      navActive: "/voucher",
      vouchers,
      message,
    });
  }

  static async create(req: Request, res: Response) {
    const categories = await Category.find();
    const nominals = await Nominal.find();

    res.render("admin/voucher/create", {
      navActive: "/voucher",
      categories,
      nominals,
    });
  }

  static async store(req: Request, res: Response) {
    try {
      const { name, category, nominals } = req.body as IVoucherModel;
      let voucherObj = {
        name,
        category,
        nominals,
      };

      if (req.file) {
        voucherObj["thumbnail"] = req.file.filename;
      }

      const voucher = new Voucher(voucherObj);
      voucher.save();

      req.flash("msg", ["success", "Berhasil menambah Nominal!"]);
      res.redirect("/voucher");
    } catch (err) {
      req.flash("msg", ["danger", "Gagal menambah Nominal!"]);
      res.redirect("/voucher");
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const categories = await Category.find();
      const nominals = await Nominal.find();
      const voucher = await Voucher.findById(req.params.id)
        .populate("category")
        .populate("nominals");
      const voucherNominals = voucher.nominals.map(
        (nominal) => nominal["_id"] + ""
      );

      res.render("admin/voucher/edit", {
        navActive: "/voucher",
        categories,
        nominals,
        voucher,
        voucherNominals,
      });
    } catch (err) {
      req.flash("msg", ["danger", "Data voucher tidak ditemukan!"]);
      res.redirect("/voucher");
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { name, category, nominals } = req.body as IVoucherModel;
      let voucherObj = {
        name,
        category,
        nominals: nominals ?? [],
      };

      if (req.file) {
        const voucher = await Voucher.findById(req.params.id).select({
          thumbnail: 1,
        });
        if (voucher.thumbnail) {
          const imgPath = join(
            __dirname,
            "../../public/uploads/" + voucher.thumbnail
          );
          if (existsSync(imgPath)) {
            unlinkSync(imgPath);
          }
        }
        voucherObj["thumbnail"] = req.file.filename;
      }

      await Voucher.findByIdAndUpdate(req.params.id, voucherObj);

      req.flash("msg", ["success", "Berhasil mengubah Voucher!"]);
      res.redirect("/voucher");
    } catch (err) {
      req.flash("msg", ["danger", "Gagal mengubah Voucher!"]);
      res.redirect("/voucher");
    }
  }

  static async destroy(req: Request, res: Response) {
    try {
      const voucher = await Voucher.findOneAndRemove({ _id: req.params.id });

      const imgPath = join(
        __dirname,
        "../../public/uploads/" + voucher.thumbnail
      );
      if (existsSync(imgPath)) {
        unlinkSync(imgPath);
      }

      req.flash("msg", ["success", "Berhasil menghapus Voucher!"]);
      res.redirect("/voucher");
    } catch (err) {
      req.flash("msg", ["danger", "Gagal menghapus Voucher!"]);
      res.redirect("/voucher");
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const getStatus = await Voucher.findById(req.params.id).select({
        status: 1,
      });

      const status = getStatus.status === "Y" ? "N" : "Y";

      await Voucher.findByIdAndUpdate(req.params.id, { status: status });

      req.flash("msg", ["success", "Berhasil memperbarui status Voucher!"]);
      res.redirect("/voucher");
    } catch (err) {
      req.flash("msg", ["danger", "Gagal memperbarui status Voucher!"]);
      res.redirect("/voucher");
    }
  }
}
