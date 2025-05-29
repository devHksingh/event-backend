import { Request, Response, NextFunction } from "express";
import { getJson } from "serpapi";
import { Config } from "../config";
import { searchParaZodSchema } from "./eventZodSchema";
import createHttpError from "http-errors";
import z from "zod";
import logger from "../config/logger";

const getEventDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        console.log("req.body", req.body);
        const isValidRequest = searchParaZodSchema.parse(
            req.body,
        );
        const { searchPara } = isValidRequest;

        const json = await new Promise((resolve) => {
            getJson(
                {
                    engine: "google_events",
                    q: searchPara,
                    hl: "en",
                    gl: "us",
                    api_key: Config.API_KEY,
                },
                (data) => {
                    // Check if data exists
                    if (!data) {
                        return next(
                            createHttpError(
                                500,
                                "No data received from SerpAPI",
                            ),
                        );
                    }

                    // Check for SerpAPI errors
                    if (data.error) {
                        const errorMessage = data.error;

                        // Handle specific error cases based on SerpAPI documentation
                        if (
                            errorMessage.includes("429") ||
                            errorMessage
                                .toLowerCase()
                                .includes(
                                    "too many requests",
                                )
                        ) {
                            return next(
                                createHttpError(
                                    429,
                                    "Too many requests. Please try again later.",
                                ),
                            );
                        }

                        if (
                            errorMessage.includes("401") ||
                            errorMessage
                                .toLowerCase()
                                .includes("unauthorized")
                        ) {
                            return next(
                                createHttpError(
                                    401,
                                    "Invalid API key or unauthorized access",
                                ),
                            );
                        }

                        if (
                            errorMessage.includes("400") ||
                            errorMessage
                                .toLowerCase()
                                .includes("bad request")
                        ) {
                            return next(
                                createHttpError(
                                    400,
                                    "Bad request parameters",
                                ),
                            );
                        }

                        if (
                            errorMessage.includes("403") ||
                            errorMessage
                                .toLowerCase()
                                .includes("forbidden")
                        ) {
                            return next(
                                createHttpError(
                                    403,
                                    "Forbidden access",
                                ),
                            );
                        }

                        if (
                            errorMessage.includes("404") ||
                            errorMessage
                                .toLowerCase()
                                .includes("not found")
                        ) {
                            return next(
                                createHttpError(
                                    404,
                                    "Resource not found",
                                ),
                            );
                        }

                        if (
                            errorMessage.includes("500") ||
                            errorMessage
                                .toLowerCase()
                                .includes(
                                    "internal server error",
                                )
                        ) {
                            return next(
                                createHttpError(
                                    502,
                                    "SerpAPI server error",
                                ),
                            );
                        }

                        // Generic error handling for unknown errors
                        return next(
                            createHttpError(
                                500,
                                `SerpAPI Error: ${errorMessage}`,
                            ),
                        );
                    }

                    // Success case
                    resolve(data["events_results"]);
                },
            );
        });

        // Send successful response
        res.status(200).json({
            success: true,
            message: "Event details retrieved successfully",
            data: json,
        });
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            next(
                createHttpError(401, {
                    message: {
                        type: "Validation error",
                        zodError: error.errors,
                    },
                }),
            );
        }
        // Handle generic errors
        logger.error(
            "Unexpected error in getEventDetails:",
            error,
        );
        return next(
            createHttpError(500, "Internal server error"),
        );
    }
};

export { getEventDetails };
