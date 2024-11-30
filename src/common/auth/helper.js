import { readCookie } from "../cookieHelper";

export function isLoggedIn() {
  return !!localStorage.getItem("user") && !!readCookie("auth");
}
