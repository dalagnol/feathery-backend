import { User, Socket } from "../models";

export default class SocketResponse {
  private Server: any;
  private conn: any;

  constructor(Server: any, conn: any) {
    this.Server = Server;
    this.conn = conn;
  }

  private wrap(data?: any) {
    const res: any = {
      okay: typeof data.okay !== "undefined" ? !!data.okay : true
    };

    delete data.okay;

    const entries = Object.entries(data);
    if (entries.length === 1 && typeof entries[0][1] === "object") {
      return [entries[0][0], { ...res, ...entries[0][1] }];
    }

    res.data = { ...data };
    return ["System", res];
  }

  toRequester(data?: any) {
    if (data) {
      const res = this.wrap(data);
      this.conn.emit(...res);
    }

    return {
      then: this
    };
  }

  error(event?: string) {
    this.conn.emit(event || "err", { okay: false, message: "internal error" });
  }

  die() {
    this.conn.disconnect(true);
  }

  async toUserById(id: string, data: any) {
    const res = this.wrap(data);

    const sock = await Socket.find({ registrant: id });

    if (sock) {
    } else {
      this.toRequester({
        okay: false,
        message: "No available socket to user"
      });
    }
  }
}
