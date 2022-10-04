import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import localStorageService from "../../../services/localStorage.service";
import { Dropdown, Menu, Switch } from "antd";
import "./navProfileStyle.scss";
import { DownOutlined } from "@ant-design/icons";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { IPostsActionsTypes } from "../../../store/redux/types/ReduxTypes";
const nouser = require("../../../images/no_user.png") as string;

const NavProfile = () => {
  const dispatch = useDispatch();
  const currentUser = useTypedSelector((s) => s.users.currentUser);
  const data2 = JSON.parse(localStorageService.getCurrentUser() || "");
  const theme = localStorageService.getTheme();
  const themeState = useTypedSelector((s) => s.posts.theme);
  const changeTheme = () => {
    localStorageService.setTheme();
    dispatch({
      type: IPostsActionsTypes.CHANGE_THEME,
    });
  };
  if (!currentUser) return <h5>Loading...</h5>;

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <Link style={{ color: "#1890ff" }} to={`/users/${currentUser._id}`}>
              Profile
            </Link>
          ),
        },
        {
          key: "2",
          label: (
            <Link style={{ color: "#1890ff" }} to="logout">
              Logout
            </Link>
          ),
        },
      ]}
    />
  );

  return (
    <Dropdown overlay={menu}>
      <div className="dropdownStyle">
        <Switch
          className="themeSwitcher"
          defaultChecked={
            theme === "light" || themeState === null ? false : true
          }
          onChange={changeTheme}
        />
        <div>{currentUser.name}</div>

        <img
          src={
            currentUser.avatar
              ? `http://test-blog-api.ficuslife.com/${data2.avatar}`
              : nouser
          }
          alt=""
          height="40"
        />
        <DownOutlined style={{ color: "#1890ff" }} />
      </div>
    </Dropdown>
  );
};

export default NavProfile;
