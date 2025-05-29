import express, {
    NextFunction,
    Request,
    Response,
} from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import cors from "cors";
import { Config } from "./config";
import rateLimit from "express-rate-limit";
import eventRoute from "./event/eventRouter";

const app = express();
app.use(express.json({ limit: "4kb" }));
app.use(express.urlencoded({ extended: true }));
// setup cors policy
app.use(
    cors({
        origin: Config.FRONTEND_DOMAIN,
        credentials: true,
    }),
);

// handeling global rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    limit: 10,
    message:
        "Too many request from this IP ,please try later.Only 10 request per 15 min are allowed",
});

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to sever.");
});

app.use("/api/v1/events", limiter);

app.use("/api/v1/events", eventRoute);

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
