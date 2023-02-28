import React, { useState } from "react";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import avatar from "../../assets/img/user.png";
import { SerializeForm } from "../../helpers/SerializeForm";

export const Settings = () => {
  const { auth, setAuth } = useAuth();

  const [saved, setSaved] = useState("not_saved");

  const updateUser = async (event) => {
    event.preventDefault();

    //auth token
    const token = localStorage.getItem("token");

    //get form data
    let newDataUser = SerializeForm(event.target);
    //delete prop useless
    delete newDataUser.file0;
    //update user in DB
    const request = await fetch(Global.url + "user/update", {
      method: "PUT",
      body: JSON.stringify(newDataUser),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await request.json();

    if (data.status == "success" && data.user) {
      delete data.user.password;
      setAuth(data.user);

      setSaved("saved");
    } else {
      setSaved("error");
    }

    //image uploading
    const fileInput = document.querySelector("#file");

    if ((data.status = "success" && fileInput.files[0])) {
      //get image to upload
      const formData = new FormData();
      formData.append("file0", fileInput.files[0]);
      //request to send image to backend
      const uploadRequest = await fetch(Global.url + "user/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token,
        },
      });
      const uploadData = await uploadRequest.json();

      if (uploadData.status == "success" && uploadData.user) {
        delete uploadData.user.password;
        setAuth(uploadData.user);
        setSaved("saved");
      } else {
        setSaved("error");
      }
    }
  };

  return (
    <div className="settings-container">
      <br />
      <header className="content__header content__header--public">
        <h1 className="content__title">Settings</h1>
      </header>
      <div className="content__posts1">
        {saved == "saved" ? (
          <strong className="alert3 alert-success">Profile Information updated!!</strong>
        ) : (
          ""
        )}

        {saved == "error" ? (
          <strong className="alert2 alert-danger">
            Settings update failed, Please try again!
          </strong>
        ) : (
          ""
        )}

        <form className="settings-form" onSubmit={updateUser}>
          <div className="form-group">
            <label htmlFor="name">First Name</label>
            <input type="text" name="name" defaultValue={auth.name} />
          </div>

          <div className="form-group">
            <label htmlFor="surname">Last Name</label>
            <input type="text" name="surname" defaultValue={auth.surname} />
          </div>

          <div className="form-group">
            <label htmlFor="nick">Nickname</label>
            <input type="text" name="nick" defaultValue={auth.nick} />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea name="bio" defaultValue={auth.bio} />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" name="email" defaultValue={auth.email} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" />
          </div>

          <div className="form-group">
            <label htmlFor="file0">Avatar</label>
            <div className="general-info__container-avatar">
              {auth.image != "default.png" && (
                <img
                  src={Global.url + "user/avatar/" + auth.image}
                  className="container-avatar__img"
                  alt="Profile Picture"
                />
              )}
              {auth.image == "default.png" && (
                <img
                  src={avatar}
                  className="container-avatar__img"
                  alt="Profile Picture"
                />
              )}
            </div>
            <br />
            <input type="file" name="file0" id="file" />
          </div>
          <br />
          <input
            type="submit"
            value="Submit Update"
            className="btn btn-success form-post__btn-submit"
          />
        </form>
        <br />
      </div>
    </div>
  );
};
