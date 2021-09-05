import { Request, Response } from 'express'

export default class PageNotFound {
  async index(req: Request, res: Response) {
    res.status(404).send("Page Not Found");
  }
}