import { ObjectId } from "mongodb";

export default class Insight {
  constructor(
    public first: { key: string; name: string }[],
    public second: { key: string; name: string }[],
    public frequency: number,
    public _id?: ObjectId
  ) {}
}
