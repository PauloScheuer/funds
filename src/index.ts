import express from "express";
import cors from "cors";
import downloader from "./modules/downloaderModule/downloader";
import { connectToDatabase } from "./services/database.service";
import { relationshipsRouter } from "./routes/relationships.router";
import { insightsRouter } from "./routes/insights.router";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

connectToDatabase()
  .then(() => {
    console.log("Connected to DB");
    app.use("/relationships", relationshipsRouter);
    app.use("/insights", insightsRouter);
    app.listen(3333);

    downloader();
  })
  .catch((e) => {
    console.log("Error connecting to DB", e);
  });
