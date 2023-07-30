import express from "express";
import cors from "cors";
import downloadResource from "./resourceDownloader";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(3333);

downloadResource();
