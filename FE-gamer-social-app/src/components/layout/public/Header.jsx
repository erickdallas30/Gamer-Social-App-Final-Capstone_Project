import React from "react";
import { Nav } from "./Nav";

export const Header = () => {
  return (
    <header className="layout__navbar">
      <div className="navbar__header">
        <h1  className="navbar__title">
          Social <i className="fa-solid fa-gamepad"></i> GAME UP!
        </h1>
      </div>
      <Nav />
    </header>
  );
};
