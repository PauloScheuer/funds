import express from "express";
import cors from "cors";
import downloader from "./modules/downloaderModule/downloader";
import { collections, connectToDatabase } from "./services/database.service";
import { relationshipsRouter } from "./routes/relationships.router";
import { insightsRouter } from "./routes/insights.router";
import insightsController from "./controllers/insights.controller";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

connectToDatabase().then(() => {
  app.use("/relationships", relationshipsRouter);
  app.use("/insights", insightsRouter);
  app.listen(3333);

  downloader();
});
