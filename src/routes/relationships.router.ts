import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import Relationship from "../models/relationship";

export const relationshipsRouter = express.Router();
relationshipsRouter.use(express.json());

relationshipsRouter.get("/", async (req: Request, res: Response) => {
  try {
    if (!collections.relationships) {
      return;
    }

    const relationships = await collections.relationships.find({}).toArray();
    res.send(JSON.stringify(relationships));
  } catch (err: any) {
    res.status(400).send("Error");
  }
});

relationshipsRouter.get("/funds", async (req: Request, res: Response) => {
  try {
    if (!collections.relationships) {
      return;
    }

    const relationships = (await collections.relationships
      .find({})
      .toArray()) as any as Relationship[];
    const funds: { [key: string]: string[] } = {};
    relationships.forEach((relationship) => {
      const curStocks = funds[relationship.fund] || [];
      funds[relationship.fund] = [...curStocks, relationship.stock];
    });
    console.log(JSON.stringify(funds));
    res.send(JSON.stringify(funds));
  } catch (err: any) {
    res.status(400).send("Error");
  }
});

relationshipsRouter.get("/stocks", async (req: Request, res: Response) => {
  try {
    if (!collections.relationships) {
      return;
    }

    const relationships = (await collections.relationships
      .find({})
      .toArray()) as any as Relationship[];
    const stocks: { [key: string]: string[] } = {};
    relationships.forEach((relationship) => {
      const curStocks = stocks[relationship.stock] || [];
      stocks[relationship.stock] = [...curStocks, relationship.fund];
    });
    console.log(JSON.stringify(stocks));
    res.send(JSON.stringify(stocks));
  } catch (err: any) {
    res.status(400).send("Error");
  }
});
