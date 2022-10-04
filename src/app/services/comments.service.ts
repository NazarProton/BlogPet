import { IPost } from "./../components/ComponentsTypes";
import { IComment } from "../store/redux/types/ReduxTypes";
import { http } from "./http.service";
const commentsEndpoint = "comments";

const commentsService = {
  createComment: async (newComment: IComment, postById: IPost) => {
    const { text, followedCommentID } = newComment;
    const { data } = await http.post(
      `${commentsEndpoint}/post/${postById._id}`,
      followedCommentID
        ? {
            text,
            followedCommentID,
          }
        : {
            text,
          }
    );
    return data;
  },
  getCommentsForPostById: async (postId: string) => {
    const { data } = await http.get(`comments/post/${postId}`);
    return data;
  },
  updateComment: async (data: IComment, commentId: string) => {
    const { text } = data;
    console.log(text);
    const Currentdata = await http.patch(`${commentsEndpoint}/${commentId}`, {
      text,
    });
    return Currentdata;
  },

  setLikeForComment: async (commentId: string) => {
    await http.put(`comments/like/${commentId}`);
  },
  deleteComment: async (commentId: string) => {
    await http.delete(`${commentsEndpoint}/${commentId}`);
  },
};

export default commentsService;
