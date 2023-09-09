import Relationship from "../models/relationship";
import { collections } from "../services/database.service";

type RequestParams = {
  reqFilterBy?: string;
  reqOrderBy?: number;
  reqPageSize?: number;
  reqPageNumber?: number;
};

class RelationshipsManager {
  constructor() {}

  async getFunds({
    reqFilterBy,
    reqOrderBy,
    reqPageSize,
    reqPageNumber,
  }: RequestParams) {
    if (!collections.relationships) {
      return [];
    }

    const match = reqFilterBy
      ? { fund: { $regex: reqFilterBy.replace(".", "\\.") } }
      : {};
    const orderBy = { fund: reqOrderBy || 1 };
    const limit = reqPageSize;
    const skip = (reqPageNumber ? reqPageNumber - 1 : 0) * (limit || 0);

    const pipeline = [
      { $group: { _id: "$fund", stocks: { $push: "$stock" } } },
      { $project: { _id: 0, fund: "$_id", stocks: 1 } },
    ] as Object[];

    match && pipeline.push({ $match: match });
    orderBy && pipeline.push({ $sort: orderBy });
    skip && pipeline.push({ $skip: skip });
    limit && pipeline.push({ $limit: limit });

    return await collections.relationships.aggregate(pipeline).toArray();
  }

  async getStocks({
    reqFilterBy,
    reqOrderBy,
    reqPageSize,
    reqPageNumber,
  }: RequestParams) {
    if (!collections.relationships) {
      return [];
    }

    const match = reqFilterBy
      ? { stock: new RegExp(`.*${reqFilterBy}.*`) }
      : {};
    const orderBy = { fund: reqOrderBy || 1 };
    const limit = reqPageSize;
    const skip = (reqPageNumber ? reqPageNumber - 1 : 0) * (limit || 0);

    const pipeline = [
      { $group: { _id: "$stock", funds: { $push: "$fund" } } },
      { $project: { _id: 0, stock: "$_id", funds: 1 } },
    ] as Object[];

    match && pipeline.push({ $match: match });
    orderBy && pipeline.push({ $sort: orderBy });
    skip && pipeline.push({ $skip: skip });
    limit && pipeline.push({ $limit: limit });

    return await collections.relationships.aggregate(pipeline).toArray();
  }

  async refreshPairs(pairs: Relationship[]) {
    await collections.relationships?.deleteMany({});
    await collections.relationships?.insertMany(pairs);
  }
}

export default new RelationshipsManager();
