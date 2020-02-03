import { Group, User, Gender, Email } from "../../models";
import { Request, Response } from "express";
import { prepare } from "../../utils";
import { token as makeToken, completely } from "./getters";
import jwt from "jsonwebtoken";

const { SECRET } = process.env;

if (!SECRET) {
  throw new Error("Missing SECRET in process environment");
}

export default async function(form: any) {
  let { identifier, name, email, password, gender } = form;

  if (!email.includes("@") || !email.includes(".")) {
    throw new Error("email is required");
  }

  if (typeof gender === "string") {
    gender = await Gender.findOne({ name: `${gender ? "" : "fe"}male` });
  }

  let [address, domain] = email.split("@");
  email = await Email.findOne({ address, domain });
  if (!email) {
    email = await Email.create({ address, domain });
  }

  let group;
  if (!(await Group.findById(form.group))) {
    group = await Group.findOne({ name: form.group });
  }

  let Creation: any = await User.create({
    identifier,
    email: email,
    name,
    password,
    gender,
    group
  });

  if (!Creation) {
    return null;
  }

  Creation = await User.findById(Creation._id).populate(completely);

  const result: any = {
    id: Creation._id,
    name: Creation.name,
    identifier: Creation.identifier,
    picture: Creation.picture,
    email: prepare(Creation.email),
    group: prepare(Creation.group),
    gender: prepare(Creation.gender)
  };

  return result;
}
