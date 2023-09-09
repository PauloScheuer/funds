import { AnyBulkWriteOperation } from "mongodb";
import Insight from "../models/insight";
import { collections } from "../services/database.service";

class InsightsManager {
  constructor() {}

  async getStocksInsights() {}

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

export default new InsightsManager();
