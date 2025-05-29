import express, {
    NextFunction,
    Request,
    Response,
} from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import cors from "cors";
import { Config } from "./config";

const app = express();

// setup cors policy
app.use(
    cors({
        origin: Config.FRONTEND_DOMAIN,
        credentials: true,
    }),
);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to sever.");
});

// global error handler
app.use(
    (
        err: HttpError,
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        logger.error(err.message);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            msg: err.message,
        });
    },
);

export default app;
