import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.scss";
import Main from "./components/MainPage/main";
import Navbar from "./components/navbar/navBar";
import PostsListPage from "./components/postsPage/PostsListPage";
import Login from "./components/loginLogout/login";
import Users from "./components/usersPage/users";
import LogOut from "./components/loginLogout/logOut";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import localStorageService from "./services/localStorage.service";
import { useTypedSelector } from "./hooks/useTypedSelector";
import { IUsersActionsTypes } from "./store/redux/types/ReduxTypes";

const App: React.FC = () => {
  const themeRedux = useTypedSelector((s) => s.posts.theme);
  const themeLS = localStorageService.getTheme();
  const body = document.getElementsByTagName("body")[0];
  document.body.classList.remove(themeRedux === "light" ? "dark" : "light");
  body.classList.add(themeRedux || themeLS || "");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    if (token) {
      dispatch({
        type: IUsersActionsTypes.GET_CURRENT_USER,
        payload: { navigate },
      });
    }
  }, [dispatch, navigate]);
  return (
    <div className="container_general">
      <Navbar></Navbar>
      <Routes>
        <Route path="users/*" element={<Users />}>
          <Route path=":userId/:edit" element={<Users />} />
          <Route path=":userId" element={<Users />} />
        </Route>
        <Route path="posts/*" element={<PostsListPage />}>
          <Route path=":posts/:edit" element={<PostsListPage />} />
          <Route path=":posts" element={<PostsListPage />} />
        </Route>
        <Route path="login/*" element={<Login />} />
        <Route path="logout" element={<LogOut />} />
        <Route path="*" element={<Main />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
