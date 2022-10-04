import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Form } from "antd";
import { IUsersActionsTypes } from "../../../store/redux/types/ReduxTypes";
import LoginInputs from "../allForm/loginInputs";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useLocation();
  const [data, SetData] = useState({
    password: "",
    email: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    SetData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSubmit = () => {
    const redirect = params.state ? params.state : "/";
    dispatch({
      type: IUsersActionsTypes.LOGIN,
      payload: { data, redirect, navigate },
    });
  };
  return (
    <Form onFinish={handleSubmit}>
      <LoginInputs data={data} handleChange={handleChange} />
      <Button block htmlType="submit" type="primary" onSubmit={handleSubmit}>
        Войти
      </Button>
    </Form>
  );
};

export default LoginForm;
