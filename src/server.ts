import app from "./app";
import { Config } from "./config";
import logger from "./config/logger";

const startServer = () => {
    const PORT = Config.PORT;
    try {
        app.listen(PORT, () =>
            logger.info("Server is running on port", {
                port: PORT,
            })
        );
    } catch (error) {
        logger.error("Sever faccing an error", {
            error: error,
        });
        process.exit(1);
    }
};

startServer();
