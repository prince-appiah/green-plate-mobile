import { AxiosError } from "axios";

// type Success<T> = { result: T; error: null };
// type Failure<E> = { result: null; error: E };
// type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * A reusable try-catch wrapper that either resolves the promise or rejects with a transformed error.
 *
 * @param promise - The async operation to execute
 * @returns The resolved data if successful, otherwise rejects with a transformed error.
 */
export async function handleAsync<T>(promise: Promise<T>): Promise<T> {
  try {
    const response = await promise;
    return response;
  } catch (error) {
    return Promise.reject(error);
    // throw error;
  }
}

/**
 * Global error transformer to standardize error messages
 *
 * @param error - The error thrown
 * @returns A readable error message
 */
export function transformError(error: unknown): string {
  if (error instanceof AxiosError) {
    console.log(
      "AXIOS ERROR: ",
      JSON.stringify(getAxiosErrorMessage(error), null, 2)
    );
    return getAxiosErrorMessage(error) || "Network error. Please try again.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred.";
}

const getAxiosErrorMessage = (error: AxiosError): string => {
  // Defensive: handle various possible backend patterns and fallback gracefully.
  const data = error.response?.data;

  // Try multiple paths for "message"
  // Possible formats: data.message, data.error.message, data.error.errors, etc.
  let message: unknown = undefined;

  if (data) {
    if (typeof data === "object" && data !== null) {
      if ("message" in data) {
        message = (data as any).message;
      } else if ("error" in data && typeof (data as any).error === "object") {
        if ("message" in (data as any).error) {
          message = (data as any).error.message;
        } else if ("errors" in (data as any).error) {
          message = (data as any).error.errors;
        }
      }
    }
  }

  // If message is an array, join with new lines
  if (Array.isArray(message)) {
    return (
      message.filter((m) => typeof m === "string").join("\n") ||
      "An unknown server error occurred."
    );
  }
  // If message is a string, return as-is
  if (typeof message === "string") {
    return message;
  }

  // Fallback to generic error message
  return "Network error. Please try again.";
};
