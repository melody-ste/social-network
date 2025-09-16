import { atom } from "jotai";
import Cookies from "js-cookie";

// Token JWT
export const tokenAtom = atom(Cookies.get("token") || null);

// Infos utilisateur connecté
export const userAtom = atom(() => {
  const cookie = Cookies.get("user");
  return cookie ? JSON.parse(cookie) : null;
});