import React from "react";
import { Routes, Route, BrowserRouter, Navigate, Link } from "react-router-dom";
import { PrivateLayout } from "../components/layout/private/PrivateLayout";
import { PublicLayout } from "../components/layout/public/PublicLayout";
import { Feed } from "../components/publication/Feed";
import { Login } from "../components/user/Login";
import { Logout } from "../components/user/Logout";
import { Register } from "../components/user/Register";
import { Members } from "../components/user/Members";
import { AuthProvider } from "../context/AuthProvider";
import { Settings } from "../components/user/Settings";
import { Following } from "../components/follow/Following";
import { Followers } from "../components/follow/Followers";
import { Profile } from "../components/user/Profile";

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="/social" element={<PrivateLayout />}>
            <Route index element={<Feed />} />
            <Route path="feed" element={<Feed />} />
            <Route path="logout" element={<Logout />} />
            <Route path="members" element={<Members />} />
            <Route path="settings" element={<Settings />} />
            <Route path="following/:userId" element={<Following />} />
            <Route path="followers/:userId" element={<Followers />} />
            <Route path="profile/:userId" element={<Profile />} />
          </Route>

          <Route
            path="*"
            element={
              <>
                <p>
                  <h1>Error 404</h1>
                  <Link to="/">Click here to main page</Link>
                </p>
              </>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
