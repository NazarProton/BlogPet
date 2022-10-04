import React, { useEffect, FC } from "react";
import { useNavigate, useParams } from "react-router";
import BackHistoryButton from "../../Buttons/backButton";
import { useDispatch } from "react-redux";
import localStorageService from "../../../services/localStorage.service";
import { Card } from "antd";
import Meta from "antd/lib/card/Meta";
import "./userPage.scss";
import { SettingOutlined } from "@ant-design/icons";
import { IUsersActionsTypes } from "../../../store/redux/types/ReduxTypes";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
const nouser = require("../../../images/no_user.png") as string;

interface IProps {
  clickedUserId: string;
}

const UserPage: FC<IProps> = ({ clickedUserId }) => {
  const CurrentUser = useTypedSelector((s) => s.users.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: IUsersActionsTypes.GET_USER_BY_ID,
      payload: {
        userId: clickedUserId || CurrentUser?._id,
        navigate,
      },
    });
  }, [CurrentUser, clickedUserId, dispatch, navigate]);
  const data = useTypedSelector((s) => s.users);
  const data2 = JSON.parse(localStorageService.getCurrentUser() || "");
  const { userId } = useParams();
  const handleClick = () => {
    navigate(`${data.currentUser?._id}/edit`);
  };
  const userInfo = data2._id === userId ? data2 : data.userById;
  return (
    <div>
      <div className="buttonBlock">
        <BackHistoryButton />
      </div>
      {userInfo && (
        <div>
          <Card
            hoverable
            style={{
              maxWidth: "100%",
              marginTop: "auto",
            }}
            cover={
              <img
                alt="example"
                src={
                  userInfo.avatar
                    ? `http://test-blog-api.ficuslife.com/${userInfo.avatar}`
                    : nouser
                }
              />
            }
          >
            <Meta title={userInfo.name} description={userInfo.email} />
          </Card>
          <Card
            className="infoBlock"
            style={{
              maxWidth: "100%",
              minHeight: "auto",
            }}
            hoverable
          >
            {data.currentUser?._id === userId && (
              <button className="EditButton" onClick={handleClick}>
                <SettingOutlined />
              </button>
            )}
            <Card hoverable style={{ width: "100%" }}>
              <Meta
                title={`details:
              ${userInfo.details ? userInfo.details : "unknown"}`}
              />
            </Card>
            <Card hoverable style={{ width: "100%" }}>
              <Meta
                title={`extra_details:
              ${userInfo.extra_details ? userInfo.extra_details : "unknown"}`}
              />
            </Card>{" "}
            <Card hoverable style={{ width: "100%" }}>
              <Meta
                title={`profession:
              ${userInfo.profession ? userInfo.profession : "unknown"}`}
              />
            </Card>{" "}
            <Card hoverable style={{ width: "100%" }}>
              <Meta
                title={`skills:
              ${userInfo.skills ? userInfo.skills : "unknown"}`}
              />
            </Card>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserPage;
