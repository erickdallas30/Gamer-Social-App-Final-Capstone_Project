import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/GetProfile";
import { Global } from "../../helpers/Global";
import { UserList } from "../user/UserList";

export const Followers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({})

  const params = useParams();

  useEffect(() => {
    getMembers(1);
    GetProfile(params.userId, setUserProfile )
  }, []);

  const getMembers = async (nextPage = 1) => {
    //loading effect
    setLoading(true);
    //get user ID from the URL
    const userId = params.userId;

    // request to get all members from the DB
    const request = await fetch(Global.url + "follow/followers/" + userId + "/" + nextPage,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const data = await request.json();

    //clear follows to get followed
    let cleanFollows = [];
    data.follows.forEach((follow) => {
      cleanFollows = [...cleanFollows, follow.user];
    });
    data.users = cleanFollows;

    //create state to get list
    if (data.users && data.status == "success") {
      let newUsers = data.users;

      if (users.length >= 1) {
        newUsers = [...users, ...data.users];
      }

      setUsers(newUsers);
      setFollowing(data.user_following);
      setLoading(false);

      //console.log(users);
      //pagination
      if (users.length >= data.total - data.users.length) {
        setMore(false);
      }
    }
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Followers of {userProfile.name} {userProfile.surname}</h1>
      </header>

      <UserList
        users={users}
        getMembers={getMembers}
        following={following}
        setFollowing={setFollowing}
        page={page}
        setPage={setPage}
        more={more}
        loading={loading}
      />

      <br />
    </>
  );
};
