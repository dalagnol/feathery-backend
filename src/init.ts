import { Gender, Permission, User, Group } from "./models";

export default async function() {
  const perms = await Permission.find({});

  if (!perms.length) {
    await Group.deleteMany({});
    await User.deleteMany({});
    await Gender.deleteMany({});

    const Male = await Gender.create({
      name: "male"
    });

    const Female = await Gender.create({
      name: "female"
    });

    const RootAccess = await Permission.create({
      code: "root",
      name: "Root Access",
      description: "Unquestionable access to any method and route",
      methods: "*",
      uri: "*"
    });

    const LoginAccess = await Permission.create({
      code: "login",
      name: "Login",
      description: "Allows the group to sign into the app and website",
      methods: "post",
      uri: "/login"
    });

    const SignUpAccess = await Permission.create({
      code: "signup",
      name: "Account Registration",
      description: "Allows the group to sign up to the app and website",
      methods: "post",
      uri: "/user"
    });

    const SelfEditAccess = await Permission.create({
      code: "editself",
      name: "Edit own account",
      description: "Allows the group to edit details own their own account",
      methods: "put",
      uri: "/user/:id"
    });

    const OthersEditAccess = await Permission.create({
      code: "editothers",
      name: "Edit others' accounts",
      description:
        "Allows the group to edit details on other people's accounts",
      methods: "patch",
      uri: "/user/:id"
    });

    const PingAccess = await Permission.create({
      code: "pingtest",
      name: "Ping Test",
      description: "Allows the group to access the Ping test route",
      methods: "get",
      uri: "/ping"
    });

    const Wheel = await Group.create({
      name: "wheel",
      permissions: [RootAccess]
    });

    const Commons = await Group.create({
      name: "commons",
      permissions: [SelfEditAccess, PingAccess]
    });

    const Creators = await Group.create({
      name: "creators",
      permissions: [SelfEditAccess, PingAccess]
    });

    const Admins = await Group.create({
      name: "admins",
      permissions: [SelfEditAccess, OthersEditAccess, PingAccess]
    });

    const Nobody = await Group.create({
      name: "nobody",
      permissions: [LoginAccess, SignUpAccess, PingAccess]
    });

    await User.create({
      identifier: "root",
      name: "root",
      email: "root",
      group: Wheel,
      gender: Male,
      password: "root"
    });

    await User.create({
      identifier: "admin",
      name: "admins",
      email: "admin",
      group: Admins,
      gender: Male,
      password: "admin"
    });

    await User.create({
      identifier: "creator",
      name: "creators",
      email: "creator",
      group: Creators,
      gender: Male,
      password: "creator"
    });

    await User.create({
      identifier: "common",
      name: "commoner",
      email: "pleb",
      group: Commons,
      gender: Male,
      password: "common"
    });
  }
}
