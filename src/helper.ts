import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === "object" && error != null && "message" in error && typeof (error as any).message === "string";
}

export function getErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    // you can access all properties of `FetchBaseQueryError` here
    return "error" in error ? error.error : (error.data as any).message || JSON.stringify(error.data);
  }
  if (isErrorWithMessage(error)) {
    // you can access a string 'message' property here
    return error.message;
  }
  return "Oops! Something went wrong!";
}
