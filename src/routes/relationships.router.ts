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

    const reqFilterBy = req.query.filterBy ? String(req.query.filterBy) : null;
    const reqOrderBy = req.query.orderBy ? Number(req.query.orderBy) : null;
    const reqPageNumber = req.query.pageNumber
      ? Number(req.query.pageNumber)
      : null;
    const reqPageSize = req.query.pageSize ? Number(req.query.pageSize) : null;

    const match = reqFilterBy
      ? { fund: { $regex: reqFilterBy.replace(".", "\\.") } }
      : {};
    const orderBy = { fund: reqOrderBy || 1 };
    const limit = reqPageSize || 10;
    const skip = (reqPageNumber ? reqPageNumber - 1 : 0) * limit;

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

    const reqFilterBy = req.query.filterBy ? String(req.query.filterBy) : null;
    const reqOrderBy = req.query.orderBy ? Number(req.query.orderBy) : null;
    const reqPageNumber = req.query.pageNumber
      ? Number(req.query.pageNumber)
      : null;
    const reqPageSize = req.query.pageSize ? Number(req.query.pageSize) : null;

    const filterBy = reqFilterBy
      ? { stock: new RegExp(`.*${reqFilterBy}.*`) }
      : {};
    const orderBy = { stock: reqOrderBy || 1 };
    const limit = reqPageSize || 10;
    const skip = (reqPageNumber ? reqPageNumber - 1 : 0) * limit;

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

      const fund = req.query.fund;

      if (!fund) {
        throw new Error("The request need a fund");
      }

      const reqPageNumber = req.query.pageNumber
        ? Number(req.query.pageNumber)
        : null;
      const reqPageSize = req.query.pageSize
        ? Number(req.query.pageSize)
        : null;

      const skip = reqPageNumber ? reqPageNumber - 1 : 0;
      const limit = reqPageSize || 10;

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
