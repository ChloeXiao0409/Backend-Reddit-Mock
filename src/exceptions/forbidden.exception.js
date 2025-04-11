const AppException = require("./app.exception");

class ForbiddenException extends AppException {
    constructor(message, payload) {
        super(403, message, payload); // Call the parent constructor with the message and status code
    }

}

module.exports = ForbiddenException;