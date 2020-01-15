import { Request, Response } from "express";
import { err } from "../constants";

export default new (class TestService {
  public async Ping(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("pong");
    } catch (oof) {
      return res.status(500).json(err);
    }
  }
})();
