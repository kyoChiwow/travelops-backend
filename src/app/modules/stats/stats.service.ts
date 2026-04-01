import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getBookingStatsService = async () => {
  return {};
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
            as: "type"
        }
    },
    // Stage 2: unwind the array of type to object
    {
        $unwind: "$type"
    },
    // Stage 3: Grouping tour types
    {
        $group: {
            _id: "$type.name",
            count: { $sum: 1 }
        }
    }
  ])

  const avgTourCostPromise = Tour.aggregate([
    // Stage 1: Group the cost from, do sum, and average the sum
    {
        $group: {
            _id: null,
            avgCostFrom: {
                $avg: "$costFrom"
            }
        }
    }
  ])

  const totalTourByDivisionPromise = Tour.aggregate([
    // Stage 1: connect division model --> (lookup stage)
    {
        $lookup: {
            from: "divisions",
            localField: "division",
            foreignField: "_id",
            as: "division"
        }
    },
    // Stage 2: unwind the array of type to object
    {
        $unwind: "$division"
    },
    // Stage 3: Grouping tour types
    {
        $group: {
            _id: "$division.name",
            count: { $sum: 1 }
        }
    }
  ])

  const totalHighestBookedTourPromise = Tour.aggregate([
    // Stage 1: Group the tour
    {
        $group: {
            _id: "$tour",
            bookingCount: { $sum: 1 } 
        }
    },
    // Stage 2: Sort the tour
    {
        $sort: { bookingCount: -1 },
    },
    // Stage 3: Limit the tour
    {
        $limit: 5
    }
  ])

  const [totalTour, totalTourbyType, avgTourCost, totalTourByDivision, totalHighestBookedTour] = await Promise.all([
    totalTourPromise,
    totalTourbyTypePromise,
    avgTourCostPromise,
    totalTourByDivisionPromise,
    totalHighestBookedTourPromise
  ])

  return {
    totalTour,
    totalTourbyType,
    avgTourCost,
    totalTourByDivision,
    totalHighestBookedTour
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
