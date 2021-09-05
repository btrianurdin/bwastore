import { Request, Response } from "express";
import Voucher from "../models/Voucher";
import Transaction from "../models/Transaction";
import Player from "../models/Player";
import Category from "../models/Category";

export default class HomeController {
  static async index(req: Request, res: Response) {
    const transaction = await Transaction.countDocuments();
    const voucher = await Voucher.countDocuments();
    const player = await Player.countDocuments();
    const category = await Category.countDocuments();
    try{
      res.render('index', {
        navActive: '/',
        count: {
          transaction,
          voucher,
          player,
          category
        }
      });
    } catch(err) {
      console.log(err);
    }
  }
}