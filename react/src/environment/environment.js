const api_server =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://jp01-clarity01:8000";

const front_end_server =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://jp01-clarity01:3000";
export { api_server, front_end_server };
