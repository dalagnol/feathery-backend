import { User, UserModel, Group, GroupModel } from "../models";
import Request from "./Request";

import { System } from "./modules";

export class SocketConnections {
  private clients: Array<Request>;
  private groups: Array<GroupModel>;

  public System: System;

  constructor() {
    this.clients = [];
    this.groups = [];
    this.load();

    this.System = new System();
  }

  public connect(conn: any, server: any) {
    this.clients.push(new Request(conn, server));
    return this.getById(conn.id);
  }

  public disconnect(conn: any) {
    const sock = this.getById(conn.id);
    if (sock) {
      sock.Disconnect(conn);
      this.removeById(conn.id);
    }
  }

  public async authenticate(conn: any, token: string) {
    const instance = this.getById(conn.id);
    if (!instance) {
      return null;
    }

    return await instance.Authenticate(conn.id, token);
  }

  private async load() {
    this.groups = await Group.find({}).populate("permissions");
  }

  private removeById(id: string) {
    this.clients = this.clients.filter((request: Request) => request.id !== id);
  }

  private getById(id: string): Request | undefined {
    return this.clients.find((request: Request) => request.id === id);
  }
}

export default new SocketConnections();
