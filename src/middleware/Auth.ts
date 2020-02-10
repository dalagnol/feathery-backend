import { PermissionModel, User, Group } from "../models";
import { Request, Response, NextFunction } from "express";
import { promisify } from "util";

import jwt from "jsonwebtoken";

const { SECRET } = process.env;

const message = "unable to attend to your request right now";

const warrantsMethod = (methods: Array<string>, method: string) =>
  methods.includes("*") || methods.includes(method);

const warrantsRoute = (route: string, desired: string) => {
  const routeShards = route.split("/");
  const goalShards = desired.split("/");

  return (
    routeShards.length === goalShards.length &&
    routeShards[1] === goalShards[1] &&
    goalShards.every(
      (x: string, y: number) => !y || x.includes(":") || x === goalShards[y]
    )
  );
};

export default async function Auth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  if (!SECRET) {
    return res.status(500).json({ message });
  }

  const { authorization } = req.headers;

  let { method, path } = req;
  method = method.toLowerCase();
  path = path.toLowerCase();

  if (!authorization || !authorization.split(" ")[1]) {
    const Nobody = await Group.findOne({ name: "nobody" }).populate(
      "permissions"
    );

    const permission = Nobody?.permissions.find(
      (x: PermissionModel) =>
        warrantsMethod(x.methods, method) && warrantsRoute(x.uri, path)
    );

    if (permission) {
      return next();
    }
  } else {
    try {
      const [, token] = authorization.split(" ");
      const decode: any = await promisify(jwt.verify)(token, SECRET);

      const user = await User.findById(decode.id).populate([
        {
          path: "group",
          select: ["name", "permissions"],
          populate: { path: "permissions" }
        }
      ]);

      if (user) {
        req.user = user;
        if (
          user.group.permissions.find(
            (x: PermissionModel) =>
              warrantsMethod(x.methods, method) && warrantsRoute(x.uri, path)
          )
        ) {
          return next();
        }
      }
    } catch (oof) {
      return res.status(401).json({ message: "expired token" });
    }
  }
  return res.status(401).json({ message: "unauthorised" });
}
