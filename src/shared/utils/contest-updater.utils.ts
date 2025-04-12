import cron from "node-cron";
import { ContestModel } from "../../frameworks/database/models/contest.model";

export function startContestStatusCron() {
  cron.schedule("0 * * * *", async () => {
    const now = new Date();

    try {
      await ContestModel.updateMany(
        { startDate: { $gt: now } },
        { $set: { status: "upcoming" } }
      );

      await ContestModel.updateMany(
        { startDate: { $lt: now } },
        { $set: { status: "active" } }
      );

      await ContestModel.updateMany(
        { endDate: { $lt: now } },
        { $set: { status: "ended" } }
      );

      console.log(`[${new Date().toISOString()}] Contest status updated`);
    } catch (error) {
      console.log("error uddating contest statuses : ", error);
    }
  });
}