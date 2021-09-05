import { Request, Response } from "express";
import Transaction from "../models/Transaction";

export default class TransactionController {
  static async index(req: Request, res: Response) {
    const transactions = await Transaction.find().populate("player");
    const message = req.flash("msg");

    res.render("admin/transaction/view_transaction", {
      navActive: "/transaction",
      transactions,
      message,
    });
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      await Transaction.findByIdAndUpdate(req.params.id, {
        status: req.body?.status ?? "pending" 
      })

      req.flash("msg", ["success", "Berhasil memperbarui status!"]);
      res.redirect("/transaction");
    } catch(err) { 
      req.flash("msg", ["danger", "Ada kesalahan saat memperbarui status!"]);
      res.redirect("/transaction");
    }
  }
}
