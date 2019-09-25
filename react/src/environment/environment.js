import socketIOClient from "socket.io-client";

const hostname =
  process.env.NODE_ENV === "development" ? "localhost" : "jp01-clarity01";

const api_server =
  process.env.NODE_ENV === "development"
    ? `https://${hostname}:4444/api`
    : `https://${hostname}/api`;
const redirectUri = `https://${hostname}`;
const clientId = "8d328dfa-6f5f-442e-baf0-f7cc55bb9ba1";

const socket_server = `https://${hostname}:8081`;
const socket = socketIOClient(socket_server);

export { api_server, socket, redirectUri, clientId };
