import { NextFunction, Request, Response } from "express";

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.session.auth) {
    req.flash("msg", ["danger", "Silahkan login kembali!"]);
    res.redirect("/login");
  } else {
    res.locals.auth = {
      ...req.session.auth
    };
    next();
  }
}