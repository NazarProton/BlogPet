import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import NavBarItems from "./navComponents/navBarItems";
import NavProfile from "./navComponents/navProfile";
import "./navBarStyle.scss";
import { Switch } from "antd";
import localStorageService from "../../services/localStorage.service";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { IPostsActionsTypes } from "../../store/redux/types/ReduxTypes";

const Navbar = () => {
  const currentUser = useTypedSelector((s) => s.users.currentUser);
  const theme = localStorageService.getTheme();
  const dispatch = useDispatch();
  const changeTheme = () => {
    localStorageService.setTheme();
    dispatch({
      type: IPostsActionsTypes.CHANGE_THEME,
    });
  };
  return (
    <nav className="navSize">
      <div className="navElems">
        <NavBarItems />
        <div className="currentUserBlock">
          {currentUser ? (
            <NavProfile />
          ) : (
            <>
              <Switch
                style={{ marginRight: "10px" }}
                className="themeSwitcher"
                defaultChecked={theme === "light" || !theme ? false : true}
                onChange={changeTheme}
              />
              <Link
                type="link"
                style={{ color: "#1890ff", fontWeight: "500" }}
                to="login"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
