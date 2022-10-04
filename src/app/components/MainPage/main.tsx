import React from "react";
import { Link } from "react-router-dom";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import localStorageService from "../../services/localStorage.service";
import "./mainPage.scss";

const Main = () => {
  const currentUser = useTypedSelector((s) => s.users.currentUser);
  const CurrentUserLocalStorrage = localStorageService.getCurrentUser();

  return (
    <div className="container">
      <div className="textBlock">
        <h1>Ficus Main Page</h1>
        <h3>
          Добро пожаловать{" "}
          {currentUser && CurrentUserLocalStorrage ? currentUser.name : ""}!
        </h3>
        <h3>У нас есть что почитать!</h3>
      </div>
      <div className="linkBlock">
        <h3>
          <Link style={{ color: "rgb(65, 115, 253)" }} type="link" to="posts">
            к постам!
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default Main;
