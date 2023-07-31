import { ObjectId } from "mongodb";

export default class Relationship {
  constructor(
    public fund: string,
    public stock: string,
    public id?: ObjectId
  ) {}
}
