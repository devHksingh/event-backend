import { config } from "dotenv";
config();

const { PORT, NODE_ENV, FRONTEND_DOMAIN, API_KEY } = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    FRONTEND_DOMAIN,
    API_KEY,
};
