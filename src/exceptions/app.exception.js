// Based on Error which JS supports, customized an AppException class
class AppException extends Error {
    constructor(statusCode = 500, message, payload) {
        super(message); // Call the parent constructor with the message
        this.name = this.constructor.name; // Set the name of the error to the class name
        this.statusCode = statusCode; // Set the status code
        this.payload = payload; // Set the payload
    }
}

module.exports = AppException;