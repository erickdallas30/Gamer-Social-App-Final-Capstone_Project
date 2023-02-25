import React from "react";
import { NavLink } from "react-router-dom";
import avatar from "../../../assets/img/user.png";

export const Nav = () => {
  return (
    <nav className="navbar__container-lists">
      <ul className="container-lists__menu-list">
        <li className="menu-list__item">
          <NavLink to="/login" className="menu-list__link">
            <i className="fa-solid fa-user"></i>
            <span className="menu-list__title">Login</span>
          </NavLink>
        </li>

        <li className="menu-list__item">
          <NavLink to="/register" className="menu-list__link">
            <i className="fa-solid fa-users"></i>
            <span className="menu-list__title">Sign Up</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
