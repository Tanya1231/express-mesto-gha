class ErrorUnauthorized extends Error {
  constructor(message) {
    super(massage);
    this.status(401);
  }
}

module.exports = ErrorUnauthorized;