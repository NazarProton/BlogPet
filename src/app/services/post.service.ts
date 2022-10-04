import { IPost } from "../components/ComponentsTypes";
import { http } from "./http.service";
const postsEndpoint = "posts";

const postService = {
  getPosts: async () => {
    const { data } = await http.get(`${postsEndpoint}`);
    return data;
  },
  getPostsPagination: async (limit: number, skip: number, search: string) => {
    const { data } = await http.get(
      `${postsEndpoint}${
        search ? `?search=${search}&` : "?"
      }limit=${limit}&skip=${skip}`
    );
    return data;
  },
  createPost: async ({
    title,
    description,
    fullText,
  }: {
    title: string;
    description: string;
    fullText: string;
  }) => {
    const { data } = await http.post(postsEndpoint, {
      title,
      fullText,
      description,
    });
    return data;
  },
  getPostById: async (postId: string) => {
    const { data } = await http.get(`${postsEndpoint}/${postId}`);
    return data;
  },
  getCommentsForPostById: async (postId: string) => {
    const { data } = await http.get(`comments/post/${postId}`);
    return data;
  },
  updatePost: async (data: IPost, postId: string) => {
    const Currentdata = await http.patch(`${postsEndpoint}/${postId}`, data);
    return Currentdata;
  },
  updatePostAvatar: async (formData: File, postId: string) => {
    console.log(formData);
    const headers: {} = {
      "Content-Type": "multipart/form-data",
    };
    const body = new FormData();
    body.append("image", formData, formData.name);
    const { data } = await http.put(
      `${postsEndpoint}/upload/${postId}`,
      body,
      headers
    );
    return data;
  },
  setLike: async (postId: string) => {
    await http.put(`${postsEndpoint}/like/${postId}`);
  },
  setLikeForComment: async (commentId: string) => {
    await http.put(`comments/like/${commentId}`);
  },
  delete: async (postId: string) => {
    await http.delete(`${postsEndpoint}/${postId}`);
  },
};

export default postService;
