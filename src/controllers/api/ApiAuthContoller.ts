import { Request, Response } from "express";
import { unlink } from "fs";
import { compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import Player, { IPlayerModel } from "../../models/Player";
import Config from "../../config";

export default class ApiAuthController {
  static async signup(req: Request, res: Response) {
    try {
      const payload = req.body as IPlayerModel;

      if (req.file) {
        payload.avatar = req.file.filename;
      }

      const player = new Player(payload);
      player
        .save()
        .then((result) => {
          const resToObj = result.toObject();
          delete resToObj.password;
          res.status(200).json({
            status: "success",
            data: resToObj,
          });
        })
        .catch((err) => {
          if (req.file) {
            unlink(req.file.path, () => {
              ApiAuthController.errorReturn(422, res, err);
            });
          } else {
            ApiAuthController.errorReturn(422, res, err);
          }
        });

    } catch (err) {
      res.status(422).json({
        status: "error",
        message: err?.message || "Kesalahan saat request data!",
      });
    }
  }

  static async signin(req: Request, res: Response) {
    try {
      Player.findOne({ email: req.body.email })
        .then((player) => {
          const checkPassowrd = compareSync(req.body.password, player.password);
          if (!checkPassowrd) {
            return res.status(403).json({
              status: "error",
              message: "Email/Password salah!",
            });
          }

          const token = jwt.sign({
            player: {
              id: player.id,
              username: player.username,
              email: player.email,
              name: player.name,
              phoneNumber: player.phoneNumber,
              avatar: player.avatar
            }
          }, Config.jwtKey);
          res.status(200).json({
            status: "success",
            data: { token },
          });
        })
        .catch(err => {
          res.status(403).json({
            status: "error",
            message: "Email/Password salah!",
          });
        }) 
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err?.message || "Kesalahan saat request data!",
      });
    }
  }

  static errorReturn(statusCode: number, response: Response, err: any) {
    return response.
      status(statusCode)
      .json({
        status: "error",
        message: err?.message || "Kesalahan saat request data",
        fields: err.errors || null
      });
  }
}
