import { apiEndpoints } from "../../constants/config";
import axiosService from "../axiosService";
import { LoginCredentials, LoginResponse, User } from "./types";

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await axiosService.post(apiEndpoints.LOGIN, credentials);
    return response.data as LoginResponse;
  },

  getMe: async (): Promise<User> => {
    const response = await axiosService.get(apiEndpoints.ME);
    return response.data as User;
  },
};
