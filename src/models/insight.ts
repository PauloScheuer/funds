import { ObjectId } from "mongodb";

export default class Insight {
  constructor(
    public first: string[],
    public second: string[],
    public frequency: number,
    public _id?: ObjectId
  ) {}
}
