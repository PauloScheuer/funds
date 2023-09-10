import Relationship from "../models/relationship";
import { collections } from "../services/database.service";
import { RequestParams } from "../types/requestParams";

class RelationshipsController {
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
      ? {
          $or: [
            {
              fund: {
                $regex: reqFilterBy.toLocaleUpperCase().replace(".", "\\."),
              },
            },
            {
              fundPretty: {
                $regex: reqFilterBy.toLocaleUpperCase().replace(".", "\\."),
              },
            },
          ],
        }
      : {};
    const orderBy = { fund: reqOrderBy || 1 };
    const limit = reqPageSize;
    const skip = (reqPageNumber ? reqPageNumber - 1 : 0) * (limit || 0);

    const pipeline = [
      {
        $group: {
          _id: "$fund",
          fundPretty: { $first: "$fundPretty" },
          stocks: { $push: "$stock" },
          stocksPretty: { $push: "$stockPretty" },
        },
      },
      {
        $project: {
          _id: 0,
          fund: "$_id",
          fundPretty: 1,
          stocks: 1,
          stocksPretty: 1,
        },
      },
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
      ? {
          $or: [
            { stock: new RegExp(`.*${reqFilterBy.toLocaleUpperCase()}.*`) },
            {
              stockPretty: new RegExp(`.*${reqFilterBy.toLocaleUpperCase()}.*`),
            },
          ],
        }
      : {};
    const orderBy = { stock: reqOrderBy || 1 };
    const limit = reqPageSize;
    const skip = (reqPageNumber ? reqPageNumber - 1 : 0) * (limit || 0);

    const pipeline = [
      {
        $group: {
          _id: "$stock",
          stockPretty: { $first: "$stockPretty" },
          funds: { $push: "$fund" },
          fundsPretty: { $push: "$fundPretty" },
        },
      },
      {
        $project: {
          _id: 0,
          stock: "$_id",
          stockPretty: 1,
          funds: 1,
          fundsPretty: 1,
        },
      },
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

export default new RelationshipsController();
