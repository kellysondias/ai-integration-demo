import express from "express";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(express.json());

app.use("/api", chatRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
