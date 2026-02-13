// import { createMMKV } from "react-native-mmkv";

// export const storage = createMMKV({
//   id: "clean-plate-storage",
// //   encryptionKey: "clean-plate-secret-key", // Optional: Add encryption for sensitive data
// });

// /**
//  * Storage utilities for common operations
//  */
// export const storageUtils = {
//   getString: (key: string): string | undefined => {
//     return storage.getString(key);
//   },

//   setString: (key: string, value: string): void => {
//     storage.set(key, value);
//   },

//   getBoolean: (key: string): boolean | undefined => {
//     return storage.getBoolean(key);
//   },

//   setBoolean: (key: string, value: boolean): void => {
//     storage.set(key, value);
//   },

//   getNumber: (key: string): number | undefined => {
//     return storage.getNumber(key);
//   },

//   setNumber: (key: string, value: number): void => {
//     storage.set(key, value);
//   },

//   getObject: <T>(key: string): T | undefined => {
//     const value = storage.getString(key);
//     return value ? JSON.parse(value) : undefined;
//   },

//   setObject: (key: string, value: any): void => {
//     storage.set(key, JSON.stringify(value));
//   },

//   delete: (key: string): void => {
//     storage.remove(key);
//   },

//   clear: (): void => {
//     storage.clearAll();
//   },

//   getAllKeys: (): string[] => {
//     return storage.getAllKeys();
//   },

//   contains: (key: string): boolean => {
//     return storage.contains(key);
//   },
// };
