class ErrorConflict extends Error {
  constructor(message) {
    super(massage);
    this.status(409);
  }
}

module.exports = ErrorConflict;