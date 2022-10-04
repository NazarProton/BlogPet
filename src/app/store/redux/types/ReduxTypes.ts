import { IUser, IPost } from "./../../../components/ComponentsTypes";
import { NavigateFunction } from "react-router-dom";
import { compose } from "redux";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export interface IUserAction extends IPayloadUsers {
  type: string;
}
export interface IPostAction extends IPayloadPosts {
  type: string;
}

export interface IUsersState {
  entities: null | IUser[];
  isLoading: boolean;
  error: null | string;
  auth: string | null | { userId: string | null };
  currentUser: null | IUser;
  usersById: IUser[];
  isLoggedIn: boolean;
  dataLoaded: boolean;
  userById: IUser | null;
}
export interface IComment {
  likes: string[];
  _id: string;
  text: string;
  dateCreated: string;
  __v: number;
  followedCommentID: null | string;
  answers: IComment[] | null;
  commentedBy: string;
  comentatorName?: string;
  avatar?: string;
  commentId: string;
  comentator: IUser | null | undefined;
}

export interface IPostsState {
  limit: number;
  skip: number;
  total: number;
  loading: boolean;
  IsLoading?: boolean;
  postById?: IPost | null;
  commentsForPostById: IComment[];
  error: string;
  data: IPost[];
  theme: string | null;
  commentToPost: IComment[];
  search?: string | null;
}

export interface IPagination {
  limit: number;
  skip: number;
  total: number;
  search?: string;
}

export interface IPayloadPosts {
  payload: {
    post: IPost;
    posts: IPost[];
    pagination: IPagination;
    error: string;
    limit: number;
    skip: number;
    total: number;
    search?: string;
    navigate: NavigateFunction;
    postId?: string;
    data: IPost[];
    avatar?: File;
    postbyId: IPost;
    comment: IComment;
    comments: IComment[];
    followedCommentID: string;
    crop: IComment[];
    commentId?: string;
    currentUserId: string;
    _id?: string;
    newComment: IComment;
    postById: IPost;
  };
}
export interface IRequestForPost {
  data: IPost[];
  pagination: IPagination;
}

export interface IPayloadUsers {
  payload: {
    users: IUser[];
    user: IUser;
    currentUser: IUser;
    navigate: NavigateFunction;
    redirect: string;
    data: IUser;
    currentPage?: number;
    userId: string;
    usersById: IUser[];
    avatar?: File;
    currentUserId?: string;
    error: string;
  };
}
export enum IPostsActionsTypes {
  LOAD_POSTS = "LOAD_POSTS",
  LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS",
  LOAD_POSTS_FAILURE = "LOAD_POSTS_FAILURE",
  LOAD_POSTS_PAGINATION = "LOAD_POSTS_PAGINATION",
  LOAD_POSTS_PAGINATION_SUCCESS = "LOAD_POSTS_PAGINATION_SUCCESS",
  LOAD_POSTS_PAGINATION_FAILURE = "LOAD_POSTS_PAGINATION_FAILURE",
  LOAD_POSTS_BY_ID = "LOAD_POSTS_BY_ID",
  LOAD_POSTS_BY_ID_SUCCESS = "LOAD_POSTS_BY_ID_SUCCESS",
  LOAD_POSTS_BY_ID_FAILURE = "LOAD_POSTS_BY_ID_FAILURE",
  NEW_POST_CREATE = "NEW_POST_CREATE",
  NEW_POST_CREATE_SUCCESS = "NEW_POST_CREATE_SUCCESS",
  NEW_POST_CREATE_FAILURE = "NEW_POST_CREATE_FAILURE",
  SET_LIKE = "SET_LIKE",
  SET_LIKE_SUCCESS = "SET_LIKE_SUCCESS",
  SET_LIKE_FAILURE = "SET_LIKE_FAILURE",
  DELETE_POST = "DELETE_POST",
  DELETE_POST_SUCCESS = "DELETE_POST_SUCCESS",
  DELETE_POST_FAILURE = "DELETE_POST_FAILURE",
  POST_DATA_CHANGE = "POST_DATA_CHANGE",
  POST_DATA_CHANGE_SUCCESS = "POST_DATA_CHANGE_SUCCESS",
  POST_DATA_CHANGE_FAILURE = "POST_DATA_CHANGE_FAILURE",
  SET_LIKE_FOR_COMMENT = "SET_LIKE_FOR_COMMENT",
  SET_LIKE_FOR_COMMENT_SUCCESS = "SET_LIKE_FOR_COMMENT_SUCCESS",
  SET_LIKE_FOR_COMMENT_FAILURE = "SET_LIKE_FOR_COMMENT_FAILURE",
  LOAD_COMMENTS = "LOAD_COMMENTS",
  CREATE_ANSWERS_TO_CLICKED_COMMENT = "CREATE_ANSWERS_TO_CLICKED_COMMENT",
  CREATE_ANSWERS_TO_CLICKED_COMMENT_SUCCESS = "CREATE_ANSWERS_TO_CLICKED_COMMENT_SUCCESS",
  CREATE_ANSWERS_TO_CLICKED_COMMENT_FAILURE = "CREATE_ANSWERS_TO_CLICKED_COMMENT_FAILURE",
  CREATE_COMMENT_TO_POST = "CREATE_COMMENT_TO_POST",
  CREATE_COMMENT_TO_POST_SUCCESS = "CREATE_COMMENT_TO_POST_SUCCESS",
  CREATE_COMMENT_TO_POST_FAILURE = "CREATE_COMMENT_TO_POST_FAILURE",
  EDIT_COMMENT_BY_ID = "EDIT_COMMENT_BY_ID",
  EDIT_COMMENT_BY_ID_SUCCESS = "EDIT_COMMENT_BY_ID_SUCCESS",
  EDIT_COMMENT_BY_ID_FAILURE = "EDIT_COMMENT_BY_ID_FAILURE",
  DELETE_COMMENT_BY_ID = "DELETE_COMMENT_BY_ID",
  DELETE_COMMENT_BY_ID_SUCCESS = "DELETE_COMMENT_BY_ID_SUCCESS",
  DELETE_COMMENT_BY_ID_FAILURE = "DELETE_COMMENT_BY_ID_FAILURE",
  CLEAN_ALL_SHOWED_COMMENTS = "CLEAN_ALL_SHOWED_COMMENTS",
  LOAD_COMMENTS_BY_ID_SUCCESS = "LOAD_COMMENTS_BY_ID_SUCCESS",
  CHANGE_THEME = "CHANGE_THEME",
}

