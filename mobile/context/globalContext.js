import React, { useState, useEffect, useRef, createContext } from "react";
import * as SecureStore from 'expo-secure-store';

const Context = createContext()

const Provider = ({ children }) => {

  const [ domain, setDomain ] = useState("http://10.0.0.219:8000");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState({});
  const [token, setToken] = useState(false);

  const storeToken = async (token) => {
    await SecureStore.setItemAsync('token', token);
  }

  const globalContext = {
    domain,
    isLoggedIn,
    setIsLoggedIn,
    userObj,
    setUserObj,
    token,
    setToken,
    storeToken,
  }

  return <Context.Provider value={globalContext}>{children}</Context.Provider>

};

export { Context, Provider };