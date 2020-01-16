import { User, Socket, UserModel, SocketModel } from "../models";

import { promisify } from "util";
import jwt from "jsonwebtoken";
import Response from "./Response";

type probablyUser = UserModel | null | undefined;

const { SECRET } = process.env;

export default class SocketRequest {
  private Sock: any;
  private Id: string;
  private Server: any;
  private Conn: any;
  private User: null | UserModel;
  private Respond: Response;
  public UserIdentifier: string;

  constructor(conn: any, socket: any) {
    this.Id = conn.id;
    this.Conn = conn;
    this.Server = socket;
    this.Respond = new Response(this.Server, conn);
    this.User = null;
    this.UserIdentifier = conn.id;

    this.Connect(conn);
  }

  public async Connect(conn: any): Promise<SocketModel> {
    const Sock = await Socket.create({
      socketId: conn.id
    });

    this.Sock = Sock;
    return Sock;
  }

  public async Disconnect(conn: any): Promise<void> {
    if (this.Sock) {
      await this.Sock.remove();
    }

    conn.disconnect(true);
  }

  public async Authenticate(socketId: string, token: string) {
    if (!SECRET) {
      this.Respond.toRequester({ message: "internal error" });
      return false;
    }

    try {
      const decode: any = await promisify(jwt.verify)(token, SECRET);

      const user: probablyUser = await User.findById(
        decode.id,
        "-password"
      )?.populate(["group", "gender"]);

      if (user) {
        await Socket.updateOne({ socketId }, { registrant: decode.id });
        this.user = user;
        this.UserIdentifier = user.identifier;
      }

      this.Respond.toRequester({ Authenticate: "okay boomer" });

      return user;
    } catch (oof) {
      this.Respond.toRequester({ Authenticate: "internal error" });
      return false;
    }
  }

  public get id() {
    return this.Id;
  }

  public set user(user: UserModel | null) {
    this.User = user;
  }
}
