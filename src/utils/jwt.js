const jwt = require('jsonwebtoken');
const config = require('./config');

const secret = config.JWT_KEY;

// 1. Generate a token
const generateToken = (payload) => {
    return jwt.sign(payload, secret, {expiresIn: "7d"});
}
// 2. Verify a token
const validateToken = (token) => {
    // this means just return, no solve
    // return jwt.verify(token, secret);
    // so need try catch
    try {
        return jwt.verify(token, secret);
    } catch(err) {
        return null;
    }
}

module.exports = {
    generateToken,
    validateToken,
}