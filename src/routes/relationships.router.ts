import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import { calculateJaccardSimilarity } from "../utils/similarityUtils";
import RelationshipsController from "../controllers/relationships.controller";

export const relationshipsRouter = express.Router();
relationshipsRouter.use(express.json());

relationshipsRouter.get("/funds", async (req: Request, res: Response) => {
  try {
    if (!collections.relationships) {
      throw new Error("There is no data");
    }

    const reqFilterBy = req.query.filterBy
      ? String(req.query.filterBy)
      : undefined;
    const reqOrderBy = req.query.orderBy
      ? Number(req.query.orderBy)
      : undefined;
    const reqPageNumber = req.query.pageNumber
      ? Number(req.query.pageNumber)
      : undefined;
    const reqPageSize = req.query.pageSize
      ? Number(req.query.pageSize)
      : undefined;

    const funds = await RelationshipsController.getFunds({
      reqFilterBy,
      reqOrderBy,
      reqPageSize,
      reqPageNumber,
    });

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

    const reqFilterBy = req.query.filterBy
      ? String(req.query.filterBy)
      : undefined;
    const reqOrderBy = req.query.orderBy
      ? Number(req.query.orderBy)
      : undefined;
    const reqPageNumber = req.query.pageNumber
      ? Number(req.query.pageNumber)
      : undefined;
    const reqPageSize = req.query.pageSize
      ? Number(req.query.pageSize)
      : undefined;

    const stocks = await RelationshipsController.getStocks({
      reqFilterBy,
      reqOrderBy,
      reqPageSize,
      reqPageNumber,
    });

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

      const allFunds = await RelationshipsController.getFunds({});

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
