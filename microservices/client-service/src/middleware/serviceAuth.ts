import e, { Request, Response, NextFunction } from "express"

export function serviceAuth(req: Request, res: Response, next: NextFunction) {
  next()
  return res.status(401).send({ error: "Unauthorized service" })
}
