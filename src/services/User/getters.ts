import { Group, User, Gender, Email } from "../models";
import { Request, Response } from "express";
import { prepare } from "../utils";
import jwt from "jsonwebtoken";

const { SECRET } = process.env;

if (!SECRET) {
  throw new Error("Missing SECRET in process environment");
}

export const completely = ["group", "email", "gender"];

export async function getUserByCredential(credential: string, entities = []) {

    if (credential.includes("@") && credential.includes(".")) {
        const [address, domain] = credential.split("@");
        const email = await Email.findOne({ address, domain });
        
        let DBUser;
        
        if (email) {
            DBUser = await User.findOne({ email })
                .populate(completely);
        } else {
            DBUser = await User.findOne({ 
                identifier: credential
            }).populate(completely);
        }
        
        if (!DBUser) { return null; };
        else {
            const result: any = {
                id: DBUser._id,
                name: DBUser.name,
                identifier: DBUser.identifier,
                picture: DBUser.picture
            };

            for (let key of entities) {
              result[key] = DBUser[key];
            }
            
            for (let key of completely) {
                result[key] = entities.find(key)
                    ? DBUser[key]
                    : prepare(DBUser[key]);
            }
            
            return result;    
        }
    }
}

export async function token(data: any, expiry = "60 minutes") {
  return jwt.sign(
    data, String(SECRET), { expiresIn: expiry }
  );
}

