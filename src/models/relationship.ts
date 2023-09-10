import { ObjectId } from "mongodb";

export default class Relationship {
  constructor(
    public fund: string,
    public fundPretty: string,
    public stock: string,
    public stockPretty: string,
    public id?: ObjectId
  ) {}
}
