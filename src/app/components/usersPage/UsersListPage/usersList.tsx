import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { List, Avatar, Typography } from "antd";
import "./usersList.scss";
import { IUsersActionsTypes } from "../../../store/redux/types/ReduxTypes";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
const nouser = require("../../../images/no_user.png") as string;

const UsersList = () => {
  const currentUser = useTypedSelector((s) => s.users.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useTypedSelector((s) => s.users.entities);
  const { Text } = Typography;
  const [currentPage, setCurrentPage] = useState(
    users?.length ? users.length : 0
  );
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (currentPage === 0 && currentUser) {
      dispatch({
        type: IUsersActionsTypes.LOAD_USERS,
        payload: { currentPage },
      });
      setCurrentPage(10);
    }
  }, [currentPage, currentUser, dispatch]);

  useEffect(() => {
    if (fetching) {
      setCurrentPage((prevState) => prevState + 10);
      dispatch({
        type: IUsersActionsTypes.LOAD_USERS,
        payload: { currentPage },
      });
    }
    setFetching(false);
  }, [currentPage, dispatch, fetching]);

  const scrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
    if (
      Math.floor(
        event.currentTarget.scrollHeight -
          (event.currentTarget.scrollTop + window.innerHeight)
      ) < 1
    ) {
      setFetching(true);
    }
  };
  const formater = (data: string) => {
    return data && data.length > 10
      ? ` ${data.slice(0, 10)}...`
      : data
      ? ` ${data}`
      : " unknown";
  };

  return (
    <div className="container row" onScroll={scrollHandler}>
      <List
        dataSource={users?.length ? users : []}
        renderItem={(item) => (
          <List.Item key={item._id} onClick={() => navigate(item._id)}>
            <List.Item.Meta
              avatar={
                <Avatar
                  size={64}
                  src={
                    item.avatar
                      ? `http://test-blog-api.ficuslife.com/${item.avatar}`
                      : nouser
                  }
                />
              }
              title={item.name}
              description={formater(item.email)}
            />
            <div className="InfoAboutUserBlock">
              <Text className="item1">
                {`Профессия:${formater(item.profession)}`}
              </Text>
              <Text className="item2">{`Skills:${formater(item.skills)}`}</Text>
              <Text className="item3">{`details:${formater(
                item.details
              )}`}</Text>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default UsersList;
