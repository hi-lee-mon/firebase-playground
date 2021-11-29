import {
  getAuth,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { app } from "./firebase";

import { GoogleAuthProvider } from "firebase/auth";

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

/**
 * ベーシック登録
 */
export const register = async (email: string, password: string) => {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    console.log(user);
  } catch (error) {
    alert(error);
  }
};

/**
 * ベーシックログイン
 * @param email
 * @param password
 */
export const login = async (email: string, password: string) => {
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
  } catch (error) {
    alert(error);
  }
};

/**
 * Googleでログイン
 * @returns {User}
 */
export const signInGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

/**
 * サインアウト
 */
export const logout = async () => {
  await signOut(auth);
};
