import { CloseCircleOutlined } from "@ant-design/icons";
import { Avatar, Button, Comment, Form, Input } from "antd";
import moment from "moment";
import React, {
  useEffect,
  useState,
  FC,
  Dispatch,
  SetStateAction,
} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { IPostsActionsTypes } from "../../store/redux/types/ReduxTypes";
import { IUser } from "../ComponentsTypes";
const { TextArea } = Input;

interface IPropses {
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
  placeholder: string;
  setFollowedCommentData: Dispatch<SetStateAction<IUserForReply | null>>;
  followedCommentData: IUserForReply | null;
}

const Editor: FC<IPropses> = ({
  onChange,
  onSubmit,
  submitting,
  value,
  placeholder,
  setFollowedCommentData,
  followedCommentData,
}) => (
  <>
    <Form.Item style={{ marginBottom: "0px" }}>
      <TextArea
        placeholder={placeholder}
        rows={4}
        onChange={onChange}
        value={value}
      />
    </Form.Item>
    {placeholder && (
      <Button
        type="link"
        onClick={() => {
          if (placeholder) {
            setFollowedCommentData(null);
          }
        }}
      >
        @{followedCommentData && followedCommentData.name}
        <span style={{ marginLeft: "5px" }}>
          <CloseCircleOutlined />
        </span>
      </Button>
    )}{" "}
    <Form.Item>
      <Button
        block
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </>
);

interface IUserForReply extends IUser {
  commentId: string;
}

interface IProps {
  followedCommentData: IUserForReply | null;
  setFollowedCommentData: Dispatch<SetStateAction<IUserForReply | null>>;
}

const AddCommentForm: FC<IProps> = ({
  followedCommentData,
  setFollowedCommentData,
}) => {
  console.log(followedCommentData);
  const nouser = require("../../images/no_user.png") as string;
  const navigate = useNavigate();
  let postById = useTypedSelector((s) => s.posts.postById);
  const dispatch = useDispatch();
  const currentUser = useTypedSelector((s) => s.users.currentUser);
  const [submitting, setSubmitting] = useState(false);
  const [applyToData, setApplyToData] = useState(
    followedCommentData ? followedCommentData : null
  );
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  useEffect(() => {
    if (followedCommentData) {
      setPlaceholder(
        `ответ на коментарий пользователя @${followedCommentData.name}:`
      );
      setApplyToData(followedCommentData);
    } else {
      setApplyToData(null);
      setPlaceholder("");
    }
  }, [followedCommentData]);

  const handleSubmit = () => {
    if (!value) return;
    const newComment = {
      commentedBy: currentUser ? currentUser._id : 1,
      dateCreated: moment().fromNow(),
      followedCommentID: applyToData ? applyToData.commentId : null,
      postID: postById?._id,
      text: value,
    };
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setValue("");
      setPlaceholder("");
      setApplyToData(null);
      dispatch({
        type: IPostsActionsTypes.CREATE_COMMENT_TO_POST,
        payload: { newComment, postById, navigate },
      });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div style={{ marginTop: "10px" }} className="container">
      <Comment
        avatar={
          <Avatar
            src={
              currentUser && currentUser.avatar
                ? `http://test-blog-api.ficuslife.com/${currentUser.avatar}`
                : nouser
            }
            alt="userPhoto"
          />
        }
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
            placeholder={placeholder}
            followedCommentData={followedCommentData}
            setFollowedCommentData={setFollowedCommentData}
          />
        }
      />
    </div>
  );
};

export default AddCommentForm;
