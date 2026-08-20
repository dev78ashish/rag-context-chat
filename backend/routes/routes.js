import express from "express";
import {
    healthCheck,
    createSession,
    setContext,
    queryContext
} from "../controllers/controllers.js";

import { validateSessionToken } from "../middleware/sessionAuth.js";

const router = express.Router();

router.get("/", healthCheck);

router.get("/create-session", createSession);

router.post(
    "/set-context",
    validateSessionToken,
    setContext
);

router.post(
    "/query-context",
    validateSessionToken,
    queryContext
);

export default router;