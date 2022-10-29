class ErrorCode extends Error {
  constructor(message) {
    super(massage);
    this.status(400);
  }
}

module.exports = ErrorCode;