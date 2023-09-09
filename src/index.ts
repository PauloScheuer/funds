import express from "express";
import cors from "cors";
import downloader from "./modules/downloaderModule/downloader";
import { connectToDatabase } from "./services/database.service";
import { relationshipsRouter } from "./routes/relationships.router";
import { createRecomendations } from "./modules/aprioriModule/apriori";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

connectToDatabase().then(() => {
  app.use("/relationships", relationshipsRouter);
  app.listen(3333);

  downloader();
});
