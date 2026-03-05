import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const storedPremium = await AsyncStorage.getItem("premium");
    setIsPremium(storedPremium === "true");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isPremium,
        setIsPremium,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};