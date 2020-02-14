import { Request, Response } from "express";
import { promisify } from "util";

import jwt from "jsonwebtoken";

const { SECRET } = process.env;

class TokenService {
  public async validate(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.params.token;
      const decode: any = await promisify(jwt.verify)(token, SECRET!);

      const current_time = new Date().getTime() / 1000;

      if (current_time < decode.exp) {
        return res.status(200).json({ token });
      } else {
        return res.status(401).json({ message: "expired token" });
      }
    } catch (oof) {
      return res.status(401).json({ message: "expired token" });
    }
  }
}

export default new TokenService();
