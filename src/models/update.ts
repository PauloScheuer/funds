import { ObjectId } from "mongodb";

export default class Update {
  constructor(
    public name: string,
    public timestamp: number,
    public _id?: ObjectId
  ) {}
}
