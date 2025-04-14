const app = require('./app');
const serverless = require('serverless-http');
const connectToDb = require('./utils/db');

connectToDb();

// handler function for AWS Lambda
module.exports.handler = serverless(app)

