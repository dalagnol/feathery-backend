import { Request, Response, NextFunction } from "express";

export default function Detailer(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log("\n", `${req.method} ${req.path}`);
  console.log(req.body, "\n");
  next();
}
