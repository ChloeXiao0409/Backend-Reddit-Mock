// 2. Import Congifuration
const config = require("./utils/config");
const express = require("express");
// 4. helmet - for security
const helmet = require("helmet");
// 6. CORS - for cross-origin requests
const cors = require("cors");
// 5. morgan - for logging
const morgan = require("./middleware/morgan.middleware");
// 7. rateLimit - for limiting requests
const rateLimit = require("./middleware/rateLimit.middleware");
const errorMiddleware = require("./middleware/error/index");
// 3. Setting Logger - winston - pay attention to the destructuring cus there are two objects in the module.exports
const { logger } = require("./utils/logger");
const v1Router = require("./routes");


const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan);
app.use(rateLimit);
app.use(express.json()); // Make sure to the body is parsed as JSON

// 1. Confirm the server is running
// app.get("/", (req, res) => {
//     res.json("Hello, world!");
// })
// 8. Replace the above to Router
app.use("/v1", v1Router);
// 10. Error Handling Middleware
errorMiddleware.forEach(handler => app.use(handler));

module.exports = app;