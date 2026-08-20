import jwt from "jsonwebtoken";

export const validateSessionToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Session token is required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.SESSION_SECRET
        );

        req.sessionId = decoded.sessionId;

        next();
    } catch (error) {
        console.error("Session validation error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired session token"
        });
    }
}