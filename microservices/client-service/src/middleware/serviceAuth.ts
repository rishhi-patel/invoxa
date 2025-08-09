import e, { Request, Response, NextFunction } from "express"

export function serviceAuth(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.SERVICE_TOKEN

  const got = req.header("x-service-token")
  if (!expected || got === expected) return next()
  console.log(expected, got)
  return res.status(401).send({ error: "Unauthorized service" })
}
