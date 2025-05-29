import express from "express";
import { getEventDetails } from "./eventController";

const eventRoute = express.Router();

eventRoute.post("/getEventDetails", getEventDetails);

export default eventRoute;
