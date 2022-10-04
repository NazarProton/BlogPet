import { Form, Input } from "antd";
import * as React from "react";

interface IProps {
  data: {
    password: string;
    email: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginInputs = ({ data, handleChange }: IProps) => {
  return (
    <>
      <Form.Item
        name="email"
        rules={[{ required: true }, { min: 8 }, { type: "email" }]}
      >
        <Input
          addonBefore="Email:"
          name="email"
          value={data.email ? data.email : ""}
          onChange={handleChange}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true },
          { min: 8 },
          {
            validator: (rule, value) => {
              const capitalRegExp = /[A-ZА-Я]+/g;
              let capitalSymbValidate = capitalRegExp.test(value);
              const digitRegExp = /\d+/g;
              let digitValidate = digitRegExp.test(value);
              if (!capitalSymbValidate) {
                return Promise.reject(
                  "Пароль должен содержать одну заглавную букву!"
                );
              }
              if (!digitValidate) {
                return Promise.reject("Пароль должен содержать одну цифру!");
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input.Password
          addonBefore="Пароль:"
          name="password"
          value={data.password ? data.password : ""}
          onChange={handleChange}
        />
      </Form.Item>
    </>
  );
};

export default LoginInputs;
