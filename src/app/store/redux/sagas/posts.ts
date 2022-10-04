import { IComment } from "./../types/ReduxTypes";
import { IPost } from "./../../../components/ComponentsTypes";
import {
  IPayloadPosts,
  IPostsActionsTypes,
  IRequestForPost,
  IUsersActionsTypes,
} from "../types/ReduxTypes";
import * as Effects from "redux-saga/effects";
import commentsService from "../../../services/comments.service";
import localStorageService from "../../../services/localStorage.service";
import postService from "../../../services/post.service";

const call: any = Effects.call;
const put: any = Effects.put;
const takeEvery: any = Effects.takeEvery;
const takeLatest: any = Effects.takeLatest;

export function* loadPostsList() {
  try {
    const request: IRequestForPost = yield call(postService.getPosts);
    yield put({
      type: IPostsActionsTypes.LOAD_POSTS_SUCCESS,
      payload: { posts: request.data, pagination: request.pagination },
    });
  } catch (error) {
    yield put({
      type: IPostsActionsTypes.LOAD_POSTS_FAILURE,
      payload: { error: "Ошибка получения данних с сервера" },
    });
  }
}

export function* loadPostListPagination(payload: IPayloadPosts) {
  const { limit, skip, search } = payload.payload;
  try {
    const request: IRequestForPost = yield call(
      postService.getPostsPagination,
      limit,
      skip,
      search
    );
    request.pagination.search = search;
    yield put({
      type: IPostsActionsTypes.LOAD_POSTS_PAGINATION_SUCCESS,
      payload: { posts: request.data, pagination: request.pagination },
    });
  } catch (error) {
    yield put({
      type: IPostsActionsTypes.LOAD_POSTS_PAGINATION_FAILURE,
      payload: { error: "Ошибка получения данних с сервера" },
    });
  }
}
export function* loadPostById(payload: IPayloadPosts) {
  const { postId } = payload.payload;
  try {
    const postbyIdRequest: IPost = yield call(postService.getPostById, postId);
    const commentsForPostById: IComment[] = yield call(
      postService.getCommentsForPostById,
      postId
    );

    yield put({
      type: IPostsActionsTypes.LOAD_POSTS_BY_ID_SUCCESS,
      payload: {
        postbyId: postbyIdRequest,
        comments: commentsForPostById,
      },
    });
  } catch (error) {
    yield put({
      type: IPostsActionsTypes.LOAD_POSTS_BY_ID_FAILURE,
      payload: { error: "Ошибка получения данних с сервера" },
    });
  }
}

export function* createPost(payload: IPayloadPosts) {
  const { data, avatar, navigate } = payload.payload;
  try {
    let request: IPost = yield call(postService.createPost, data);
    if (avatar) {
      request = yield call(postService.updatePostAvatar, avatar, request._id);
    }
    yield put({
      type: IPostsActionsTypes.NEW_POST_CREATE_SUCCESS,
      payload: { post: request },
    });
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 403) {
      yield put({
        type: IUsersActionsTypes.CURRENT_USER_LOGOUT,
      });
      localStorageService.removeAuthData();
      navigate("/login");
    }
    yield put({
      type: IPostsActionsTypes.NEW_POST_CREATE_FAILURE,
      payload: { error: "Ошибка получения данних с сервера" },
    });
  }
}
export function* setLike(payload: IPayloadPosts) {
  const { postId, navigate } = payload.payload;
  try {
    yield call(postService.setLike, postId);

    yield put({
      type: IPostsActionsTypes.SET_LIKE_SUCCESS,
    });
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 403) {
      yield put({
        type: IUsersActionsTypes.CURRENT_USER_LOGOUT,
      });
      localStorageService.removeAuthData();
      navigate("/login");
    }
    yield put({
      type: IPostsActionsTypes.SET_LIKE_FAILURE,
      payload: { error: "Ошибка получения данних с сервера" },
    });
  }
}
export function* setLikeFotComment(payload: IPayloadPosts) {
  const { commentId, currentUserId, navigate } = payload.payload;
  try {
    yield call(postService.setLikeForComment, commentId);

    yield put({
      type: IPostsActionsTypes.SET_LIKE_FOR_COMMENT_SUCCESS,
      payload: { commentId, currentUserId },
    });
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 403) {
      yield put({
        type: IUsersActionsTypes.CURRENT_USER_LOGOUT,
      });
      localStorageService.removeAuthData();
      navigate("/login");
    }
    yield put({
      type: IPostsActionsTypes.SET_LIKE_FOR_COMMENT_FAILURE,
      payload: { error: "Ошибка получения данних с сервера" },
    });
  }
}
export function* deletePost(payload: IPayloadPosts) {
  try {
    yield call(postService.delete, payload.payload.postId);
    yield put({
      type: IPostsActionsTypes.DELETE_POST_SUCCESS,
      payload: { postId: payload.payload.postId },
    });
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 403) {
      yield put({
        type: IUsersActionsTypes.CURRENT_USER_LOGOUT,
      });
      localStorageService.removeAuthData();
      payload.payload.navigate("/login");
    }
    yield put({
      type: IPostsActionsTypes.DELETE_POST_FAILURE,
      payload: { error: "Ошибка получения данних с сервера" },
    });
  }
}

