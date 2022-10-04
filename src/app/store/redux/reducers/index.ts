import { combineReducers } from "redux";
import PostsReducer from "./posts";
import usersReducer from "./users";
import { IUserAction } from "../types/ReduxTypes";

const initial = {};

export function appReducer(state = initial, action: IUserAction) {
  return state;
}

const rootReducer = combineReducers({
  posts: PostsReducer,
  users: usersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