export enum IUsersActionsTypes {
  NEW_USER_REGISTRATION = "NEW_USER_REGISTRATION",
  NEW_USER_REGISTRATION_SUCCESS = "NEW_USER_REGISTRATION_SUCCESS",
  NEW_USER_REGISTRATION_FAILURE = "NEW_USER_REGISTRATION_FAILURE",
  LOGIN = "LOGIN",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  USER_LOGGED_OUT = "USER_LOGGED_OUT",
  LOAD_USERS = "LOAD_USERS",
  LOAD_USERS_SUCCESS = "LOAD_USERS_SUCCESS",
  LOAD_USERS_FAILURE = "LOAD_USERS_FAILURE",
  GET_USER_BY_ID = "GET_USER_BY_ID",
  GET_USER_BY_ID_SUCCESS = "GET_USER_BY_ID_SUCCESS",
  GET_USER_BY_ID_FAILURE = "GET_USER_BY_ID_FAILURE",
  GET_USER_BY_ID_FOR_COMMENTS = "GET_USER_BY_ID_FOR_COMMENTS",
  GET_USER_BY_ID_FOR_COMMENTS_FAILURE = "GET_USER_BY_ID_FOR_COMMENTS_FAILURE",
  GET_USER_BY_ID_FOR_COMMENTS_SUCCESS = "GET_USER_BY_ID_FOR_COMMENTS_SUCCESS",
  CURRENT_USER_DATA_CHANGE = "CURRENT_USER_DATA_CHANGE",
  CURRENT_USER_DATA_CHANGE_SUCCESS = "CURRENT_USER_DATA_CHANGE_SUCCESS",
  CURRENT_USER_DATA_CHANGE_FAILURE = "CURRENT_USER_DATA_CHANGE_FAILURE",
  DELETE_USER = "DELETE_USER",
  DELETE_USER_SUCCESS = "DELETE_USER_SUCCESS",
  DELETE_USER_FAILURE = "DELETE_USER_FAILURE",
  CURRENT_USER_LOGOUT = "CURRENT_USER_LOGOUT",
  GET_CURRENT_USER = "GET_CURRENT_USER",
}
