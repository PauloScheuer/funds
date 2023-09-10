import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import InsightsController from "../controllers/insights.controller";

export const insightsRouter = express.Router();
insightsRouter.use(express.json());

insightsRouter.get("/funds", async (req: Request, res: Response) => {
  try {
    if (!collections.fundsInsights) {
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

    const insights = await InsightsController.getFundsInsights({
      reqFilterBy,
      reqOrderBy,
      reqPageSize,
      reqPageNumber,
    });

    res.send(JSON.stringify(insights));
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});

insightsRouter.get("/stocks", async (req: Request, res: Response) => {
  try {
    if (!collections.stocksInsights) {
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

    const insights = await InsightsController.getStocksInsights({
      reqFilterBy,
      reqOrderBy,
      reqPageSize,
      reqPageNumber,
    });

    res.send(JSON.stringify(insights));
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});
