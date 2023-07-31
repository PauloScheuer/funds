import express from "express";
import cors from "cors";
import downloadResource from "./resourceDownloader";
import { connectToDatabase } from "./services/database.service";
import { relationshipsRouter } from "./routes/relationships.router";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

connectToDatabase().then(() => {
  app.use("/relationships", relationshipsRouter);
  app.listen(3333);
});

downloadResource();
