import React from "react";
import { createContext, useState, useEffect } from "react";
import { Global } from "../helpers/Global";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [counters, setCounters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authUser();
  }, []);

  const authUser = async () => {
    //get authetication user data from localstorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    //verify if token and user are present
    if (!token || !user) {
      setLoading(false);
      return false;
    }

    //convert data to a json object
    const userObj = JSON.parse(user);
    const userId = userObj.id;

    //backen request to verify token and get all user data back
    const request = await fetch(Global.url + "user/profile/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();

    //request for the counters
    const requestCounters = await fetch(
      Global.url + "user/counters/" + userId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const dataCounters = await requestCounters.json();

    //setter the auth state
    setAuth(data.user);
    setCounters(dataCounters);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        counters,
        setCounters,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
