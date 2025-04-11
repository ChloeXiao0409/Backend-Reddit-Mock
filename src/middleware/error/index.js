// This index.js in Error folder is for all error handling middleware
const finalErrorHandler = require("./finalErrorHandler");
const badRequestErrorHandler = require("./badRequestErrorHandler");
const conflictsErrorHandler = require("./conflictsErrorHandler");
const unauthorizedErrorHandler = require("./unauthorizedErrorHandler");
const notFoundErrorHandler = require("./notFoundErrorHandler");
const forbiddenErrorHandler = require("./forbiddenErrorHandler");

const errorMiddleware = [
    // make sure these error handlers all before the finalErrorHandler
    badRequestErrorHandler,  // 400 - bad request error
    unauthorizedErrorHandler, // 401 - unauthorized error
    forbiddenErrorHandler, // 403 - forbidden error
    notFoundErrorHandler, // 404 - not found error
    conflictsErrorHandler, // 409 - conflicts error
    finalErrorHandler // 500 - catch all errors
]

module.exports = errorMiddleware;