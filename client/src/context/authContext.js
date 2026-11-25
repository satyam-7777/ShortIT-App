import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export async function authAPI(formData, endpoint, errorMsg) {
  const response = await fetch(`/api/v1/auth/${endpoint}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: formData ? JSON.stringify(formData) : null,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `${errorMsg} failed`);
  }

  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  async function getCurrentUser() {
    try {
      const response = await fetch("/api/v1/auth/me", {
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const res = await response.json();
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }

  async function logoutUser() {
    try {
      await authAPI(null, "logout", "Logout");
      setUser(null);
    } catch (err) {
      console.log("Error while logging out:", err.message);
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
