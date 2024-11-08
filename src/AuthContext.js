import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

// Create a context for authentication
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Create the AuthProvider to wrap your application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
