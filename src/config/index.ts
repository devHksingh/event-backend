import { config } from "dotenv";
config();

const { PORT, NODE_ENV, FRONTEND_DOMAIN } = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    FRONTEND_DOMAIN,
};
