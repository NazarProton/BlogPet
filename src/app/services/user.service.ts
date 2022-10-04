import { IUser } from "./../components/ComponentsTypes";
import { http } from "./http.service";
import localStorageService from "./localStorage.service";

const userEndpoint = "users";

let users: IUser[];
let usersIds: string[] = [];
interface IPagination {
  skip: number;
  limit: number;
  total: number;
}
interface IResponseSuccess<T> {
  data: T;
}

interface IResponseUsers extends IResponseSuccess<IUser[]>, IPagination {}

const userService = {
  getUsers: async (currentPage: number): Promise<IUser[]> => {
    const { data } = await http.get<IResponseUsers>(
      `${userEndpoint}?limit=${currentPage ? `10&skip=${currentPage}` : "10"}`
    );
    users = !currentPage ? data.data : [...users, ...data.data];
    return users;
  },
  getUserById: async (userId: string) => {
    if (users) {
      const a = users.filter((u) => u._id === userId);
      if (a.length) {
        return a[0];
      }
    }
    const b = usersIds?.filter((id) => id === userId);

    if (!b.length) {
      const { data } = await http.get<IUser>(`${userEndpoint}/${userId}`);
      usersIds = !b.length ? [userId] : [...usersIds, userId];
      return data;
    }
  },
  updateCurrentUser: async (Newdata: IUser): Promise<IUser> => {
    const { data } = await http.patch<IUser>(
      `${userEndpoint}/${localStorageService.getUserId()}`,
      Newdata
    );
    return data;
  },
  updateCurrentUserAvatar: async (formData: File): Promise<IUser> => {
    const headers: {} = {
      "Content-Type": "multipart/form-data",
    };
    const body = new FormData();
    body.append("avatar", formData, formData.name);
    const { data } = await http.put<IUser>(
      `${userEndpoint}/upload/${localStorageService.getUserId()}`,
      body,
      headers
    );
    localStorageService.updateCurrentUser(data);
    return data;
  },
  update: async (payload: IUser): Promise<IUser> => {
    const { data } = await http.patch<IUser>(
      userEndpoint + localStorageService.getUserId(),
      payload
    );
    return data;
  },
  delete: async (): Promise<void> => {
    const currentUserId = localStorageService.getUserId();
    console.log(currentUserId);
    await http.delete(`${userEndpoint}/${localStorageService.getUserId()}`);
    localStorageService.removeAuthData();
  },
};
export default userService;
