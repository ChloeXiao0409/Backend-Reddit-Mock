const AppException = require("./app.exception");

class NotFoundException extends AppException {
    constructor(message, payload) {
        super(404, message, payload); // Call the parent constructor with the message and status code
    }

}

module.exports = NotFoundException;