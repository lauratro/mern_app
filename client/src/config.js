module.exports = {
  serverURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5001"
      : "https://appfindmypet.herokuapp.com",
};
