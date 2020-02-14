import { User } from "../models";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prepare } from "../utils";
import { promisify } from "util";

import jwt from "jsonwebtoken";

import { getUserByCredential as Get, token as makeToken } from "./User/getters";
import { updateUserById as UpdateById, updateUserByCredential as UpdateByCredential } from "./User/updater";
import { sendEmail } from "../utils/sender";
import Create from "./User/creator";

const { SECRET, HOST } = process.env;

if (!SECRET) {
  throw new Error("Missing SECRET in process environment");
}

const message = "Could not process your request at this time";

class UserService {
  public async authenticate(req: Request, res: Response): Promise<Response> {
    try {
      const { credential, password } = req.body;
      let user = await Get(credential, ["password"]);

      if (!user) {
        return res.status(401).json({
          message: "User does not exist"
        });
      } else {
        if (await bcrypt.compare(password, user.password)) {
          delete user.password;
          const token = await makeToken({ id: user.id });

          return res.status(200).json({ token, user });
        } else {
          return res.status(401).json({
            message: "Wrong password"
          });
        }
      }
    } catch (oof) {
      console.log(oof);
      return res.status(500).json({ message });
    }
  }

  public async signUp(req: Request, res: Response): Promise<Response> {
    try {
      const user = await Create(req.body);
      const token = await makeToken({ id: user.id });
      return res.status(201).json({ token, user });
    } catch (oof) {
      const { message } = oof;
      if (message) {
        if (message.includes("duplicate")) {
          return res.status(400).json({ message: "email is taken" });
        } else if (message.includes("is required")) {
          return res.status(405).json({ message });
        } else {
          return res.status(500).json({ message });
        }
      } else {
        return res.status(500).json({ message: "oops" });
      }
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const user = await UpdateById(req.params.id, req.body);

      if (!user) {
        return res.status(500).json({
          message: "oops"
        });
      }

      return res.status(200).json({
        id: user._id,
        name: user.name,
        identifier: user.identifier,
        picture: user.picture,
        group: prepare(user.group),
        email: prepare(user.email),
        gender: prepare(user.gender),
        phone: prepare(user.phone)
      });
    } catch (oof) {
      return res.status(500).json({
        message: "oops"
      });
    }
  }

  public async mailResetPsw(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const userEmail = req.body.email;

      const token = await makeToken({ email: userEmail });
      const link = `${HOST}:3000/reset/${token}`;
      const output = `
        <h3>Click the link below to reset your password:</h3>
        <a href=${link}>Reset password</a>
      `;

      const emailForm = {
        from: '"Feathery ➳" <GMAILUSER>',
        subject: "Password Reset",
        output: output
      };

      sendEmail(userEmail, emailForm);

      return res.status(200).json({ message: `email has been sent` });
    } catch (oof) {
      console.log(oof);
      return res.status(500).json({ message: "invalid email" });
    }
  }

  public async resetPsw(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.params.token;
      const decode: any = await promisify(jwt.verify)(token, SECRET!);
 
      const user = await UpdateByCredential(decode.email, req.body);

      return res.status(200).json({ user });
    } catch (oof) {
      return res.status(401).json({ message: "expired token" });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      await User.findByIdAndRemove(req.params.id);
      return res.status(200).json({ message: "User was deleted" });
    } catch (oof) {
      const { message } = oof;
      return res.status(500).json({ message });
    }
  }
}

export default new UserService();
