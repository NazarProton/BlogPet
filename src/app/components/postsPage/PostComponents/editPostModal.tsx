import { Button, Modal, Upload, message, Popover, Form, Input } from "antd";
import React, { useEffect, useState, FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteButton from "../../Buttons/deleteButton";
import { UploadOutlined } from "@ant-design/icons";
import { IPostsActionsTypes } from "../../../store/redux/types/ReduxTypes";
import { IPost } from "../../ComponentsTypes";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
const noPostAvatar = require("../../../images/no-post-avatar.png") as string;

interface IProps {
  post: IPost;
}

const EditPostModal: FC<IProps> = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useTypedSelector((s) => s.users.currentUser);
  const postById = useTypedSelector((s) => s.posts.postById);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const loginError = useTypedSelector((s) => s.users.error);
  const [postData, setPostData] = useState(post);
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "-1",
      name: "user_avatar.png",
      status: "done",
      url: post.image
        ? `http://test-blog-api.ficuslife.com/${post.image}`
        : noPostAvatar,
      thumbUrl: post.image
        ? `http://test-blog-api.ficuslife.com/${post.image}`
        : noPostAvatar,
    },
  ]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };
  useEffect(() => {
    if (postById) {
      setPostData(postById);
    }
  }, [postById]);

  const showModal = () => {
    getPostById(post._id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    handleCancel();
    dispatch({
      type: IPostsActionsTypes.POST_DATA_CHANGE,
      payload: {
        avatar: fileList[0]?.originFileObj || null,
        data: {
          title: postData.title,
          fullText: postData.fullText,
          description: postData.description,
        },
        postId: post._id,
        navigate,
      },
    });
    setPostData({
      _id: "",
      title: "",
      description: "",
      fullText: "",
      likes: [],
    });
  };

  const props: UploadProps = {
    beforeUpload: (file: UploadFile) => {
      const isPNG = file.type === "image/png";
      const isImg = file.type === "image/img";
      const isJpeg = file.type === "image/jpeg";
      const isJpg = file.type === "image/jpg";
      const isGif = file.type === "image/gif";

      if (!isPNG && !isImg && !isJpeg && !isJpg && !isGif) {
        message.error(`${file.name} is not a png/img/jpeg/jpg/gif file`);
      }

      return false;
    },
    onChange: (info) => {
      setFileList(info.fileList);
    },
  };
  const getPostById = (postId: string) => {
    dispatch({
      type: IPostsActionsTypes.LOAD_POSTS_BY_ID,
      payload: {
        postId,
      },
    });
  };
  return (
    <>
      {post.postedBy === currentUser?._id && (
        <Button
          style={{ marginLeft: "10px" }}
          type="primary"
          onClick={() => showModal()}
        >
          Edit
        </Button>
      )}
      {postById && postById._id === post._id && (
        <Modal
          title="Edit Post"
          visible={isModalVisible}
          onCancel={handleCancel}
        >
          <div style={{ marginTop: "20px" }} className="container">
            <div className="container">
              <Form
                name="basic"
                className="formContainer"
                onFinish={handleSubmit}
                initialValues={{
                  title: postById.title ? postById.title : "",
                  description: postById.description ? postById.description : "",
                  fullText: postById.fullText ? postById.fullText : "",
                }}
              >
                <Form.Item className="FormLine">
                  <Upload
                    {...props}
                    listType="picture"
                    defaultFileList={[...fileList]}
                    className="upload-list-inline"
                    maxCount={1}
                  >
                    <Popover content="Upload png, img, jpeg, jpg, gif only">
                      <Button
                        className="AvatarUploadButton"
                        icon={<UploadOutlined />}
                      >
                        Post Image
                      </Button>
                    </Popover>
                  </Upload>
                </Form.Item>
                <Form.Item
                  className="FormLine"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Please input post title!",
                    },
                    {
                      min: 5,
                      message: `"Title" length must be at least 5 characters long`,
                    },
                  ]}
                >
                  <Input
                    addonBefore="title"
                    name="title"
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item
                  className="FormLine"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input post description!",
                    },
                  ]}
                >
                  <Input
                    addonBefore="description"
                    name="description"
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item
                  className="FormLine"
                  name="fullText"
                  rules={[
                    {
                      required: true,
                      message: "Please input post full text!",
                    },
                    {
                      min: 20,
                      message: `"Full Text" length must be at least 20 characters long`,
                    },
                  ]}
                >
                  <Input
                    addonBefore="Full Text"
                    name="fullText"
                    onChange={handleChange}
                  />
                </Form.Item>
                {loginError && <p className="text-danger">{loginError}</p>}
                <Form.Item className="FormLine">
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        marginBottom: "20px",
                        background: "inherit",
                        borderColor: "green",
                        color: "green",
                        marginRight: "5px",
                      }}
                      onSubmit={handleSubmit}
                    >
                      Изменить
                    </Button>
                    <DeleteButton post={post} />
                  </div>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default EditPostModal;
