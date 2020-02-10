import { Server } from "../../socket";

export default class Messaging {
  public messageRoom(room: string, message: string) {
    Server.to(room).emit("Message", message);
  }

  public signalJoin(room: string, user: string) {
    Server.to(room).emit("Joined", user);
  }

  public signalLeave(room: string, user: string) {
    Server.to(room).emit("Left", user);
  }

  public signalTyping(room: string, typist: string) {
    Server.to(room).emit("Typing", typist);
  }
}
