import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useState, FC, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import {
  IComment,
  IPostsActionsTypes,
} from "../../store/redux/types/ReduxTypes";

interface IProps {
  comment: IComment;
}

const LikesForComment: FC<IProps> = ({ comment }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useTypedSelector((s) => s.users.currentUser);
  const [likeCount, setLikeCount] = useState(comment?.likes.length);
  const [likeStatus, setLikeStatus] = useState<SetStateAction<boolean>>(
    currentUser &&
      comment?.likes &&
      comment.likes.find((l) => l === currentUser._id)
      ? true
      : false
  );
  const naviToRegistration = () => {
    navigate("/login");
  };

  const setLike = (commentId: string) => {
    if (currentUser) {
      dispatch({
        type: IPostsActionsTypes.SET_LIKE_FOR_COMMENT,
        payload: {
          commentId,
          currentUserId: currentUser._id,
          navigate,
        },
      });
    }
    if (currentUser) {
      if (!likeStatus) {
        setLikeCount((prevState) => prevState + 1);
      } else {
        setLikeCount((prevState) => prevState - 1);
      }
      setLikeStatus(!likeStatus);
    }
  };
  return (
    <p>
      {likeStatus ? (
        <HeartFilled
          onClick={
            currentUser ? () => setLike(comment._id) : naviToRegistration
          }
        />
      ) : (
        <HeartOutlined
          onClick={
            currentUser ? () => setLike(comment._id) : naviToRegistration
          }
        />
      )}
      {likeCount}
    </p>
  );
};

export default LikesForComment;
