import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import Config from "../config";
import Player from "../models/Player";

export const ApiMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader("Content-Type", "application/json");
  next();
}

export const ApiAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader && tokenHeader.replace("Bearer ", "");

    const jwtPayload = <any>jwt.verify(token, Config.jwtKey);
    const player = await Player.findById(jwtPayload.player.id);

    req["player"] = {
      id: player["_id"],
    };
    req["token"] = token;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: "error",
      message: "Kredensial otentikasi tidak valid!"
    })
  }
}