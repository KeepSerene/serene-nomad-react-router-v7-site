import { ID, OAuthProvider, Query } from "appwrite";
import { account, database, appwriteConfig } from "~/appwrite/client";
import { redirect } from "react-router";

export const logInWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/404`
    );

    return true;
  } catch (err) {
    console.error("Error during OAuth2 session creation:", err);

    return false;
  }
};

export const fetchExistingUserDetail = async (userId: string) => {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.dbId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", userId)]
    );

    return total > 0 ? documents[0] : null;
  } catch (err) {
    console.error("Error fetching user:", err);

    return null;
  }
};

const fetchGooglePFPUrl = async (accessToken: string) => {
  try {
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!response.ok)
      throw new Error("Failed to fetch Google profile picture!");

    const data = await response.json();
    const photos = data.photos as Array<{ url: string; default?: boolean }>;

    return photos?.[0]?.url || null;
  } catch (error) {
    console.error("Error fetching Google picture:", error);

    return null;
  }
};

export const storeUserData = async () => {
  try {
    const user = await account.get();

    if (!user) throw new Error("User not found!");

    const { providerAccessToken } = (await account.getSession("current")) || {};

    const profilePicture = providerAccessToken
      ? await fetchGooglePFPUrl(providerAccessToken)
      : null;

    const createdUser = await database.createDocument(
      appwriteConfig.dbId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        name: user.name,
        email: user.email,
        imageUrl: profilePicture,
        joinedAt: new Date().toISOString(),
      }
    );

    if (!createdUser.$id) redirect("/sign-in");
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

export const fetchUserDetail = async () => {
  try {
    const user = await account.get();

    if (!user) return redirect("/sign-in");

    const { documents } = await database.listDocuments(
      appwriteConfig.dbId,
      appwriteConfig.usersCollectionId,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
      ]
    );

    return documents.length > 0 ? documents[0] : redirect("/sign-in");
  } catch (error) {
    console.error("Error fetching user:", error);

    return null;
  }
};

export const logOutUser = async () => {
  try {
    await account.deleteSession("current");

    return true;
  } catch (err) {
    console.error("Error during logout:", err);

    return false;
  }
};
