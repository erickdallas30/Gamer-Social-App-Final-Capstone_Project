import React from "react";
import { NavLink } from "react-router-dom";
import avatar from "../../../assets/img/user.png";
import { Global } from "../../../helpers/Global";
import useAuth from "../../../hooks/useAuth";

export const Nav = () => {
  const { auth } = useAuth();

  return (
    <nav className="navbar__container-lists">
      <ul className="container-lists__menu-list">
        <li className="menu-list__item">
          <NavLink to="/social" className="menu-list__link">
            <i className="fa-solid fa-house"></i>
            <span className="menu-list__title">Home</span>
          </NavLink>
        </li>

        <li className="menu-list__item">
          <NavLink to="/social/feed" className="menu-list__link">
            <i className="fa-solid fa-list"></i>
            <span className="menu-list__title">Publications</span>
          </NavLink>
        </li>

        <li className="menu-list__item">
          <NavLink to="/social/members" className="menu-list__link">
            <i className="fa-solid fa-gamepad"></i>
            <span className="menu-list__title">Gamers</span>
          </NavLink>
        </li>
      </ul>

      <ul className="container-lists__list-end">
        <li className="list-end__item">
          <NavLink to={'/social/profile/' + auth._id} className="list-end__link-image">
            {auth.image != "default.png" && (
              <img
                src={Global.url + "user/avatar/" + auth.image}
                className="list-end__img"
                alt="Foto de perfil"
              />
            )}
            {auth.image == "default.png" && (
              <img
                src={avatar}
                className="list-end__img"
                alt="Foto de perfil"
              />
            )}
          </NavLink>
        </li>
        <li className="list-end__item">
          <NavLink to={'/social/profile/' + auth._id} className="list-end__link">
            <span className="list-end__name">{auth.nick}</span>
          </NavLink>
        </li>

        <li className="list-end__item">
          <NavLink to="/social/settings" className="list-end__link">
            <i className="fa-solid fa-gear"></i>
            <span className="list-end__name">Settings</span>
          </NavLink>
        </li>

        <li className="list-end__item">
          <NavLink to="/social/logout" className="list-end__link">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span className="list-end__name">Log Out</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
