import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";


export const Logout = () => {
  const { setAuth, setCounters } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    //clean local storage
    localStorage.clear();

    //setter global states to empty
    setAuth({});
    setCounters({});

    //Navigate to login page
    navigate("/login");
  });
  return <h1>Loging out...</h1>;
};
