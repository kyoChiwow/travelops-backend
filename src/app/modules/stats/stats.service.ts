/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from "../booking/booking.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getBookingStatsService = async () => {
  const totalBookingPromise = Booking.countDocuments();

  const totalBookingByStatusPromise = Booking.aggregate([
    // Stage 1: Group by status
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const bookingsPerTourPromise = Booking.aggregate([
    // Stage 1: Group by tour
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    // Stage 2: Sorting Stage
    {
      $sort: {
        bookingCount: -1,
      },
    },
    // Stage 3: Limit Stage
    {
      $limit: 10,
    },
    // Stage 4: Lookup stage
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tour",
      },
    },
    // Stage 5: Unwind stage
    {
      $unwind: "$tour",
    },
    // Stage 6: Project Stage
    {
      $project: {
        bookingCount: 1,
        _id: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);

  const avgGuestCountPerBookingPromise = Booking.aggregate([
    // Stage 1: Group stage
    {
      $group: {
        _id: null,
        avgGuestCount: { $avg: "$guestCount" },
      },
    },
  ]);

  const bookingLast7DaysPromise = Booking.countDocuments({
    createdAt: {
      $gte: sevenDaysAgo,
    },
  });
  const bookingLast30DaysPromise = Booking.countDocuments({
    createdAt: {
      $gte: thirtyDaysAgo,
    },
  });
  const totalBookingsByUniqueUsersPromise = Booking.distinct("user").then(
    (user: any) => user.length,
  );

  const [
    totalBooking,
    totalBookingByStatus,
    bookingsPerTour,
    avgGuestCountPerBooking,
    bookingLast7Days,
    bookingLast30Days,
    totalBookingsByUniqueUsers,
  ] = await Promise.all([
    totalBookingPromise,
    totalBookingByStatusPromise,
    bookingsPerTourPromise,
    avgGuestCountPerBookingPromise,
    bookingLast7DaysPromise,
    bookingLast30DaysPromise,
    totalBookingsByUniqueUsersPromise,
  ]);

  return {
    totalBooking,
    totalBookingByStatus,
    bookingsPerTour,
    avgGuestCountPerBooking: avgGuestCountPerBooking[0]?.avgGuestCount,
    bookingLast7Days,
    bookingLast30Days,
    totalBookingsByUniqueUsers,
  };
};

const getTourStatsService = async () => {
  const totalTourPromise = Tour.countDocuments();

  const totalTourbyTypePromise = Tour.aggregate([
    // Stage 1: connect tour type model --> (lookup stage)
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourType",
        foreignField: "_id",
        as: "type",
      },
    },
    // Stage 2: unwind the array of type to object
    {
      $unwind: "$type",
    },
    // Stage 3: Grouping tour types
    {
      $group: {
        _id: "$type.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const avgTourCostPromise = Tour.aggregate([
    // Stage 1: Group the cost from, do sum, and average the sum
    {
      $group: {
        _id: null,
        avgCostFrom: {
          $avg: "$costFrom",
        },
      },
    },
  ]);

  const totalTourByDivisionPromise = Tour.aggregate([
    // Stage 1: connect division model --> (lookup stage)
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },
    // Stage 2: unwind the array of type to object
    {
      $unwind: "$division",
    },
    // Stage 3: Grouping tour types
    {
      $group: {
        _id: "$division.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalHighestBookedTourPromise = Booking.aggregate([
    // Stage 1: Group the tour
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    // Stage 2: Sort the tour
    {
      $sort: { bookingCount: -1 },
    },
    // Stage 3: Limit the tour
    {
      $limit: 5,
    },
    // Stage 4: Lookup stage
    {
      $lookup: {
        from: "tours",
        let: { tourId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$tourId"] },
            },
          },
        ],
        as: "tour",
      },
    },
    // Stage 5: Unwind stage
    {
      $unwind: "$tour",
    },
    // Stage 6: Project stage
    {
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);

  const [
    totalTour,
    totalTourbyType,
    avgTourCost,
    totalTourByDivision,
    totalHighestBookedTour,
  ] = await Promise.all([
    totalTourPromise,
    totalTourbyTypePromise,
    avgTourCostPromise,
    totalTourByDivisionPromise,
    totalHighestBookedTourPromise,
  ]);

  return {
    totalTour,
    totalTourbyType,
    avgTourCost,
    totalTourByDivision,
    totalHighestBookedTour,
  };
};

const getPaymentStatsService = async () => {
  return {};
};

const getUserStatsService = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInActiveUsersPromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const newUsersInSevenDaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUsersInThirtyDaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const usersByRolePromise = User.aggregate([
    // Stage 1: Group users by role and count total users for each role
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUsersInSevenDays,
    newUsersInThirtyDays,
    usersByRole,
  ] = await Promise.all([
    totalUsersPromise,
    totalActiveUsersPromise,
    totalInActiveUsersPromise,
    totalBlockedUsersPromise,
    newUsersInSevenDaysPromise,
    newUsersInThirtyDaysPromise,
    usersByRolePromise,
  ]);

  return {
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUsersInSevenDays,
    newUsersInThirtyDays,
    usersByRole,
  };
};

export const StatsServices = {
  getBookingStatsService,
  getTourStatsService,
  getPaymentStatsService,
  getUserStatsService,
};
