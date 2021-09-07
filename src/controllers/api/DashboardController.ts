import { Request, Response } from "express";
import Category from "../../models/Category";
import Transaction from "../../models/Transaction";

export default class DashboardController {
  static async dashboard(req: Request, res: Response) {
    try {
      const count = await Transaction.aggregate([
        { $match: { player: req["player"]["id"] } },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$value" },
          },
        },
      ]);

      const category = await Category.find();

      category.forEach((el) => {
        count.forEach((data) => {
          if (data._id.toString() === el._id.toString()) {
            data.name = el.name;
          }
        });
      });

      const history = await Transaction.find({ player: req["player"]["id"] })
        .populate("category")
        .sort({ updatedAt: -1 });

      res.status(200).json({
        status: "success",
        data: {
          count,
          history,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err?.message || "Terjadi kesalahan saat request data!",
      });
    }
  }

  static async history(req: Request, res: Response) {
    try {
      const { status } = req.query;

      let criteria = {};

      if (status?.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "i" },
        };
      }

      if (req["player"]["id"]) {
        criteria = {
          ...criteria,
          player: req["player"]["id"],
        };
      }

      const history = await Transaction.find(criteria);

      const totalValue = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: "$value" },
          },
        },
      ]);

      res.status(200).json({
        status: "success",
        data: {
          history,
          total: totalValue.length ? totalValue[0].value : 0,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err?.message || "Kesalahan saat request data!",
      });
    }
  }

  static async historyDetail(req: Request, res: Response) {
    try {
      const history = await Transaction.findById(req.params.id);

      if (!history) {
        return res.status(404).json({
          status: "error",
          message: "Data history tidak ditemukan!",
        });
      }
      return res.status(404).json({
        status: "success",
        data: history,
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err?.message || "Kesalahan saat request data!",
      });
    }
  }
}