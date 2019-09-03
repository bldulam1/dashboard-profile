const hostname = "jp01-of-wl8197";

const api_server =
  process.env.NODE_ENV === "development"
    ? `https://${hostname}:4444/api`
    : `https://${hostname}/api`;
const redirectUri = `https://${hostname}`;
const clientId = "8d328dfa-6f5f-442e-baf0-f7cc55bb9ba1";

export { api_server, redirectUri, clientId };
