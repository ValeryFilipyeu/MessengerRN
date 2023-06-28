import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { child, getDatabase, ref, set } from "firebase/database";
import { Dispatch } from "@reduxjs/toolkit";

import { getFirebaseApp } from "../firebaseHelper";
import { authenticate, logout } from "../../store/authSlice";
import { getUserData } from "./userActions";
import { UserData } from "../../types";

let timer: NodeJS.Timer;

export const signUp = (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  return async (dispatch: Dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = result.user;

      let userToken: string | null = null;
      let userExpirationTime: string | null = null;

      onAuthStateChanged(auth, (user) => {
        if (user) {
          user.getIdTokenResult().then((idTokenResult) => {
            const { token, expirationTime } = idTokenResult;
            userToken = token;
            userExpirationTime = expirationTime;
          });
        }
      });

      if (userToken && userExpirationTime) {
        const expiryDate = new Date(userExpirationTime);
        const timeNow = new Date();
        const millisecondsUntilExpiry =
          expiryDate.getTime() - timeNow.getTime();

        const userData = await createUser(firstName, lastName, email, uid);

        dispatch(authenticate({ token: userToken, userData }));
        await saveDataToStorage(userToken, uid, expiryDate);

        timer = setTimeout(() => {
          // @ts-ignore
          dispatch(userLogout());
        }, millisecondsUntilExpiry);
      }
    } catch (error) {
      console.log(error);
      const firebaseError = error as FirebaseError;
      const errorCode = firebaseError.code;

      let message = "Something went wrong.";

      if (errorCode === "auth/email-already-in-use") {
        message = "This email is already in use";
      }

      throw new Error(message);
    }
  };
};

export const signIn = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = result.user;

      let userToken: string | null = null;
      let userExpirationTime: string | null = null;

      onAuthStateChanged(auth, (user) => {
        if (user) {
          user.getIdTokenResult().then((idTokenResult) => {
            const { token, expirationTime } = idTokenResult;
            userToken = token;
            userExpirationTime = expirationTime;
          });
        }
      });

      if (userToken && userExpirationTime) {
        const expiryDate = new Date(userExpirationTime);
        const timeNow = new Date();
        const millisecondsUntilExpiry =
          expiryDate.getTime() - timeNow.getTime();

        const userData = await getUserData(uid);

        dispatch(
          authenticate({ token: userToken, userData: userData as UserData })
        );
        await saveDataToStorage(userToken, uid, expiryDate);

        timer = setTimeout(() => {
          // @ts-ignore
          dispatch(userLogout());
        }, millisecondsUntilExpiry);
      }
    } catch (error) {
      const firebaseError = error as FirebaseError;
      const errorCode = firebaseError.code;

      let message = "Something went wrong.";

      if (
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/user-not-found"
      ) {
        message = "The username or password was incorrect";
      }

      throw new Error(message);
    }
  };
};

export const userLogout = () => {
  return async (dispatch: Dispatch) => {
    await AsyncStorage.clear();
    clearTimeout(timer);
    dispatch(logout());
  };
};

const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  userId: string
): Promise<UserData> => {
  const firstLast = `${firstName} ${lastName}`.toLowerCase();
  const userData = {
    firstName,
    lastName,
    firstLast,
    email,
    userId,
    signUpDate: new Date().toISOString(),
  };

  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);
  await set(childRef, userData);
  return userData;
};

const saveDataToStorage = async (
  token: string,
  userId: string,
  expiryDate: Date
): Promise<void> => {
  await AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expiryDate.toISOString(),
    })
  );
};
