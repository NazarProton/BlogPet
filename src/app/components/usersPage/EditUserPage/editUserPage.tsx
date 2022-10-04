import React, { useEffect, useState, FC } from "react";
// import { validator } from "../../../utils/validator";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BackHistoryButton from "../../Buttons/backButton";
import DeleteButton from "../../Buttons/deleteButton";
import localStorageService from "../../../services/localStorage.service";
import { Button, message, Upload, Card, Form, Input, Popover } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./editUserPageStyle.scss";
import { IUsersActionsTypes } from "../../../store/redux/types/ReduxTypes";
import { IUser } from "../../ComponentsTypes";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

const nouser = require("../../../images/no_user.png") as string;

const EditUserPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();
  const data2 = JSON.parse(localStorageService.getCurrentUser() || "");
  const [data, setData] = useState<IUser>(data2);
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "-1",
      name: "user_avatar.png",
      status: "done",
      url: data2.avatar
        ? `http://test-blog-api.ficuslife.com/${data2.avatar}`
        : nouser,
      thumbUrl: data2.avatar
        ? `http://test-blog-api.ficuslife.com/${data2.avatar}`
        : nouser,
    },
  ]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };
  useEffect(() => {
    const token = localStorageService.getAccessToken();
    if (!token) navigate("/login");
  }, [navigate]);

  const handleSubmit = () => {
    dispatch({
      type: IUsersActionsTypes.CURRENT_USER_DATA_CHANGE,
      payload: {
        avatar: fileList[0].originFileObj,
        data: {
          name: data.name,
          extra_details: data.extra_details,
          details: data.details,
          profession: data.profession,
          skills: data.skills,
        },
        navigate,
      },
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

  return (
    <div className="container">
      <div className="buttonBlock">
        <BackHistoryButton />
        {data._id === userId && <DeleteButton />}
      </div>
      <Card className="editBlock">
        <Form
          name="basic"
          className="formContainer"
          onFinish={handleSubmit}
          initialValues={{
            name: data.name || "",
            extra_details: data.extra_details || "",
            skills: data.skills || "",
            profession: data.profession || "",
            details: data.details || "",
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
                  User Avatar
                </Button>
              </Popover>
            </Upload>
          </Form.Item>
          <Form.Item
            className="FormLine"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
              {
                min: 3,
                message: `"Name" length must be at least 3 characters long`,
              },
            ]}
          >
            <Input
              addonBefore="Имя пользователя"
              name="name"
              value={data.name ? data.name : ""}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            className="FormLine"
            name="extra_details"
            rules={[
              {
                required: true,
                message: `Please input "Extra details" about you!`,
              },
              {
                min: 5,
                message: `"Extra details" length must be at least 5 characters long`,
              },
            ]}
          >
            <Input
              addonBefore="Extra details"
              name="extra_details"
              value={data.extra_details ? data.extra_details : ""}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            className="FormLine"
            name="skills"
            rules={[
              {
                required: true,
                message: "Please input about your Skills!",
              },
              {
                min: 5,
                message: `"Skills" length must be at least 5 characters long`,
              },
            ]}
          >
            <Input
              addonBefore="Skills"
              name="skills"
              value={data.skills ? data.skills : ""}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            className="FormLine"
            name="profession"
            rules={[
              {
                required: true,
                message: "Please input about your Profession!",
              },
              {
                min: 3,
                message: `"Profession" length must be at least 3 characters long`,
              },
            ]}
          >
            <Input
              addonBefore="Profession"
              name="profession"
              value={data.profession ? data.profession : ""}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            className="FormLine"
            name="details"
            rules={[
              {
                required: true,
                message: "Please input some Details about you!",
              },
              {
                min: 5,
                message: `"Details" length must be at least 5 characters long`,
              },
            ]}
          >
            <Input
              addonBefore="Details"
              name="details"
              value={data.details ? data.details : ""}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item className="FormLine">
            <Button
              block
              htmlType="submit"
              type="primary"
              onSubmit={handleSubmit}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditUserPage;
