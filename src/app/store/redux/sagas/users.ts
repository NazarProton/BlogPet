import { IUser } from "./../../../components/ComponentsTypes";
import * as Effects from "redux-saga/effects";
import authService from "../../../services/auth.service";
import localStorageService from "../../../services/localStorage.service";
import userService from "../../../services/user.service";
import { generetaAuthError } from "../../../utils/generateAuthError";
import { toast } from "react-toastify";
import { IPayloadUsers, IUsersActionsTypes } from "../types/ReduxTypes";

const call: any = Effects.call;
const put: any = Effects.put;
const takeEvery: any = Effects.takeEvery;

export function* login(payload: IPayloadUsers) {
  const { data, navigate, redirect } = payload.payload;
  const { email, password } = data;
  let currentUserData: IUser;
  try {
    const { token } = yield call(authService.login, {
      email,
      password,
    });
    currentUserData = yield call(getCurrentUser, { payload: navigate });

    yield put({
      type: IUsersActionsTypes.LOGIN_SUCCESS,
      payload: { user: currentUserData },
    });
    localStorageService.setTokens(token, currentUserData);
    navigate(redirect);
  } catch (error: any) {
    console.log(error);
    const { code, message } = error.response.data.error;
    if (code === 400) {
      const errorMessage = generetaAuthError(message);
      yield put({
        type: IUsersActionsTypes.LOGIN_FAILURE,
        payload: errorMessage,
      });
    } else {
      yield put({
        type: IUsersActionsTypes.LOGIN_FAILURE,
        payload: { error: "Ошибка получения данних с сервера" },
      });
    }
  }
}
export function* getCurrentUser(payload: IPayloadUsers) {
  const { navigate } = payload.payload;
  try {
    const { currentUser } = yield call(authService.getCurrentUser);
    return currentUser;
  } catch (error: any) {
    yield put({
      type: IUsersActionsTypes.CURRENT_USER_LOGOUT,
    });
    localStorageService.removeAuthData();
    if (navigate) navigate("/login");
    const errorMessage = generetaAuthError(error.message);
    yield put({
      type: IUsersActionsTypes.CURRENT_USER_DATA_CHANGE_FAILURE,
      payload: { error: errorMessage },
    });
  }
}

export function* registration(payload: IPayloadUsers) {
  try {
    yield call(authService.register, payload.payload.data);
    yield put({
      type: IUsersActionsTypes.NEW_USER_REGISTRATION_SUCCESS,
    });
    const loginData = {
      email: payload.payload.data.email,
      password: payload.payload.data.password,
    };
    yield call(login, {
      payload: {
        data: loginData,
        redirect: payload.payload.redirect,
        navigate: payload.payload.navigate,
      },
    });
  } catch (error: any) {
    console.log(error);
    const { code, message } = error.response.data.error;
    const errorMessage = generetaAuthError(message);
    if (code === 400) {
      yield put({
        type: IUsersActionsTypes.NEW_USER_REGISTRATION_FAILURE,
        payload: errorMessage,
      });
    } else {
      yield put({
        type: IUsersActionsTypes.NEW_USER_REGISTRATION_FAILURE,
        payload: { error: errorMessage },
      });
    }
  }
}

export function* logOut(payload: IPayloadUsers) {
  yield call(localStorageService.removeAuthData);
  payload.payload.navigate("/");
  yield put({
    type: IUsersActionsTypes.CURRENT_USER_LOGOUT,
    payload: { error: "Срок сесии окончен, залогиньтесь снова!" },
  });
}

export function* loadUsersList(payload: IPayloadUsers) {
  try {
    const request: IUser[] = yield call(
      userService.getUsers,
      payload.payload.currentPage
    );
    yield put({
      type: IUsersActionsTypes.LOAD_USERS_SUCCESS,
      payload: { users: request },
    });
  } catch (error: any) {
    yield put({
      type: IUsersActionsTypes.LOAD_USERS_FAILURE,
      payload: { error: "Ошибка получения данних с сервера" },
    });
  }
}

