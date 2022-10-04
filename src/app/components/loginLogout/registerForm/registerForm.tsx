import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Input, Checkbox } from "antd";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { IError, IRegisterFormData } from "../../ComponentsTypes";
import { IUsersActionsTypes } from "../../../store/redux/types/ReduxTypes";
import LoginInputs from "../allForm/loginInputs";

const RegisterForm = () => {
  const navigate = useNavigate();
  const params = useLocation();
  const dispatch = useDispatch();
  const [data, setData] = useState<IRegisterFormData>({
    name: "",
    email: "",
    password: "",
    details: "",
    extra_details: "",
    profession: "",
    skills: "",
    licence: false,
  });
  const loginError = useTypedSelector((s) => s.users.error);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value }: IError = event.target;
    const newData = { ...data, [name]: value };
    setData(newData);
  }

  const handleSubmit = () => {
    const redirect = params.state ? params.state : "/";
    dispatch({
      type: IUsersActionsTypes.NEW_USER_REGISTRATION,
      payload: { data, navigate, redirect },
    });
  };

  return (
    <Form onFinish={handleSubmit}>
      <LoginInputs data={data} handleChange={handleChange} />
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
          addonBefore="Имя пользователя:"
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
          addonBefore="Extra details:"
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
          addonBefore="Skills:"
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
          addonBefore="Profession:"
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
          addonBefore="Details:"
          name="details"
          value={data.details ? data.details : ""}
          onChange={handleChange}
        />
      </Form.Item>
      <Form.Item>
        <Checkbox
          name="licence"
          checked={data.licence}
          value={data.licence}
          onChange={() => {
            setData({ ...data, licence: !data.licence });
          }}
        >
          Подтвердить лицензионное соглашение
        </Checkbox>{" "}
      </Form.Item>
      {loginError && <p className="text-danger">{loginError}</p>}
      <Form.Item>
        <Button
          block
          className="submitButton"
          htmlType="submit"
          type="primary"
          onSubmit={handleSubmit}
        >
          <p>Sign In</p>
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
