import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IUsersActionsTypes } from "../../store/redux/types/ReduxTypes";

const LogOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: IUsersActionsTypes.USER_LOGGED_OUT,
      payload: { navigate },
    });
  }, [dispatch, navigate]);
  return <h1>Loading...</h1>;
};

export default LogOut;
