require("dotenv").config();
import server from "./server";
import socket from "./socket";
import { UserModel, Socket as DBSocket } from "./models";

const { PORT, SOCKET_PORT } = process.env;

declare global {
  namespace Express {
    interface Request {
      user: UserModel;
    }
  }
}

server.listen(PORT, () => {
  console.log(`* * :${PORT}`);
});

async function Run() {
  const Sockets = await DBSocket.find({});
  if (!Sockets.length) {
    socket.listen(SOCKET_PORT);
  } else {
    console.log("Clearing sockets...");
    await DBSocket.deleteMany({});
    Run();
  }
}

Run();