export function* updatePost(payload: IPayloadPosts) {
  try {
    if (payload.payload.avatar) {
      yield call(
        postService.updatePostAvatar,
        payload.payload.avatar,
        payload.payload.postId
      );
    }
    const { data, postId } = payload.payload;
    const request: { data: IPost } = yield call(
      postService.updatePost,
      data,
      postId
    );

    yield put({
      type: IPostsActionsTypes.POST_DATA_CHANGE_SUCCESS,
      payload: { post: request.data },
    });
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 403) {
      yield put({
        type: IUsersActionsTypes.CURRENT_USER_LOGOUT,
      });
      localStorageService.removeAuthData();
      payload.payload.navigate("/login");
    } else {
      yield put({
        type: IPostsActionsTypes.POST_DATA_CHANGE_FAILURE,
        payload: { error: "Ошибка получения данних с сервера" },
      });
    }
  }
}

export function* createComment(payload: IPayloadPosts) {
  const { newComment, postById, navigate } = payload.payload;
  try {
    const request: IComment = yield call(
      commentsService.createComment,
      newComment,
      postById
    );
    yield put({
      type: IPostsActionsTypes.CREATE_COMMENT_TO_POST_SUCCESS,
      payload: { comment: request },
    });
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 403) {
      yield put({
        type: IUsersActionsTypes.CURRENT_USER_LOGOUT,
      });
      localStorageService.removeAuthData();
      navigate("/login");
    }
    yield put({
      type: IPostsActionsTypes.CREATE_COMMENT_TO_POST_FAILURE,
      payload: { error: "Ошибка получения данних с сервера" },
    });
  }
}
export function* editComment(payload: IPayloadPosts) {
  const { data, commentId, navigate } = payload.payload;
  try {
    const request: { data: IComment } = yield call(
      commentsService.updateComment,
      data,
      commentId
    );
    yield put({
      type: IPostsActionsTypes.EDIT_COMMENT_BY_ID_SUCCESS,
      payload: { comment: request.data },
    });
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 403) {
      yield put({
        type: IUsersActionsTypes.CURRENT_USER_LOGOUT,
      });
      localStorageService.removeAuthData();
      navigate("/login");
    } else {
      yield put({
        type: IPostsActionsTypes.EDIT_COMMENT_BY_ID_FAILURE,
        payload: { error: "Ошибка получения данних с сервера" },
      });
    }
  }
}
export function* deleteComment(payload: IPayloadPosts) {
  try {
    yield call(commentsService.deleteComment, payload.payload._id);
    yield put({
      type: IPostsActionsTypes.DELETE_COMMENT_BY_ID_SUCCESS,
      payload: { comment: payload.payload },
    });
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 403) {
      yield put({
        type: IUsersActionsTypes.CURRENT_USER_LOGOUT,
      });
      localStorageService.removeAuthData();
      payload.payload.navigate("/login");
    }
    yield put({
      type: IPostsActionsTypes.DELETE_COMMENT_BY_ID_FAILURE,
      payload: { error: "Ошибка получения данних с сервера" },
    });
  }
}

export default function* PostsSaga() {
  yield takeEvery(IPostsActionsTypes.LOAD_POSTS, loadPostsList);
  yield takeLatest(
    IPostsActionsTypes.LOAD_POSTS_PAGINATION,
    loadPostListPagination
  );
  yield takeEvery(IPostsActionsTypes.LOAD_POSTS_BY_ID, loadPostById);
  yield takeEvery(IPostsActionsTypes.NEW_POST_CREATE, createPost);
  yield takeEvery(IPostsActionsTypes.SET_LIKE, setLike);
  yield takeEvery(IPostsActionsTypes.SET_LIKE_FOR_COMMENT, setLikeFotComment);
  yield takeEvery(IPostsActionsTypes.DELETE_POST, deletePost);
  yield takeEvery(IPostsActionsTypes.POST_DATA_CHANGE, updatePost);
  yield takeEvery(IPostsActionsTypes.CREATE_COMMENT_TO_POST, createComment);
  yield takeEvery(IPostsActionsTypes.EDIT_COMMENT_BY_ID, editComment);
  yield takeEvery(IPostsActionsTypes.DELETE_COMMENT_BY_ID, deleteComment);
}
