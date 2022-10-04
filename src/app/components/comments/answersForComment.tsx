import React, {
  useCallback,
  useEffect,
  useState,
  FC,
  Dispatch,
  SetStateAction,
} from "react";
import { Collapse } from "antd";
import { useDispatch } from "react-redux";
import CommentsForPost from "./CommentsForPost";
import "./answersForComment.scss";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import {
  IComment,
  IUsersActionsTypes,
} from "../../store/redux/types/ReduxTypes";
import { IUser } from "../ComponentsTypes";

interface IProps {
  comment: IComment;
  getChoosedCommentToReplyId: (commentId: string, comentator: IUser) => void;
  showAnswers: boolean;
  setShowAnswers: Dispatch<SetStateAction<boolean>>;
}

const AnswersForComment: FC<IProps> = ({
  comment,
  getChoosedCommentToReplyId,
  showAnswers,
  setShowAnswers,
}) => {
  const dispatch = useDispatch();
  const { Panel } = Collapse;
  const isLoading = useTypedSelector((s) => s.posts.IsLoading);

  const usersById = useTypedSelector((s) => s.users.usersById);
  const [newAnswers, setNewAnswers] = useState<IComment[]>();

  const getAnswers = useCallback(() => {
    if (comment.answers) {
      const answersData = comment.answers.map((a) => {
        let comentator = usersById?.find((c: IUser) => c._id === a.commentedBy);
        if (comentator) {
          a.comentatorName = comentator.name;
          a.avatar = comentator.avatar;
          return a;
        } else {
          if (!isLoading) {
            dispatch({
              type: IUsersActionsTypes.GET_USER_BY_ID_FOR_COMMENTS,
              payload: { userId: a.commentedBy, usersById },
            });

            const b = usersById?.find((c: IUser) => c._id === a.commentedBy);
            if (b) {
              a.comentatorName = b.name;
              a.avatar = b.avatar;
            }
          }
          return a;
        }
      });
      setNewAnswers(answersData);
    }
  }, [comment.answers, dispatch, isLoading, usersById]);
  useEffect(() => {
    if (newAnswers && comment.answers) {
      if (comment.answers.length !== newAnswers.length) getAnswers();
    }
  }, [comment.answers, getAnswers, newAnswers]);

  return (
    <div>
      <Collapse
        onChange={() => {
          setShowAnswers(!showAnswers);
          getAnswers();
        }}
        ghost
      >
        <Panel
          key="1"
          style={{ padding: "0px" }}
          header={showAnswers ? "hide answers" : "show answers"}
        >
          {comment && !comment.answers?.length && (
            <p className={showAnswers ? `` : "dNone"}>ответов нет</p>
          )}

          {newAnswers?.map((a) => {
            if (!a.comentatorName) {
              let comentator = usersById?.find(
                (c: IUser) => c._id === a.commentedBy
              );
              if (comentator) {
                a.comentatorName = comentator.name;
                a.avatar = comentator.avatar;
              }
            }
            if (a.followedCommentID === comment._id) {
            }

            return (
              <CommentsForPost
                key={a._id + a.text}
                comment={a}
                getChoosedCommentToReplyId={getChoosedCommentToReplyId}
              />
            );
          })}
        </Panel>
      </Collapse>
    </div>
  );
};

export default AnswersForComment;
