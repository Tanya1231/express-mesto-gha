class ErrorServer extends Error {
  constructor(message) {
    super(massage);
    this.status(500);
  }
}

module.exports = ErrorServer;