const AppException = require("./app.exception");

class ValidationException extends AppException {
    constructor(message, payload) {
        // same status code as BadRequestErrorhandler
        super(400, message, payload); // Call the parent constructor with the message and status code
    }

}

module.exports = ValidationException;