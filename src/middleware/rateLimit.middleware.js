const config = require("../utils/config");
const {rateLimit} = require('express-rate-limit');

const rateLimiter = rateLimit({
	windowMs: config.RATE_LIMIT_WINDOW_MS, // 15 minutes
	limit: config.RATE_LIMIT_LIMIT, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    skip: () => {config.NODE_ENV !== 'production'}, // Disable the rate limiter in development mode, but in production mode.
})

module.exports = rateLimiter;