export function* getUserById(payload: IPayloadUsers) {
  const { userId, navigate } = payload.payload;
  try {
    const request: IUser = yield call(userService.getUserById, userId);
    yield put({
      type: IUsersActionsTypes.GET_USER_BY_ID_SUCCESS,
      payload: { user: request },
    });
  } catch (error: any) {
    const status = error.response.status;
    if (status === 404) {
      toast.error(`user with id:${userId} not found!`);
      if (navigate) navigate("/users");
    }
    const errorMessage = generetaAuthError(error.message);
    if (error?.response?.status === 400 || error.response?.status === 403) {
      yield put({
        type: IUsersActionsTypes.CURRENT_USER_LOGOUT,
      });
      localStorageService.removeAuthData();
      payload.payload.navigate("/login");
      yield put({
        type: IUsersActionsTypes.GET_USER_BY_ID_FAILURE,
        payload: { error: errorMessage },
      });
    } else {
      yield put({
        type: IUsersActionsTypes.GET_USER_BY_ID_FAILURE,
        payload: { error: errorMessage },
      });
    }
  }
}
export function* getUserByIdForComments(payload: IPayloadUsers) {
  const { userId, usersById } = payload.payload;
  try {
    if (usersById.filter((u) => u._id === userId).length > 0) {
      const request: IUser = yield call(userService.getUserById, userId);
      yield put({
        type: IUsersActionsTypes.GET_USER_BY_ID_FOR_COMMENTS_SUCCESS,
        payload: { user: request },
      });
    } else {
      const request: IUser = yield call(userService.getUserById, userId);
      yield put({
        type: IUsersActionsTypes.GET_USER_BY_ID_FOR_COMMENTS_SUCCESS,
        payload: { user: request },
      });
    }
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 404) {
      yield put({
        type: IUsersActionsTypes.GET_USER_BY_ID_FOR_COMMENTS_SUCCESS,
        payload: {
          user: {
            name: "deletedUser",
            _id: userId,
            dateCreated: "0",
            details: "",
            email: "",
            extra_details: "",
            profession: "",
            skills: "",
            __v: 0,
          },
        },
      });
    } else {
      yield put({
        type: IUsersActionsTypes.GET_USER_BY_ID_FOR_COMMENTS_FAILURE,
        payload: { error: "Ошибка получения данних с сервера" },
      });
    }
  }
}

export function* updateCurrentUser(payload: IPayloadUsers) {
  try {
    if (payload.payload.avatar) {
      yield call(userService.updateCurrentUserAvatar, payload.payload.avatar);
    }
    const { data } = payload.payload;
    const request: IUser = yield call(userService.updateCurrentUser, data);

    localStorageService.updateCurrentUser(request);
    yield put({
      type: IUsersActionsTypes.CURRENT_USER_DATA_CHANGE_SUCCESS,
      payload: { user: request },
    });
    payload.payload.navigate(-1);
  } catch (error: any) {
    if (error?.response?.status === 400 || error.response?.status === 403) {
      yield put({
        type: IUsersActionsTypes.CURRENT_USER_LOGOUT,
        payload: { error: "Срок сесии окончен, залогиньтесь снова!" },
      });
      localStorageService.removeAuthData();
      payload.payload.navigate("/login");
      const errorMessage = generetaAuthError(error.message);
      yield put({
        type: IUsersActionsTypes.CURRENT_USER_DATA_CHANGE_FAILURE,
        payload: errorMessage,
      });
    } else {
      yield put({
        type: IUsersActionsTypes.CURRENT_USER_DATA_CHANGE_FAILURE,
        payload: { error: "Ошибка получения данних с сервера" },
      });
    }
  }
}
export function* deleteUser(payload: IPayloadUsers) {
  try {
    yield call(userService.delete);
    payload.payload.navigate("/");
    yield put({
      type: IUsersActionsTypes.DELETE_USER_SUCCESS,
    });
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 403) {
      yield put({
        type: IUsersActionsTypes.CURRENT_USER_LOGOUT,
        payload: { error: "Срок сесии окончен, залогиньтесь снова!" },
      });
      localStorageService.removeAuthData();
      payload.payload.navigate("/login");
    }
  }
}
export default function* UsersSaga() {
  yield takeEvery(IUsersActionsTypes.LOGIN, login);
  yield takeEvery(IUsersActionsTypes.USER_LOGGED_OUT, logOut);
  yield takeEvery(IUsersActionsTypes.LOAD_USERS, loadUsersList);
  yield takeEvery(IUsersActionsTypes.GET_USER_BY_ID, getUserById);
  yield takeEvery(
    IUsersActionsTypes.GET_USER_BY_ID_FOR_COMMENTS,
    getUserByIdForComments
  );
  yield takeEvery(IUsersActionsTypes.NEW_USER_REGISTRATION, registration);
  yield takeEvery(
    IUsersActionsTypes.CURRENT_USER_DATA_CHANGE,
    updateCurrentUser
  );
  yield takeEvery(IUsersActionsTypes.DELETE_USER, deleteUser);
  yield takeEvery(IUsersActionsTypes.GET_CURRENT_USER, getCurrentUser);
}
