import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Export all triggers from the dedicated email triggers module
export * from "./email-triggers";

// Sample Hello World Function
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase Cloud Functions!");
});
