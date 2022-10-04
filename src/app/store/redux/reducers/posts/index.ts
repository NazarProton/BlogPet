import { IComment } from "./../../types/ReduxTypes";
import localStorageService from "../../../../services/localStorage.service";
import {
  IPostAction,
  IPostsState,
  IPostsActionsTypes,
} from "../../types/ReduxTypes";
import { IPost } from "../../../../components/ComponentsTypes";

const theme = localStorageService.getTheme();
const initialIPostsState: IPostsState = {
  limit: 10,
  skip: 0,
  total: 0,
  loading: false,
  error: "",
  data: [],
  theme: theme || null,
  commentsForPostById: [],
  commentToPost: [],
};

export default function PostsReducer(
  state = initialIPostsState,
  action: IPostAction
): IPostsState {
  switch (action.type) {
    case IPostsActionsTypes.CHANGE_THEME: {
      return {
        ...state,
        loading: true,
        theme: state.theme === "light" ? "dark" : "light",
      };
    }
    case IPostsActionsTypes.LOAD_POSTS: {
      return {
        ...state,
        loading: true,
      };
    }
    case IPostsActionsTypes.LOAD_POSTS_SUCCESS: {
      const { limit, skip, total } = action.payload.pagination;

      return {
        ...state,
        total,
        limit,
        skip,
        data: action.payload.posts,
        loading: false,
      };
    }
    case IPostsActionsTypes.LOAD_POSTS_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    }
    case IPostsActionsTypes.LOAD_POSTS_PAGINATION: {
      return {
        ...state,
        loading: true,
      };
    }
    case IPostsActionsTypes.LOAD_POSTS_PAGINATION_SUCCESS: {
      const { limit, skip, total, search } = action.payload.pagination;
      return {
        ...state,
        loading: false,
        search,
        total,
        limit,
        skip,
        data: action.payload.posts,
      };
    }
    case IPostsActionsTypes.LOAD_POSTS_PAGINATION_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    }
    case IPostsActionsTypes.LOAD_POSTS_BY_ID: {
      return {
        ...state,
        IsLoading: true,
        postById: action.payload.postbyId,
        commentsForPostById: action.payload.comments,
      };
    }
    case IPostsActionsTypes.LOAD_POSTS_BY_ID_SUCCESS: {
      const comments = action.payload.comments.filter(
        (comment) => comment.followedCommentID == null
      );
      const commentsForComments = action.payload.comments.filter(
        (comment) => comment.followedCommentID !== null
      );
      const commentsWithFollowedCommentsRecursive = (
        comments: IComment[]
      ): IComment[] => {
        const commentsWithFolloowedComments = comments.map((comment) => {
          const answers = commentsForComments.filter(
            (followedComment) =>
              followedComment.followedCommentID === comment._id
          );
          return answers.length === 0
            ? { ...comment, answers: null }
            : {
                ...comment,
                answers: commentsWithFollowedCommentsRecursive(answers),
              };
        });
        return commentsWithFolloowedComments;
      };

      return {
        ...state,
        IsLoading: false,
        postById: action.payload.postbyId,
        commentsForPostById: commentsWithFollowedCommentsRecursive(comments),
      };
    }
    case IPostsActionsTypes.LOAD_POSTS_BY_ID_FAILURE: {
      return {
        ...state,
        IsLoading: false,
        error: action.payload.error,
      };
    }
    case IPostsActionsTypes.POST_DATA_CHANGE: {
      return {
        ...state,
        IsLoading: true,
      };
    }
    case IPostsActionsTypes.POST_DATA_CHANGE_SUCCESS: {
      const newPosts: IPost[] = state.data?.map((p) => {
        if (p._id === action.payload.post._id) {
          p = action.payload.post;
        }
        return p;
      });
      return {
        ...state,
        IsLoading: false,
        data: newPosts,
      };
    }
    case IPostsActionsTypes.POST_DATA_CHANGE_FAILURE: {
      return {
        ...state,
        IsLoading: false,
        error: action.payload.error,
      };
    }
    case IPostsActionsTypes.NEW_POST_CREATE_SUCCESS: {
      let newPosts = state?.data;
      if (newPosts?.length < 10) {
        newPosts.push(action.payload.post);
      }
      return {
        ...state,
        IsLoading: false,
        data: newPosts,
      };
    }
    case IPostsActionsTypes.DELETE_POST_SUCCESS: {
      const newPosts = state.data.filter(
        (p) => p._id !== action.payload.postId
      );
      return {
        ...state,
        IsLoading: false,
        data: newPosts,
      };
    }

    case IPostsActionsTypes.LOAD_COMMENTS: {
      return {
        ...state,
        commentToPost: action.payload.crop,
      };
    }
    case IPostsActionsTypes.CREATE_COMMENT_TO_POST: {
      return {
        ...state,
        IsLoading: true,
      };
    }
    case IPostsActionsTypes.CREATE_COMMENT_TO_POST_SUCCESS: {
      const changeCommentList = function (comments: IComment[]) {
        const a = comments.map((c) => {
          let answer: IComment[];
          if (c._id === action.payload.comment.followedCommentID) {
            answer = c.answers
              ? [...c.answers, action.payload.comment]
              : [action.payload.comment];
            c.answers = answer;
            return c;
          } else {
            if (c.answers?.length) {
              c.answers = changeCommentList(c.answers);
              return c;
            } else {
              return c;
            }
          }
        });
        return a;
      };
      return !action.payload.comment.followedCommentID
        ? {
            ...state,
            IsLoading: false,
            commentsForPostById: state.commentsForPostById.length
              ? [...state.commentsForPostById, action.payload.comment]
              : [action.payload.comment],
            commentToPost: state.commentToPost?.length
              ? [...state.commentToPost, action.payload.comment]
              : [action.payload.comment],
          }
        : {
            ...state,
            commentToPost: changeCommentList(state.commentToPost),
          };
    }
    case IPostsActionsTypes.CREATE_COMMENT_TO_POST_FAILURE: {
      return {
        ...state,
        error: action.payload.error,
      };
    }
    case IPostsActionsTypes.SET_LIKE_FOR_COMMENT_SUCCESS: {
      const { commentId, currentUserId } = action.payload;
      const changeCommentList = function (comments: IComment[]) {
        const a = comments.map((c) => {
          if (c._id === commentId) {
            if (c.likes.includes(currentUserId)) {
              c.likes = c.likes.filter(
                (like: string) => like !== currentUserId
              );
            } else {
              c.likes.push(currentUserId);
            }
            return c;
          } else {
            if (c.answers?.length) {
              c.answers = changeCommentList(c.answers);
              return c;
            } else {
              return c;
            }
          }
        });
        return a;
      };

      return {
        ...state,
        commentToPost: changeCommentList(state.commentToPost),
      };
    }
    case IPostsActionsTypes.EDIT_COMMENT_BY_ID: {
      return {
        ...state,
        loading: true,
      };
    }

    case IPostsActionsTypes.EDIT_COMMENT_BY_ID_SUCCESS: {
      if (action.payload.followedCommentID) {
        const changeCommentList = function (comments: IComment[]) {
          const a = comments.map((c) => {
            if (c._id === action.payload.comment._id) {
              c.text = action.payload.comment.text;
              return c;
            } else {
              if (c.answers?.length) {
                c.answers = changeCommentList(c.answers);
                return c;
              } else {
                return c;
              }
            }
          });
          return a;
        };
        return {
          ...state,
          loading: false,
          commentToPost: changeCommentList(state.commentToPost),
        };
      }

      const newComments = state.commentToPost.map((p) => {
        if (p._id === action.payload.comment._id) {
          p = action.payload.comment;
        }
        return p;
      });
      const newAllComments = state.commentsForPostById.map((p: IComment) => {
        if (p._id === action.payload.comment._id) {
          p = action.payload.comment;
        }
        return p;
      });
      return {
        ...state,
        loading: false,
        commentToPost: newComments,
        commentsForPostById: newAllComments,
      };
    }
    case IPostsActionsTypes.EDIT_COMMENT_BY_ID_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    }
    case IPostsActionsTypes.DELETE_COMMENT_BY_ID_SUCCESS: {
      const changeCommentList = function (comments: IComment[]) {
        const filterdComments = comments.filter(
          (c) => c._id !== action.payload.comment._id
        );
        if (filterdComments.length === comments.length) {
          const nextStep = comments.map((c) => {
            c.answers = c.answers ? changeCommentList(c.answers) : [];
            return c;
          });
          return nextStep;
        }
        return filterdComments;
      };
      return {
        ...state,
        commentToPost: changeCommentList(state.commentToPost),
      };
    }

    default:
      return state;
  }
}
