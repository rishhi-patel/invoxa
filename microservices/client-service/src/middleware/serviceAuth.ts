import e, { Request, Response, NextFunction } from "express"

export function serviceAuth(req: Request, res: Response, next: NextFunction) {
  return next()
}
