import { UserModel } from "./../../models/User/User";
import { User, Email } from "../../models";
import { prepare } from "../../utils";
import jwt from "jsonwebtoken";

const { SECRET } = process.env;

if (!SECRET) {
  throw new Error("Missing SECRET in process environment");
}

export const completely = ["group", "email", "gender", "phone"];

export async function getUserByCredential(
  credential: string,
  entities: any = []
): Promise<UserModel | null> {
  let DBUser: any;

  if (credential.includes("@") && credential.includes(".")) {
    const [address, domain] = credential.split("@");
    const email = await Email.findOne({ address, domain });

    if (email) {
      DBUser = await User.findOne({ email }).populate(completely);
    }

    if (!DBUser) {
      return null;
    }
  } else {
    DBUser = await User.findOne({ identifier: credential }).populate(
      completely
    );

    if (!DBUser) {
      return null;
    }
  }

  const result: any = {
    id: DBUser._id,
    name: DBUser.name,
    identifier: DBUser.identifier,
    picture: DBUser.picture
  };

  for (let key of completely) {
    result[key] = entities[key] ? DBUser[key] : prepare(DBUser[key]);
  }

  for (let key of entities) {
    result[key] = DBUser[key];
  }

  return result;
}

export async function token(data: any, expiry = "5 minutes") {
  return jwt.sign(data, String(SECRET), { expiresIn: expiry });
}
