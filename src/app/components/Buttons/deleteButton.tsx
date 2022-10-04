import { DeleteOutlined } from "@ant-design/icons";
import { Modal, Button } from "antd";
import React, { useState, FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import {
  IPostsActionsTypes,
  IUsersActionsTypes,
} from "../../store/redux/types/ReduxTypes";
import { IPost } from "../ComponentsTypes";
import "./deleteButton.scss";

interface IProps {
  post?: IPost;
}

const DeleteUser: FC<IProps> = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useTypedSelector((s) => s.users.currentUser);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    userDelete();
    setIsModalVisible(false);
  };

  const onChangeModalVisibility = () => {
    setIsModalVisible((prevState) => !prevState);
  };
  const userDelete = () => {
    if (post) {
      dispatch({
        type: IPostsActionsTypes.DELETE_POST,
        payload: { postId: post._id, navigate },
      });
    } else if (currentUser) {
      dispatch({
        type: IUsersActionsTypes.DELETE_USER,
        payload: { userId: currentUser._id, navigate },
      });
    }
  };

  return (
    <>
      <Button danger onClick={onChangeModalVisibility}>
        {post ? "Удалить пост" : "Удалить пользователя"} <DeleteOutlined />
      </Button>
      <Modal
        title="Удаление Пользователя"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={onChangeModalVisibility}
      >
        <div className="container">
          <h3 className="deleteAtention">
            ви уверенни?(ето действие удалит данние без возможности
            востановления)
          </h3>
          <div className="buttonsBlock">
            <Button
              style={{ color: "green", borderColor: "green" }}
              htmlType="button"
              onClick={onChangeModalVisibility}
            >
              Отменить
            </Button>
            <Button danger className="deleteButton" onClick={handleOk}>
              Удалить
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteUser;
