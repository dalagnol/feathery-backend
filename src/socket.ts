import server from "./server";
import io from "socket.io";
import http from "http";

import Socket from "./sockets/Manager";

const httpInstance = http.createServer(server);
export const Server = io(httpInstance);

Server.on("connection", async function(conn: any) {
  const Process = Socket.connect(conn, Server);
  if (!Process) {
    conn.disconnect(true);
    return; // process creation failed, so die
  }

  conn.on("disconnect", () => {
    Socket.disconnect(conn);

    // For testing
    console.log(user(), "has disconnected");
  });

  conn.on("Authenticate", async (token: string) => {
    const account = await Socket.authenticate(conn, token);

    // For testing
    console.log(conn.id, "has authenticated as", user(), account);
  });

  conn.on("Broadcast", (message: string) => {
    Socket.System.broadcast(message);

    // For testing
    console.log(`${user()} has broadcasted "${message}"`);
  });

  conn.on("Message", (room: string, message: any) => {
    Socket.Messaging.messageRoom(room, message);

    // For testing
    console.log(`${user()} has sent`, message, ` to "${room}"`);
  });

  conn.on("Join", (channelName: string) => {
    conn.join(channelName);

    // For testing
    console.log(`${user()} entered channel ${channelName}`);
  });

  conn.on("Exit", (channelName: string) => {
    conn.leave(channelName);

    // For testing
    console.log(`${user()} left channel ${channelName}`);
  });

  // For testing
  const user = () => Process.UserIdentifier;
  console.log(user(), "has connected");
});

export default httpInstance;
