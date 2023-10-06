import Update from "../models/update";
import { collections } from "../services/database.service";

class UpdatesController {
  constructor() {}

  async getMostRecentUpdate() {
    const updates = (await collections.updates
      ?.find()
      .sort("timestamp", -1)
      .toArray()) || [{ name: "" }];
    return (updates[0] as Update)?.name || "";
  }

  async insertNewUpdate(strFileName: string) {
    await collections.updates?.insertOne({
      name: strFileName,
      timestamp: Date.now(),
    });
  }
}

export default new UpdatesController();
