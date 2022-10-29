class ErrorNotFound extends Error {
  constructor(message) {
    super(massage);
    this.status(404);
  }
}

module.exports = ErrorNotFound;