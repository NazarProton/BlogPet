import { MenuOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import "./navBarItemsStyle.scss";

const NavBarItems = () => {
  const currentUser = useTypedSelector((s) => s.users.currentUser);
  const antColor: { color: string } = { color: "#1890ff" };
  const itemsList = [
    {
      key: "1",
      label: (
        <Link style={antColor} to="main">
          Main
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link style={antColor} to="posts">
          Posts
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link style={antColor} to="users">
          Users
        </Link>
      ),
    },
  ];
  const Navbuttons = currentUser ? itemsList : itemsList.slice(0, 2);

  const menu = <Menu items={Navbuttons} />;

  return (
    <>
      <div className="dropdownBigSize">
        <Link style={{ color: antColor.color }} to="main">
          Main
        </Link>
        <Link style={{ color: antColor.color }} to="posts">
          Posts
        </Link>

        {currentUser && (
          <Link style={{ color: antColor.color }} to="users">
            Users
          </Link>
        )}
      </div>
      <Dropdown overlay={menu} className="dropdownLittleSize">
        <MenuOutlined style={{ fontSize: "20px", color: antColor.color }} />
      </Dropdown>
    </>
  );
};

export default NavBarItems;
