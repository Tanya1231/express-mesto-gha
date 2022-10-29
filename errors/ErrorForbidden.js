class ErrorForbidden extends Error {
  constructor(message) {
    super(massage);
    this.status(403);
  }
}

module.exports = ErrorForbidden;