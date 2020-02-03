import { Group, User, Gender, Email } from "../models";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { getUserByCredential, token as makeToken } from "./User/getters";

import Create from "./User/creator";

const { SECRET } = process.env;

if (!SECRET) {
  throw new Error("Missing SECRET in process environment");
}

const message = "Could not process your request at this time";

class UserService {
  public async authenticate(req: Request, res: Response): Promise<Response> {
  
    try {
      const { credential, password } = req.body;
      
      const user = await getUserByCredential(
        credential, password
      );
      
      if (!user) {
        return res.status(401).json({ 
          message: "User does not exist"
        });
      } else {
        if (await bcrypt.compare(password, user.password)) {
          const token = makeToken({ id: user._id });
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
          console.log(message);
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
      const { name, email, picture, password } = req.body;
      let EmailAddress;
      if (email) {
        const [address, domain] = email.split("@");
        EmailAddress = await Email.findOne({ address, domain });
        if (!EmailAddress) {
          EmailAddress = await Email.create({ address, domain });
        }
      } else {
        EmailAddress = (await User.findById(req.params.id))?.email;
      }

      if (password) {
        if (password.length < 6) {
          return res.status(400).json({
            message: "your password must have more than six characters"
          });
        } else {
          const user = await User.findByIdAndUpdate(
            req.params.id,
            {
              name,
              email: EmailAddress,
              picture,
              password
            },
            { new: true }
          );
          return res.status(200).json({ user });
        }
      } else {
        const user = await User.findByIdAndUpdate(
          req.params.id,
          {
            name,
            email: EmailAddress,
            picture
          },
          { new: true }
        );
        return res.status(200).json({ user });
      }
    } catch (oof) {
      const { message } = oof;
      return res.status(500).json({ message });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<Response> {
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
