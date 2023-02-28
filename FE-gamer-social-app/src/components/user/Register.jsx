import React from "react";
import { Global } from "../../helpers/Global";
import { useForm } from "../../hooks/useForm";
import { useState } from "react";

export const Register = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sent");

  const saveUser = async (event) => {
    //prevent screen from refreshig
    event.preventDefault();
    //get data from the form
    let newUser = form;
    //save user information in the backend
    const request = await fetch(Global.url + "user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();

    if (data.status == "success") {
      setSaved("saved");
    } else {
      setSaved("error");
    }
  }; //end of save method

  return (
    <div className="register-container">
      <br />
      <br />
      <header className="content__header2 content__header--public">
        <h1 className="content__title">Register</h1>
      </header>

      <div className="content__posts1">
        {saved == "saved" ? (
          <strong className="alert2 alert-success">
            User registration successful!
          </strong>
        ) : (
          ""
        )}

        {saved == "error" ? (
          <strong className="alert2 alert-danger">
            User registration failed, Please try again!
          </strong>
        ) : (
          ""
        )}

        <form className="register-form" onSubmit={saveUser}>
          <div className="form-group">
            <label htmlFor="name">First Name</label>
            <input type="text" name="name" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="surname">Last Name</label>
            <input type="text" name="surname" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="nick">Nickname</label>
            <input type="text" name="nick" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" name="email" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" onChange={changed} />
          </div>

          <input
            type="submit"
            value="Submit Registration"
            className="btn btn-success"
          />
        </form>
      </div>
    </div>
  );
};
