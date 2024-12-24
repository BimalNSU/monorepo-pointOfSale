import expressApp from "./express-app";
import { regionalFunctions } from "./utils/functions";

export const api = regionalFunctions.https.onRequest(expressApp);

// export * from "./notifications";

// export * from "./cron";

// export * from "./cloudTaskQueue";
