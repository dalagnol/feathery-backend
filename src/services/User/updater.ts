import { PhoneModel } from "./../../models/User/Phone";
import { GenderModel } from "./../../models/User/Gender";
import { EmailModel } from "./../../models/User/Email";
import { UserModel } from "./../../models/User/User";
import { Group, User, Gender, Email, Phone } from "../../models";
import { Request, Response } from "express";
import { prepare } from "../../utils";
import { getUserByCredential, token as makeToken, completely } from "./getters";
import jwt from "jsonwebtoken";

interface UserUpdateForm {
  name?: string | null;
  picture?: string | null;
  email?: EmailModel | string | null;
  gender?: GenderModel | string | null;
  phone?: PhoneModel | string | null;
  password?: string | null;
}

export async function updateUserByCredential(
  credential: string,
  data: UserUpdateForm
) {
  const user: UserModel | null = await getUserByCredential(
    credential,
    completely
  );

  if (!user) {
    return null;
  }

  let { name, picture, email, gender, phone, password } = data;

  let result: UserUpdateForm = {};

  if (name && typeof name === "string") {
    result = { name };
  }

  if (picture && typeof picture === "string") {
    result = { ...result, picture };
  }

  if (password && typeof password === "string") {
    result = { ...result, password };
  }

  if (email) {
    if (typeof email === "string") {
      const [address, domain] = email.split("@");
      email = await Email.findOne({ address, domain });

      if (!email) {
        email = await Email.create({ address, domain });
      }
    }

    result = { ...result, email };
  }

  if (phone) {
    if (typeof phone === "string") {
      const num = phone.match(/[\d ]/g)?.join(" ");
      if (num) {
        const [ddi, number] = num.split(" ");

        phone = await Phone.findOne({ ddi, number });

        if (!phone) {
          phone = await Phone.create({ ddi, number });
        }
      }
    }

    result = { ...result, phone };
  }

  if (gender) {
    if (typeof gender === "string") {
      gender = await Gender.findOne({ name: gender });

      if (gender) {
        result = { ...result, gender };
      }
    }
  }

  return await User.findByIdAndUpdate(user._id, result, { new: true });
}

export async function updateUserById(id: string, data: UserUpdateForm) {
  const user: UserModel | null = await User.findById(id).populate(completely);

  if (!user) {
    return null;
  }

  let { name, picture, email, gender, phone, password } = data;

  let result: UserUpdateForm = {};

  if (name && typeof name === "string") {
    result = { name };
  }

  if (picture && typeof picture === "string") {
    result = { ...result, picture };
  }

  if (password && typeof password === "string") {
    result = { ...result, password };
  }

  if (email) {
    if (typeof email === "string") {
      const [address, domain] = email.split("@");
      email = await Email.findOne({ address, domain });

      if (!email) {
        email = await Email.create({ address, domain });
      }
    }

    result = { ...result, email };
  }

  if (phone) {
    if (typeof phone === "string") {
      const num = phone.match(/[\d ]/g)?.join(" ");
      if (num) {
        const [ddi, number] = num.split(" ");

        phone = await Phone.findOne({ ddi, number });

        if (!phone) {
          phone = await Phone.create({ ddi, number });
        }
      }
    }

    result = { ...result, phone };
  }

  if (gender) {
    if (typeof gender === "string") {
      gender = await Gender.findOne({ name: gender });

      if (gender) {
        result = { ...result, gender };
      }
    }
  }

  return await User.findByIdAndUpdate(user._id, result, { new: true }).populate(
    completely
  );
}
