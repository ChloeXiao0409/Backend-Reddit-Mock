// For testing purposes -> importing the app
const app = require("./app");

// 2. Import Congifuration
const config = require("./utils/config");
// 3. Setting Logger - winston - pay attention to the destructuring cus there are two objects in the module.exports
const { logger } = require("./utils/logger");

// 9. Database Connection
connectToDb();

app.listen(config.PORT, () => {
    // console.log(`Server is running on port ${config.PORT}`);
    // After 3. Setting Logger - winston, replace console.log with logger.info
    logger.info(`Server is running on port ${config.PORT}`);
})

