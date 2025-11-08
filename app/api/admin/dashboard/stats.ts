'use server';

import { userCollection, agencyPropertiesCollection } from "@/db/collections";
import { validateAuthorization } from "@/app/api/authorization/role-validation";
import { UserRoles } from "@/data/constants";

type MonthlyPropsDatum = { month: string; listed: number; rented: number };
type ActiveUsersDatum = { day: string; active: number };

export async function getAdminDashboardStats() {
  const allowed = await validateAuthorization([UserRoles.ADMIN]);
  if (!allowed) {
    return { success: false, message: "Not authorized" };
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // User counts
  const [tenants, managers, staff, activeUsers] = await Promise.all([
    userCollection.countDocuments({ role: UserRoles.TENANT }),
    userCollection.countDocuments({ role: UserRoles.AGENCY_MANAGER }),
    userCollection.countDocuments({ role: UserRoles.AGENCY_STAFF }),
    userCollection.countDocuments({ last_sign_in: { $gte: sevenDaysAgo } }),
  ]);

  // Property counts
  const [listedCount, rentedCount] = await Promise.all([
    agencyPropertiesCollection.countDocuments({ status: 'listed' }),
    agencyPropertiesCollection.countDocuments({ status: 'rented' }),
  ]);

  // Properties by month (last 6 months)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthlyAgg = await agencyPropertiesCollection.aggregate([
    { $match: { created_at: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { y: { $year: "$created_at" }, m: { $month: "$created_at" }, status: "$status" },
        count: { $sum: 1 },
      },
    },
  ]).toArray();

  const monthLabels: string[] = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return d.toLocaleString('en', { month: 'short' });
  });

  const monthlyData: MonthlyPropsDatum[] = monthLabels.map((label, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const listed = monthlyAgg.filter((x) => x._id.y === y && x._id.m === m && x._id.status === 'listed').reduce((s, x) => s + x.count, 0);
    const rented = monthlyAgg.filter((x) => x._id.y === y && x._id.m === m && x._id.status === 'rented').reduce((s, x) => s + x.count, 0);
    return { month: label, listed, rented };
  });

  // Active users by day (last 7 days)
  const days: Date[] = Array.from({ length: 7 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i)));
  const activePerDayAgg = await userCollection.aggregate([
    { $match: { last_sign_in: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: {
          y: { $year: "$last_sign_in" },
          m: { $month: "$last_sign_in" },
          d: { $dayOfMonth: "$last_sign_in" },
        },
        count: { $sum: 1 },
      },
    },
  ]).toArray();

  const activeUsersSeries: ActiveUsersDatum[] = days.map((d) => {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const found = activePerDayAgg.find((x) => x._id.y === y && x._id.m === m && x._id.d === day);
    return { day: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }), active: found ? found.count : 0 };
  });

  return {
    success: true,
    data: {
      counts: {
        tenants,
        managers,
        staff,
        activeUsers,
        listedCount,
        rentedCount,
      },
      charts: {
        propertiesMonthly: monthlyData,
        activeUsersDaily: activeUsersSeries,
      },
    },
  };
}


