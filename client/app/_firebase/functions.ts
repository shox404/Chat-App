"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "./config";
import { User } from "../types";
import { createDoc, getOneDocByField } from "./utils";
import { setCookie } from "@/lib/cookie";

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const auth_data = result.user;

    if (!auth_data.email) return;

    const user: User = {
      fullName: auth_data.displayName,
      email: auth_data.email,
      image: auth_data.photoURL,
    };

    const existingUser = await getOneDocByField(
      "users",
      "email",
      auth_data.email
    );

    if (!existingUser) {
      await createDoc("users", user);
    }

    const token = await auth_data.getIdToken();

    setCookie("auth-token", token);

    return user;
  } catch {}
};
