// Verification for the user's token -> use test.controller to test
const { validateToken} = require("../utils/jwt");

module.exports = (req, res, next) => {
    const authorization = req.header("Authorization");

    // 1. Check if token is missing
    if(!authorization) {
        res.status(401).json({error: "Missing token"});
        return;
    }

    // 2. Check if token is invalid
    // Token format: Bearer xxxx
    const [type, token] = authorization.split(" ");
    if(type !== "Bearer" && !token) {
        res.status(401).json({error: "Invalid token"});
        return;
    }

    // 3. Check if token is valid
    const payload = validateToken(token);
    if(!payload) {
        res.status(401).json({error: "Invalid token"});
        return;
    }
    // Add a new attribute to req object: user, to checking role which stored in payload
    req.user = payload;
    next();
}