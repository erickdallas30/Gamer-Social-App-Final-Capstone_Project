import React from "react";
import { Global } from "../../helpers/Global";
import { useForm } from "../../hooks/useForm";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

export const Login = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sent");
  const { setAuth } = useAuth();

  const loginUser = async (event) => {
    event.preventDefault();
    // console.log(form)
    //form data
    let userToLogin = form;
    //backend request
    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();
    //verify data is sent correctly
    // console.log(data);

    if (data.status == "success") {
      //set data to localstorage in browser
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSaved("login");

      //set auth data
      setAuth(data.user);

      //redirection
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setSaved("error");
    }
  };

  return (
    <div>
      <br/><br/>
      <header className="content__header    content__header--public">
        <h1 className="content__title">Login</h1>
      </header>

      <div className="content__posts1">
        {saved == "login" ? (
          <strong className="alert alert-success">Login successful!</strong>
        ) : (
          " "
        )}

        {saved == "error" ? (
          <strong className="alert alert-danger">
            Login failed, Please try again!
          </strong>
        ) : (
          " "
        )}

        <form className="form-login" onSubmit={loginUser}>
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
            value="Login"
            className="btn btn-success form-post__btn-submit"
          />
        </form>
      </div>
    </div>
  );
};
