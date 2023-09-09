import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: {
  relationships?: mongoDB.Collection;
  stocksInsights?: mongoDB.Collection;
  fundsInsights?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {
  dotenv.config();
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING || ""
  );

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  const relationshipsCollection: mongoDB.Collection = db.collection(
    process.env.RELATIONSHIPS_COLLECTION_NAME || ""
  );

  collections.relationships = relationshipsCollection;

  const stocksInsightsCollection: mongoDB.Collection = db.collection(
    process.env.STOCKS_INSIGHTS_COLLECTION_NAME || ""
  );

  collections.stocksInsights = stocksInsightsCollection;

  const fundsInsightsCollection: mongoDB.Collection = db.collection(
    process.env.FUNDS_INSIGHTS_COLLECTION_NAME || ""
  );

  collections.fundsInsights = fundsInsightsCollection;
}
