const AppException = require("./app.exception");

class UnauthorizedException extends AppException {
    constructor(message, payload) {
        super(401, message, payload); // Call the parent constructor with the message and status code
    }

}

module.exports = UnauthorizedException;