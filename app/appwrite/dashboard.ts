import { appwriteConfig, database } from "./client";
import { parseTripData } from "lib/utils";

type CountJoinedUsersFn = (
  items: Record<string, any>[],
  field: string,
  startCurr: string,
  endPrev?: string
) => number;

export async function fetchUserAndTripStats(): Promise<DashboardStats> {
  const date = new Date();
  const firstDateOfCurrentMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).toISOString();
  const firstDateOfLastMonth = new Date(
    date.getFullYear(),
    date.getMonth() - 1,
    1
  ).toISOString();
  const endDateOfLastMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).toISOString();

  const [usersDoc, tripsDoc] = await Promise.all([
    database.listDocuments(
      appwriteConfig.dbId,
      appwriteConfig.usersCollectionId
    ),
    database.listDocuments(
      appwriteConfig.dbId,
      appwriteConfig.tripsCollectionId
    ),
  ]);

  const countJoinedUsers: CountJoinedUsersFn = (
    items,
    field,
    startCurr,
    endPrev
  ) => {
    return items.filter(
      (item) => item[field] >= startCurr && (!endPrev || item[field] <= endPrev)
    ).length;
  };

  const filterUsersByRole = (role: "user" | "admin") => {
    return usersDoc.documents.filter(
      (doc: Record<string, any>) => doc.status === role
    );
  };

  return {
    totalUsers: usersDoc.total,
    usersJoined: {
      currentMonth: countJoinedUsers(
        usersDoc.documents,
        "joinedAt",
        firstDateOfCurrentMonth,
        undefined
      ),
      lastMonth: countJoinedUsers(
        usersDoc.documents,
        "joinedAt",
        firstDateOfLastMonth,
        endDateOfLastMonth
      ),
    },
    userRole: {
      total: filterUsersByRole("user").length,
      currentMonth: countJoinedUsers(
        filterUsersByRole("user"),
        "joinedAt",
        firstDateOfCurrentMonth,
        undefined
      ),
      lastMonth: countJoinedUsers(
        filterUsersByRole("user"),
        "joinedAt",
        firstDateOfLastMonth,
        endDateOfLastMonth
      ),
    },
    totalTrips: tripsDoc.total,
    tripsCreated: {
      currentMonth: countJoinedUsers(
        tripsDoc.documents,
        "createdAt",
        firstDateOfCurrentMonth,
        undefined
      ),
      lastMonth: countJoinedUsers(
        tripsDoc.documents,
        "createdAt",
        firstDateOfLastMonth,
        endDateOfLastMonth
      ),
    },
  };
}

export const getUserGrowthPerDay = async () => {
  const usersDoc = await database.listDocuments(
    appwriteConfig.dbId,
    appwriteConfig.usersCollectionId
  );

  const userGrowth = usersDoc.documents.reduce(
    (acc: { [key: string]: number }, user: Record<string, any>) => {
      const date = new Date(user.joinedAt);
      const day = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[day] = (acc[day] || 0) + 1;

      return acc;
    },
    {}
  );

  return Object.entries(userGrowth).map(([day, count]) => ({
    count: Number(count),
    day,
  }));
};

export const getTripsCreatedPerDay = async () => {
  const tripsDoc = await database.listDocuments(
    appwriteConfig.dbId,
    appwriteConfig.tripsCollectionId
  );

  const tripsGrowth = tripsDoc.documents.reduce(
    (acc: { [key: string]: number }, trip: Record<string, any>) => {
      const date = new Date(trip.createdAt);
      const day = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {}
  );

  return Object.entries(tripsGrowth).map(([day, count]) => ({
    count: Number(count),
    day,
  }));
};

export const getTripsByTravelStyle = async () => {
  const tripsDoc = await database.listDocuments(
    appwriteConfig.dbId,
    appwriteConfig.tripsCollectionId
  );

  const travelStyleCounts = tripsDoc.documents.reduce(
    (acc: { [key: string]: number }, trip: Record<string, any>) => {
      const tripDetail = parseTripData(trip.tripDetail);

      if (tripDetail && tripDetail.travelStyle) {
        const travelStyle = tripDetail.travelStyle;
        acc[travelStyle] = (acc[travelStyle] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  return Object.entries(travelStyleCounts).map(([travelStyle, count]) => ({
    count: Number(count),
    travelStyle,
  }));
};
