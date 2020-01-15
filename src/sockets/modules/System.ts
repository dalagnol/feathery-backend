import Socket from "../Manager";
import { Server } from "../../socket";

export default class System {
  public broadcast(message: string) {
    Server.emit("Broadcast", message);
  }
}
