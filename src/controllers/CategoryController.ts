import { Request, Response } from "express";
import Category from "../models/Category";

export default class CategoryController {
  static async index(req: Request, res: Response) {
    const categories = await Category.find();
    const message = req.flash("msg");

    res.render("admin/category/view_category", {
      navActive: '/category',
      categories,
      message
    });
  }

  static async create(req: Request, res: Response) {
    res.render("admin/category/create", {
      navActive: "/category",
    });
  }

  static async store(req: Request, res: Response) {
    try {
      const category = new Category({
        name: req.body.name,
      });

      await category.save();

      req.flash("msg", ["success", "Berhasil menambah kategori!"]);
      res.redirect("/category");
    } catch(err) {
      req.flash("msg", ["danger", "Gagal menambah kategori!"]);
      res.redirect("/category");
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const category = await Category.findById(req.params.id);

      res.render("admin/category/edit", {
        navActive: "/category",
        category,
      });
    } catch(err) {
      console.log(err);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name
      });

      req.flash("msg", ["success", "Berhasil mengubah kategori!"]);
      res.redirect('/category');
    } catch (err) {
      req.flash("msg", ["danger", "Gagal mengubah kategori!"]);
      res.redirect("/category");
    }
  }
  static async destroy(req: Request, res: Response) {
    try {
      await Category.findByIdAndRemove(req.params.id);

      req.flash("msg", ["success", "Berhasil menghapus kategori!"]);
      res.redirect('/category');
    } catch (err) {
      req.flash("msg", ["danger", "Gagal menghapus kategori!"]);
      res.redirect("/category");
    }
  }

}
