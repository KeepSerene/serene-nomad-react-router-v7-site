import { appwriteConfig, database } from "./client";
import { Query } from "appwrite";

export async function fetchAllTrips(limit: number, offset: number) {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.dbId,
      appwriteConfig.tripsCollectionId,
      [Query.limit(limit), Query.offset(offset), Query.orderDesc("createdAt")]
    );

    if (total === 0) {
      console.log("No trips found!");

      return { allTrips: [], total };
    }

    return {
      allTrips: documents,
      total,
    };
  } catch (err) {
    console.error("Error fetching trips:", err);

    return {
      allTrips: [],
      total: 0,
    };
  }
}

export async function fetchTripById(tripId: string) {
  try {
    const tripDetailDoc = await database.getDocument(
      appwriteConfig.dbId,
      appwriteConfig.tripsCollectionId,
      tripId
    );

    if (!tripDetailDoc?.$id) {
      console.log("Trip not found!");

      return null;
    }

    return tripDetailDoc;
  } catch (err) {
    console.error("Error fetching trip:", err);

    return null;
  }
}
