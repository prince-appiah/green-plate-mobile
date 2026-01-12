import Axios from "axios";
import { BaseApiResponse } from "./axios";

export async function refreshAccessToken(refreshToken: string) {
  const axiosInstance = Axios.create({
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const fn = await axiosInstance.post("/auth/refresh", {
    refreshToken,
  });

  return fn.data as BaseApiResponse<{
    accessToken: string;
    refreshToken?: string; // Optional if i rotate refresh tokens
  }>;
}
