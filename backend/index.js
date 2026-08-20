import "dotenv/config";
import express from "express";
import router from "./routes/routes.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors())

app.use("/api", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});