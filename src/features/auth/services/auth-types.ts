import { User } from "@/features/shared";

export interface GoogleSigninResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
