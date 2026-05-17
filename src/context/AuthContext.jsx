import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          username: firebaseUser.displayName,
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function register(username, email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: username });
    setUser({ username, email, uid: cred.user.uid });
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    setUser({
      username: cred.user.displayName,
      email: cred.user.email,
      uid: cred.user.uid,
    });
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0B20] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}