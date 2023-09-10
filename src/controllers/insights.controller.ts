import { AnyBulkWriteOperation } from "mongodb";
import Insight from "../models/insight";
import { collections } from "../services/database.service";
import { RequestParams } from "../types/requestParams";

class InsightsController {
  constructor() {}

  async getStocksInsights({
    reqFilterBy,
    reqOrderBy,
    reqPageSize,
    reqPageNumber,
  }: RequestParams) {
    if (!collections.stocksInsights) {
      return [];
    }

    const match = reqFilterBy
      ? {
          $or: [
            { "first.key": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
            { "first.name": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
            { "second.key": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
            { "second.name": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
          ],
        }
      : {};
    const orderBy = { frequency: reqOrderBy || -1 };
    const limit = reqPageSize;
    const skip = (reqPageNumber ? reqPageNumber - 1 : 0) * (limit || 0);

    const pipeline = [] as Object[];

    match && pipeline.push({ $match: match });
    orderBy && pipeline.push({ $sort: orderBy });
    skip && pipeline.push({ $skip: skip });
    limit && pipeline.push({ $limit: limit });

    return await collections.stocksInsights.aggregate(pipeline).toArray();
  }

  async refreshStocksInsights(insights: Insight[]) {
    try {
      if (!insights?.length) {
        return;
      }
      await collections.stocksInsights?.drop({});
    } catch (e) {
      console.log("delete error", (e as any)?.message);
    }
    try {
      const promises = [];
      let bulkOps: AnyBulkWriteOperation[] = [];
      insights.forEach((insight) => {
        bulkOps.push({ insertOne: { document: insight } });
        if (bulkOps.length === 1000) {
          promises.push(collections.stocksInsights?.bulkWrite(bulkOps));
          bulkOps = [];
        }
      });
      if (bulkOps.length > 0) {
        promises.push(collections.stocksInsights?.bulkWrite(bulkOps));
      }

      await Promise.all(promises);
    } catch (e) {
      console.log("insert error", (e as any)?.message);
    }
  }

  async getFundsInsights({
    reqFilterBy,
    reqOrderBy,
    reqPageSize,
    reqPageNumber,
  }: RequestParams) {
    if (!collections.fundsInsights) {
      return [];
    }

    const match = reqFilterBy
      ? {
          $or: [
            { "first.key": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
            { "first.name": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
            { "second.key": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
            { "second.name": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
          ],
        }
      : {};
    const orderBy = { frequency: reqOrderBy || -1 };
    const limit = reqPageSize;
    const skip = (reqPageNumber ? reqPageNumber - 1 : 0) * (limit || 0);

    const pipeline = [] as Object[];

    match && pipeline.push({ $match: match });
    orderBy && pipeline.push({ $sort: orderBy });
    skip && pipeline.push({ $skip: skip });
    limit && pipeline.push({ $limit: limit });

    return await collections.fundsInsights.aggregate(pipeline).toArray();
  }

  async refreshFundsInsights(insights: Insight[]) {
    try {
      if (!insights?.length) {
        return;
      }
      await collections.fundsInsights?.drop({});
    } catch (e) {
      console.log("delete error", (e as any)?.message);
    }
    try {
      const promises = [];
      let bulkOps: AnyBulkWriteOperation[] = [];
      insights.forEach((insight) => {
        bulkOps.push({ insertOne: { document: insight } });
        if (bulkOps.length === 1000) {
          promises.push(collections.fundsInsights?.bulkWrite(bulkOps));
          bulkOps = [];
        }
      });
      if (bulkOps.length > 0) {
        promises.push(collections.fundsInsights?.bulkWrite(bulkOps));
      }

      await Promise.all(promises);
    } catch (e) {
      console.log("insert error", (e as any)?.message);
    }
  }
}

export default new InsightsController();
