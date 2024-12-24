import * as functions from "firebase-functions";
import { config } from "dotenv";

config();

export const regionalFunctions = functions.region(process.env.REGION as string);
