import {
  child,
  get,
  getDatabase,
  ref,
  DatabaseReference,
  DataSnapshot,
} from "firebase/database";

import { getFirebaseApp } from "../firebaseHelper";
import { UserData } from "../../types";

export const getUserData = async (userId: string): Promise<UserData | undefined> => {
  try {
    const app = getFirebaseApp();
    const dbRef: DatabaseReference = ref(getDatabase(app));
    const userRef: DatabaseReference = child(dbRef, `users/${userId}`);

    const snapshot: DataSnapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};
