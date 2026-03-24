import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import boardsRouter from "./routes/boards.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/boards", boardsRouter);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
