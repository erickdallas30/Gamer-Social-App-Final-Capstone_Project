import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import ReactTimeAgo from "react-time-ago";

export const UserList = ({
  users,
  getMembers,
  following,
  setFollowing,
  page,
  setPage,
  more,
  loading,
}) => {
  const { auth } = useAuth();

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getMembers(next);
    // console.log(page, users);
  };

  const follow = async (userId) => {
    //request to backend to save the follow
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    //verfy is all correct
    if (data.status == "success") {
      //update following state, adding the new follow
      setFollowing([...following, userId]);
    }
  };

  const unfollow = async (userId) => {
    //request to backend to delete the follow
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    //verfy is all correct
    if (data.status == "success") {
      //update following state, filtering the following data to delete and get back
      //to the original follow state
      let filterFollowing = following.filter(
        (followingUserId) => userId !== followingUserId
      );
      setFollowing(filterFollowing);
    }
  };

  return (
    <>
      <div className="content__posts">
        {users.map((user) => {
          return (
            <article className="posts__post" key={user._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <Link
                    to={"/social/profile/" + user._id}
                    className="post__image-link"
                  >
                    {user.image != "default.png" && (
                      <img
                        src={Global.url + "user/avatar/" + user.image}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                    {user.image == "default.png" && (
                      <img
                        src={avatar}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                  </Link>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                    <Link
                      to={"/social/profile/" + user._id}
                      className="user-info__name"
                    >
                      {user.name} {user.surname}
                    </Link>
                    <span className="user-info__divider"> | </span>
                    <Link
                      to={"/social/profile/" + user._id}
                      className="user-info__create-date"
                    >
                      <ReactTimeAgo date={Date.parse(user.created_at)} />
                    </Link>
                  </div>

                  <h4 className="post__content">{user.bio}</h4>
                </div>
              </div>

              {user._id != auth._id && (
                <div className="post__buttons">
                  {!following.includes(user._id) && (
                    <button
                      className="post__button post__button--green"
                      onClick={() => follow(user._id)}
                    >
                      Follow
                    </button>
                  )}

                  {following.includes(user._id) && (
                    <button
                      className="post__button"
                      onClick={() => unfollow(user._id)}
                    >
                      Unfollow
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {loading ? <h1>Loading...</h1> : ""}

      {more && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Show More Members
          </button>
        </div>
      )}
    </>
  );
};
