import React, { useState, FC } from "react";
import { Button, Modal, Upload, message, Popover, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { IPostsActionsTypes } from "../../../store/redux/types/ReduxTypes";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { IPost } from "../../ComponentsTypes";

const PostAddModal: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useTypedSelector((s) => s.users.currentUser);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [postData, setPostData] = useState<IPost>({
    _id: "",
    likes: [],
    title: "",
    description: "",
    fullText: "",
  });

  const showModal = () => {
    setIsModalVisible((prevStet) => !prevStet);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const onFinish = () => {
    dispatch({
      type: IPostsActionsTypes.NEW_POST_CREATE,
      payload: {
        avatar: fileList[0]?.originFileObj || null,
        data: {
          title: postData.title,
          description: postData.description,
          fullText: postData.fullText,
        },
        navigate,
      },
    });
    setIsModalVisible(false);
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

  return (
    <>
      {currentUser && (
        <Button type="primary" className="mt-1" onClick={showModal}>
          Create post
        </Button>
      )}

      <Modal
        title="Create Post"
        visible={isModalVisible}
        onOk={showModal}
        onCancel={showModal}
      >
        <div style={{ marginTop: "10px", width: "100%" }} className="container">
          <Form name="basic" onFinish={onFinish} autoComplete="off">
            {" "}
            <Form.Item className="FormLine">
              <Upload
                name="image"
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
              <Input name="title" addonBefore="Title" onChange={handleChange} />
            </Form.Item>
            <Form.Item
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input post description!",
                },
              ]}
            >
              <Input
                name="description"
                addonBefore="Description"
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
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
                name="fullText"
                addonBefore="Full Text"
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 15,
              }}
            >
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                }}
              >
                <Button htmlType="button" onClick={showModal}>
                  Cancel
                </Button>
                <Button
                  style={{ marginLeft: "10px" }}
                  type="primary"
                  htmlType="submit"
                >
                  Create
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default PostAddModal;
