import { Server } from "../../socket";

export default class Messaging {
  public messageRoom(room: string, message: string) {
    Server.to(room).emit("Message", message);
  }
}
