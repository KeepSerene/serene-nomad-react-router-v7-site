import { Client, Account, Databases, Storage } from "appwrite";

export const appwriteConfig = {
  endpointUrl: import.meta.env.VITE_APPWRITE_API_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  apiKey: import.meta.env.VITE_APPWRITE_API_KEY,
  dbId: import.meta.env.VITE_APPWRITE_DB_ID,
  usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  tripsCollectionId: import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION_ID,
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);

export const database = new Databases(client);

export const storage = new Storage(client);
