// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getDoc(doc(db, "users", result.user.uid));
    setUserProfile(profile.data());
    return profile.data();
  }

  async function register(email, password, nama, noMatrik, role, kelas) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const profile = { nama, noMatrik, role, kelas, email, uid: result.user.uid, createdAt: new Date() };
    await setDoc(doc(db, "users", result.user.uid), profile);
    setUserProfile(profile);
    return profile;
  }

  async function logout() {
    await signOut(auth);
    setUserProfile(null);
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await getDoc(doc(db, "users", user.uid));
        if (profile.exists()) setUserProfile(profile.data());
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
