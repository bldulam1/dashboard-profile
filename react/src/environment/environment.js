const api_server =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://jp01-clarity01:8000";

export { api_server };
