import app from "./app";
import { Config } from "./config";

console.log(Config.PORT);

const startServer = () => {
    const PORT = Config.PORT;
    try {
        app.listen(PORT, () =>
            console.log(
                `Server is running on port ${PORT}`,
            ),
        );
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();
