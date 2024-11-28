import React, { useState, useEffect, useRef, createContext } from "react";
import * as SecureStore from 'expo-secure-store';

const Context = createContext()

const Provider = ({ children }) => {

  // This is to run it locally, and backend command is `python manage.py runserver 0.0.0.0:8000`
  // const [domain, setDomain] = useState("http://10.0.0.219:8000");

  const [domain, setDomain] = useState("https://echolearn.online");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState({});
  const [token, setToken] = useState(false);
  const [refreshToken, setRefreshToken] = useState(null);
  
  const storeTokens = async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  };

  // Load tokens from secure storage
  const loadTokens = async () => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
  
    if (accessToken && refreshToken) {
      setToken(accessToken);
      setRefreshToken(refreshToken);
  
      // Validate token on startup (you can call verifyToken function here)
      const isValidToken = await verifyToken(accessToken);
      if (isValidToken) {
        setIsLoggedIn(true);
      } else {
        // If invalid, clear the tokens
        setToken(null);
        setRefreshToken(null);
        setIsLoggedIn(false);
      }
    } else {
      // No tokens, user is logged out
      setToken(null);
      setRefreshToken(null);
      setIsLoggedIn(false);
    }
  };
  

  // Verify if the access token is still valid
  const verifyToken = async (accessToken) => {
    if (!accessToken) return false;
    try {
      const response = await fetch(`${domain}/api/token/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: accessToken }),
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        // If verification fails, attempt to refresh the token
        await refreshAccessToken();
      }
    } catch (error) {
      console.error("Token verification failed:", error.message);
    }
  };

  // Refresh the access token using the refresh token
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      setIsLoggedIn(false);
      return;
    }
  
    try {
      const response = await fetch(`${domain}/api/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) throw new Error("Failed to refresh token");

      const data = await response.json();
      const newAccessToken = data.access;
      const newRefreshToken = data.refresh || refreshToken;

      // Update tokens in state and secure storage
      setToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      await storeTokens(newAccessToken, newRefreshToken);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Token refresh failed:", error.message);
      setIsLoggedIn(false);
    }
  };

  // Log in and obtain access and refresh tokens
  const login = async (username, password) => {
    try {
      const response = await fetch(`${domain}/api/token/pair`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      
      const accessToken = data.access;
      const refreshToken = data.refresh;
  
      setToken(accessToken);
      setRefreshToken(refreshToken);
      await storeTokens(accessToken, refreshToken);
      setIsLoggedIn(true);

      return data;
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  // Log out and clear stored tokens
  const logout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    setToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);
  };

  // Automatically load tokens when the app starts
  useEffect(() => {
    loadTokens();
  }, []);


  const globalContext = {
    domain,
    isLoggedIn,
    userObj,
    setUserObj,
    token,
    setToken,
    refreshToken,
    setRefreshToken,
    login,
    logout,
    refreshAccessToken,
    storeTokens,
  };

  return <Context.Provider value={globalContext}>{children}</Context.Provider>

};

export { Context, Provider };