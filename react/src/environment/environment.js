const api_server =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://jp01-clarity01:8000";

const front_end_server =
  process.env.NODE_ENV === "development"
    ? "https://localhost:3000"
    : "https://jp01-clarity01:3000";

const clientID =   process.env.NODE_ENV === "development"
? "11a9c8da-70ec-4ba1-9e4a-5267cf7f67b2"
: "8d328dfa-6f5f-442e-baf0-f7cc55bb9ba1";
export { api_server, front_end_server };
