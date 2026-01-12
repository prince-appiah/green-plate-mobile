import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTH_STORAGE_TOKEN_KEY = "@clean_plate:authToken";
export const AUTH_STORAGE_REFRESH_TOKEN_KEY = "@clean_plate:refreshToken";

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(AUTH_STORAGE_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(AUTH_STORAGE_REFRESH_TOKEN_KEY);
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(AUTH_STORAGE_TOKEN_KEY, token);
  },

  async setRefreshToken(refreshToken: string): Promise<void> {
    await AsyncStorage.setItem(AUTH_STORAGE_REFRESH_TOKEN_KEY, refreshToken);
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      this.setToken(accessToken),
      this.setRefreshToken(refreshToken),
    ]);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_STORAGE_TOKEN_KEY),
      AsyncStorage.removeItem(AUTH_STORAGE_REFRESH_TOKEN_KEY),
    ]);
  },

  async clearToken(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_STORAGE_TOKEN_KEY);
  },
};
