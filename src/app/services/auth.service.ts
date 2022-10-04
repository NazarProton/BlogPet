import { IUser } from "./../components/ComponentsTypes";
import localStorageService from "./localStorage.service";
import { http } from "./http.service";

const authService = {
  register: async (newUserData: IUser) => {
    const {
      email,
      password,
      name,
      extra_details,
      skills,
      profession,
      details,
    } = newUserData;
    const { data } = await http.post("users", {
      email,
      password,
      name,
      extra_details,
      skills,
      profession,
      details,
    });
    return data;
  },
  login: async ({ email, password }: { email: string; password: string }) => {
    const { data } = await http.post("auth", {
      email,
      password,
    });
    localStorage.setItem("jwt-token", data.token);
    return data;
  },
  getCurrentUser: async () => {
    const currentUser = await http.get("auth/user");
    return { currentUser: currentUser.data };
  },
  refresh: async () => {
    const { data } = await http.post("token", {
      grant_type: "refresh_token",
      refresh_token: localStorageService.getRefreshToken(),
    });
    return data;
  },
};

export default authService;
