import React from "react";
import { useEffect } from "react";
import { Route, Routes, useNavigate, Link } from "react-router-dom";
import localStorageService from "../../services/localStorage.service";
import LoginForm from "./loginForm/loginForm";
import RegiserForm from "./registerForm/registerForm";
import { Card } from "antd";
import "./login.scss";
import { useTypedSelector } from "../../hooks/useTypedSelector";

const Login = () => {
  const navigate = useNavigate();
  const isLoggedIn = useTypedSelector((s) => s.users.isLoggedIn);
  const CurrentUserLocalStorrage = localStorageService.getCurrentUser();
  useEffect(() => {
    if (isLoggedIn && CurrentUserLocalStorrage) {
      navigate("/main");
    }
  }, [CurrentUserLocalStorrage, isLoggedIn, navigate]);
  return (
    <Routes>
      <Route
        path="register"
        element={
          <Card className="formBlock" style={{ marginBottom: "100px" }}>
            <h3 className="header">Register</h3>
            <RegiserForm />
            <p className="bottom">
              Already have account?{" "}
              <Link to="/login" role="button">
                Sign in
              </Link>
            </p>
          </Card>
        }
      />
      <Route
        path=""
        element={
          <Card
            hoverable
            className="formBlock"
            style={{ marginBottom: "100px" }}
          >
            <h3 className="header">Login</h3>
            <LoginForm />
            <p className="bottom">
              Dont have account?{" "}
              <Link to="register" role="button">
                Sign Up
              </Link>
            </p>
          </Card>
        }
      />
    </Routes>
  );
};

export default Login;
