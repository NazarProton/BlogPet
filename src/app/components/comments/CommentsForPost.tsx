import React, { useEffect, FC } from "react";
import { Tooltip, Comment, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import LikesForComment from "./likeForComment";
import moment from "moment";
import { useState } from "react";
import AnswersForComment from "./answersForComment";
import "./CommentsForPost.scss";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  IComment,
  IPostsActionsTypes,
  IUsersActionsTypes,
} from "../../store/redux/types/ReduxTypes";
import { IUser } from "../ComponentsTypes";
import { useTypedSelector } from "../../hooks/useTypedSelector";
const nouser = require("../../images/no_user.png") as string;

interface IProps {
  comment: IComment;
  getChoosedCommentToReplyId: (commentId: string, comentator: IUser) => void;
}

const CommentsForPost: FC<IProps> = ({
  comment,
  getChoosedCommentToReplyId,
}) => {
  const dispatch = useDispatch();
  const [showAnswers, setShowAnswers] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const currentUser = useTypedSelector((s) => s.users.currentUser);
  const usersById = useTypedSelector((s) => s.users.usersById);
  const [data, setData] = useState(comment);
  const [status, setStatus] = useState(true);
  const isLoading = useTypedSelector((s) => s.posts.IsLoading);
  const [comentator, setComentator] = useState<IUser>({
    name: "",
    _id: "",
    dateCreated: "",
    details: "",
    email: "",
    extra_details: "",
    profession: "",
    skills: "",
    __v: 0,
    commentId: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevState) => ({
      ...prevState,
      text: event.target.value,
    }));
  };

  const a = usersById?.filter((u) => u._id === comment.commentedBy);

  useEffect(() => {
    if (status && comment?.commentedBy && !a?.length) {
      dispatch({
        type: IUsersActionsTypes.GET_USER_BY_ID_FOR_COMMENTS,
        payload: { userId: comment.commentedBy, usersById },
      });
      setStatus(false);
    }
  }, [a, comment.commentedBy, dispatch, isLoading, status, usersById]);
  useEffect(() => {
    if (comment.commentedBy) {
      setComentator(
        usersById.find((c) => c._id === comment.commentedBy) || comentator
      );
    }
  }, [comentator, comment.commentedBy, usersById]);

  const openEditor = function () {
    setOnEdit((prevState) => !prevState);
  };
  const onSubmit = function (commentId: string) {
    setOnEdit((prevState) => !prevState);
    dispatch({
      type: IPostsActionsTypes.EDIT_COMMENT_BY_ID,
      payload: {
        data,
        commentId,
      },
    });
  };
  const deleteComment = function (comment: IComment) {
    setOnEdit((prevState) => !prevState);
    dispatch({
      type: IPostsActionsTypes.DELETE_COMMENT_BY_ID,
      payload: comment,
    });
  };

  return (
    <Comment
      author={comentator ? comentator.name : "text"}
      className="container comentsBlockStyle"
      avatar={
        <img
          src={
            comentator && comentator.avatar
              ? `http://test-blog-api.ficuslife.com/${comentator.avatar}`
              : nouser
          }
          alt=""
          height="40"
          width="40"
        />
      }
      content={
        <div className="contentContainer">
          <div className="answerContainer">
            {onEdit ? (
              <form>
                <div style={{ display: "flex" }}>
                  <div>
                    <Input
                      id="text"
                      name="text"
                      type="text"
                      onChange={handleChange}
                      value={data.text ? data.text : ""}
                    />
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        onSubmit(comment._id);
                      }}
                      htmlType="submit"
                      type="primary"
                    >
                      edit
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <h5>{comment?.text}</h5>
            )}

            {!onEdit && (
              <button
                className="ViewAnswers"
                onClick={() => {
                  getChoosedCommentToReplyId(comment._id, comentator);
                }}
              >
                <small>reply to</small>
              </button>
            )}
          </div>
          <div className="EditLikeBlock">
            {comment?.commentedBy && comment.commentedBy === currentUser?._id && (
              <>
                {onEdit && (
                  <DeleteOutlined
                    style={{ marginRight: "5px" }}
                    onClick={() => deleteComment(comment)}
                  />
                )}
                <EditOutlined
                  style={{ marginRight: "5px" }}
                  onClick={openEditor}
                />
              </>
            )}
            <LikesForComment comment={comment} />
          </div>
        </div>
      }
      datetime={
        <Tooltip
          title={moment(comment?.dateCreated).format("YYYY-MM-DD HH:mm:ss")}
        >
          <span className="dataStyle">
            {moment(comment?.dateCreated).fromNow()}
          </span>
        </Tooltip>
      }
    >
      {comment.answers?.length && (
        <AnswersForComment
          comment={comment}
          getChoosedCommentToReplyId={getChoosedCommentToReplyId}
          showAnswers={showAnswers}
          setShowAnswers={setShowAnswers}
        />
      )}
    </Comment>
  );
};

export default CommentsForPost;
