import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import React, { useState, FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { IPostsActionsTypes } from "../../../store/redux/types/ReduxTypes";
import { IPost } from "../../ComponentsTypes";

interface IProps {
  post: IPost;
}

const LikesForPost: FC<IProps> = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useTypedSelector((s) => s.users.currentUser);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [likeStatus, setLikeStatus] = useState(
    currentUser && post.likes && post.likes.find((l) => l === currentUser._id)
      ? true
      : false
  );
  const naviToRegistration = () => {
    navigate("/login");
  };

  const setLike = (postId: string) => {
    if (currentUser) {
      dispatch({
        type: IPostsActionsTypes.SET_LIKE,
        payload: {
          postId,
          navigate,
          currentUserID: currentUser._id,
        },
      });
    }
    if (currentUser) {
      if (!likeStatus) {
        setLikeCount((prevState) => prevState + 1);
      } else {
        setLikeCount((prevState) => prevState - 1);
      }
      setLikeStatus((prevState) => !prevState);
    }
  };
  return (
    <p>
      {likeStatus ? (
        <HeartFilled
          onClick={currentUser ? () => setLike(post._id) : naviToRegistration}
        />
      ) : (
        <HeartOutlined
          onClick={currentUser ? () => setLike(post._id) : naviToRegistration}
        />
      )}
      {likeCount}
    </p>
  );
};

export default LikesForPost;
