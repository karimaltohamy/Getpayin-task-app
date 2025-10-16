import { apiEndpoints } from "../../constants/config";
import axiosService from "../axiosService";
import { LoginCredentials, LoginResponse, User, RefreshTokenResponse } from "./types";

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await axiosService.post(apiEndpoints.LOGIN, credentials);
    return response.data as LoginResponse;
  },

  getMe: async (): Promise<User> => {
    const response = await axiosService.get(apiEndpoints.ME);
    return response.data as User;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await axiosService.post(
      apiEndpoints.REFRESH,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data as RefreshTokenResponse;
  },
};
