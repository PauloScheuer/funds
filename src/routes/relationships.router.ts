import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import { calculateJaccardSimilarity } from "../utils/similarityUtils";

export const relationshipsRouter = express.Router();
relationshipsRouter.use(express.json());

relationshipsRouter.get("/funds", async (req: Request, res: Response) => {
  try {
    if (!collections.relationships) {
      throw new Error("There is no data");
    }

    const match = req.body.filterBy
      ? { fund: { $regex: req.body.filterBy.replace(".", "\\.") } }
      : {};
    const orderBy = { fund: req.body.orderBy || 1 };
    const skip = req.body.pageNumber ? req.body.pageNumber - 1 : 0;
    const limit = req.body.pageSize || 10;

    const pipeline = [
      { $group: { _id: "$fund", stocks: { $push: "$stock" } } },
      { $project: { _id: 0, fund: "$_id", stocks: 1 } },
      { $match: match },
      { $sort: orderBy },
      { $skip: skip },
      { $limit: limit },
    ];

    const funds = await collections.relationships.aggregate(pipeline).toArray();

    res.send(JSON.stringify(funds));
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});

relationshipsRouter.get("/stocks", async (req: Request, res: Response) => {
  try {
    if (!collections.relationships) {
      throw new Error("There is no data");
    }

    const filterBy = req.body.filterBy
      ? { stock: new RegExp(`.*${req.body.filterBy}.*`) }
      : {};
    const orderBy = { stock: req.body.orderBy || 1 };
    const skip = req.body.pageNumber ? req.body.pageNumber - 1 : 0;
    const limit = req.body.pageSize || 10;

    const pipeline = [
      { $group: { _id: "$stock", funds: { $push: "$fund" } } },
      { $project: { _id: 0, stock: "$_id", funds: 1 } },
      { $match: filterBy },
      { $sort: orderBy },
      { $skip: skip },
      { $limit: limit },
    ];

    const stocks = await collections.relationships
      .aggregate(pipeline)
      .toArray();

    res.send(JSON.stringify(stocks));
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});

relationshipsRouter.get(
  "/similarFunds",
  async (req: Request, res: Response) => {
    try {
      if (!collections.relationships) {
        throw new Error("There is no data");
      }

      const fund = req.body.fund;

      if (!fund) {
        throw new Error("The request need a fund");
      }

      const skip = req.body.pageNumber ? req.body.pageNumber - 1 : 0;
      const limit = req.body.pageSize || 10;

      const pipeline = [
        { $group: { _id: "$fund", stocks: { $push: "$stock" } } },
        { $project: { _id: 0, fund: "$_id", stocks: 1 } },
      ];

      const allFunds = await collections.relationships
        .aggregate(pipeline)
        .toArray();

      const requestedFundIndex = allFunds.findIndex(
        (entry) => entry.fund === fund
      );

      if (!allFunds[requestedFundIndex]) {
        throw new Error("Fund not found");
      }

      const requestedFund = { ...allFunds[requestedFundIndex] };
      delete allFunds[requestedFundIndex];

      const evaluatedFunds = allFunds
        .map((entry) => {
          return {
            ...entry,
            similarity: calculateJaccardSimilarity(
              requestedFund.stocks,
              entry.stocks
            ),
          };
        })
        .sort((a, b) => b.similarity - a.similarity);

      const paginatedFunds = evaluatedFunds.splice(skip * limit, limit);
      res.send(JSON.stringify(paginatedFunds));
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  }
);
