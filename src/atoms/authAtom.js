import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";



export const tokenAtom = atomWithStorage("auth-token", null);
export const userAtom = atomWithStorage("current-user", null);