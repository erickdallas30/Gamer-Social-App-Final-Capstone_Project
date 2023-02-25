import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Header } from "./Header";
import { SideBar } from "./SideBar";

export const PrivateLayout = () => {
  const { auth, loading} = useAuth();

  if(loading){
    return <h1>Loading...</h1>
  } else {
    return (
      <>
        {/*LAYOUT*/}
  
        {/*header and navigation*/}
        <Header />
  
        {/*main content*/}
  
        <section className="layout_content">
          {auth._id ? <Outlet /> : <Navigate to="/login" />}
        </section>
  
        {/*side bar menu*/}
        <SideBar />
      </>
    );

  }

  
};
