import { Group, User, Gender } from "../models";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { SECRET } = process.env;

if (!SECRET) {
  throw new Error("Missing SECRET in process environment");
}

const message = "Could not process your request at this time";

class UserService {
  public async authenticate(req: Request, res: Response): Promise<Response> {
    if (!SECRET) {
      return res.status(500).json({ message });
    }

    try {
      const { credential, password } = req.body;
      let dbUser = await User.findOne({ identifier: credential });

      if (!dbUser) {
        dbUser = await User.findOne({ email: credential });
      }

      if (!dbUser) {
        return res.status(401).json({ message: "User does not exist" });
      } else {
        if (
          (req.body.credential === dbUser.email ||
            req.body.credential === dbUser.identifier) &&
          (await bcrypt.compare(password, dbUser.password))
        ) {
          const token = jwt.sign(
            {
              id: dbUser._id
            },
            SECRET,
            {
              expiresIn: "60 minutes"
            }
          );

          const user = {
            id: dbUser._id,
            name: dbUser.name,
            identifier: dbUser.identifier,
            email: dbUser.email
          };

          return res.status(200).json({ token, user });
        } else {
          console.log(req.body.email);
          console.log(req.body.password);
          return res.status(401).json({ message: "Wrong email or password" });
        }
      }
    } catch (oof) {
      console.log(oof);
      return res.status(500).json({ message });
    }
  }

  public async signUp(req: Request, res: Response): Promise<Response> {
    try {
      let { identifier, name, email, password, gender } = req.body;

      if (typeof gender === "string") {
        gender = await Gender.findOne({ name: `${gender ? "" : "fe"}male` });
      }

      const Commons = await Group.findOne({ name: "commons" });

      const Creation = await User.create({
        identifier,
        email,
        name,
        password,
        gender,
        group: Commons
      });

      return res.status(201).json(Creation);
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
      const { name, email, password } = req.body;
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
              email,
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
            email
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
