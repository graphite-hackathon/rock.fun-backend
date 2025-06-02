import express, { Express, Request, Response, NextFunction } from "express";
import { createGemRouter } from "./gem/gem.routes";
import cors from "cors";

const app: Express = express();
const gemRouter = createGemRouter();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Simple request logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/api/v1", gemRouter);
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});
app.get("/", (req: Request, res: Response) => {
  res.send("API is running!");
});

// Basic Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send(`Something broke: ${err.message}`);
});

export default app;
