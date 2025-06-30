import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IAdmin } from "../../domain/models/admin";
import { IAdminRepository } from "../../domain/interfaces/repository/admin-repository";
import { Client } from "../database/schemas/client.schema";
import { Vendor } from "../database/schemas/vendor.schema";
import { Booking } from "../database/schemas/booking.schema";
import { CommunityPost } from "../database/schemas/community-post.schema";
import { DashBoardStatsOuput } from "../../domain/types/admin.type";

@injectable()
export class AdminRepository implements IAdminRepository {
  async getDashboardStats(): Promise<DashBoardStatsOuput> {
    // Get total counts
    const [totalClients, totalVendors, totalBookings, totalPosts] =
      await Promise.all([
        Client.countDocuments(),
        Vendor.countDocuments(),
        Booking.countDocuments(),
        CommunityPost.countDocuments(),
      ]);

    // Get booking trends over the last 12 months
    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Get top 5 photographers by booking count
    const topPhotographers = await Booking.aggregate([
      {
        $group: {
          _id: "$vendorId",
          bookingCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "_id",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $unwind: "$vendor",
      },
      {
        $project: {
          vendorId: "$_id",
          name: "$vendor.name",
          profileImage: "$vendor.profileImage",
          bookingCount: 1,
          _id: 0,
        },
      },
      {
        $sort: { bookingCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    // Get new users trend (clients + vendors) over last 12 months
    const clientTrends = await Client.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const vendorTrends = await Vendor.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Combine client and vendor trends
    const userTrendsMap = new Map();
    [...clientTrends, ...vendorTrends].forEach((item) => {
      const key = `${item._id.year}-${item._id.month
        .toString()
        .padStart(2, "0")}`;
      userTrendsMap.set(key, (userTrendsMap.get(key) || 0) + item.count);
    });

    const newUsersTrend = Array.from(userTrendsMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Get recent users (last 10 clients and vendors)
    const recentClients = await Client.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email profileImage createdAt role")
      .lean();

    const recentVendors = await Vendor.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email profileImage createdAt role")
      .lean();

    const recentUsers = [...recentClients, ...recentVendors]
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      )
      .slice(0, 10);

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate("userId", "name email")
      .populate("vendorId", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .select(
        "serviceDetails.serviceTitle totalPrice status paymentStatus createdAt"
      )
      .lean();

    // Get recent posts
    const recentPosts = await CommunityPost.find()
      .populate("userId", "name profileImage")
      .populate("communityId", "name")
      .sort({ createdAt: -1 })
      .limit(10)
      .select(
        "title content mediaType likeCount commentCount createdAt userType"
      )
      .lean();

    // Get post distribution by media type
    const postDistribution = await CommunityPost.aggregate([
      {
        $group: {
          _id: "$mediaType",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          mediaType: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);



    // console.log("Dashboard Stats:");
    // console.log("Total Clients:", totalClients);
    // console.log("Total Vendors:", totalVendors);
    // console.log("Total Bookings:", totalBookings);
    // console.log("Total Posts:", totalPosts);
    // console.log("Booking Trends (last 12 months):", bookingTrends);
    // console.log("Top 5 Photographers by Booking Count:", topPhotographers);
    // console.log("New Users Trend (Clients + Vendors, last 12 months):", newUsersTrend);
    // console.log("Recent Users (last 10):", recentUsers);
    // console.log("Recent Bookings (last 10):", recentBookings);
    // console.log("Recent Posts (last 10):", recentPosts);
    // console.log("Post Distribution by Media Type:", postDistribution);

    const response = {
      totalClients,
      totalVendors,
      totalBookings,
      totalPosts,
      bookingTrends,
      topPhotographers,
      newUsersTrend,
      recentUsers,
      recentBookings,
      recentPosts,
      postDistribution,
    };

    return response as unknown as DashBoardStatsOuput;
  }
}
