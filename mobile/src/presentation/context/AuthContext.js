import { createContext, useContext } from "react";

const noop = async () => {};

export const AuthContext = createContext({
  token: null,
  user: null,
  signIn: noop,
  signOut: noop,
  updateUser: noop,
});

export function useAuth() {
  return useContext(AuthContext);
}