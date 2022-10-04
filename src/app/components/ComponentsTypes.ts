export interface IUser {
  password?: string;
  _id: string;
  email: string;
  name: string;
  dateCreated: string;
  __v: number;
  extra_details?: string;
  profession: string;
  skills: string;
  details: string;
  avatar?: string;
  commentId: string;
}

export interface IPost {
  _id: string;
  title: string;
  description: string;
  fullText: string;
  dateCreated?: string;
  postedBy?: null | string;
  __v?: number;
  image?: string;
  likes: string[];
}

export interface IRegisterFormData {
  name?: string;
  email: string;
  password: string;
  details?: string;
  extra_details?: string;
  profession?: string;
  skills?: string;
  licence?: boolean;
}
export interface IError {
  name: string;
  value: string | boolean;
  onChange?: () => void;
}
