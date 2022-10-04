import { IUser } from "./../../../../components/ComponentsTypes";
import localStorageService from "../../../../services/localStorage.service";
import {
  IUserAction,
  IUsersActionsTypes,
  IUsersState,
} from "../../types/ReduxTypes";

const currentUser = localStorageService.getCurrentUser();
const acessToken = localStorageService.getAccessToken();
const UserId = localStorageService.getUserId();
const initialPeopleState: IUsersState = {
  entities: null,
  isLoading: acessToken ? true : false,
  error: null,
  auth: acessToken ? { userId: UserId } : null,
  currentUser: acessToken
    ? currentUser
      ? JSON.parse(currentUser)
      : null
    : null,
  usersById: [],
  userById: null,
  isLoggedIn: true,
  dataLoaded: false,
};

export default function UsersReducer(
  state = initialPeopleState,
  action: IUserAction
): IUsersState {
  switch (action.type) {
    case IUsersActionsTypes.LOGIN: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case IUsersActionsTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        error: null,
        auth: action.payload.user._id,
        isLoggedIn: true,
        currentUser: action.payload.user,
      };
    }
    case IUsersActionsTypes.LOGIN_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case IUsersActionsTypes.USER_LOGGED_OUT: {
      return {
        ...state,
        entities: null,
        isLoggedIn: false,
        auth: null,
        dataLoaded: false,
        currentUser: null,
      };
    }
    case IUsersActionsTypes.LOAD_USERS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case IUsersActionsTypes.LOAD_USERS_SUCCESS: {
      return {
        ...state,
        entities: action.payload.users,
        isLoading: false,
      };
    }
    case IUsersActionsTypes.LOAD_USERS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case IUsersActionsTypes.GET_USER_BY_ID: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case IUsersActionsTypes.GET_USER_BY_ID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        userById: action.payload.user,
      };
    }
    case IUsersActionsTypes.GET_USER_BY_ID_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case IUsersActionsTypes.CURRENT_USER_DATA_CHANGE: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case IUsersActionsTypes.CURRENT_USER_DATA_CHANGE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        currentUser: { ...state.currentUser, ...action.payload.user },
      };
    }
    case IUsersActionsTypes.CURRENT_USER_DATA_CHANGE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case IUsersActionsTypes.GET_USER_BY_ID_FOR_COMMENTS: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case IUsersActionsTypes.GET_USER_BY_ID_FOR_COMMENTS_SUCCESS: {
      if (action.payload.user._id) {
        const match = state.usersById?.find((u) => {
          return u._id === action.payload.user._id;
        });
        if (match) {
          return {
            ...state,
            isLoading: false,
          };
        }
        const transformData = [action.payload.user];
        const newUsersArray: IUser[] = [...state.usersById, ...transformData];
        return {
          ...state,
          isLoading: false,
          usersById: newUsersArray,
        };
      }
      return {
        ...state,
        isLoading: false,
      };
    }
    case IUsersActionsTypes.GET_USER_BY_ID_FOR_COMMENTS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case IUsersActionsTypes.CURRENT_USER_LOGOUT: {
      return {
        ...state,
        isLoggedIn: false,
        currentUser: null,
      };
    }
    case IUsersActionsTypes.DELETE_USER_SUCCESS: {
      return {
        ...state,
        currentUser: null,
        isLoggedIn: false,
      };
    }
    default:
      return state;
  }
}
