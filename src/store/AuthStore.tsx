import { create } from "zustand";

export interface UserType {
  name: string;
  email: string;
  role: "admin" | "user";
  token: string;
}

interface AuthStore {
  user: UserType | null;
  login: (user: UserType) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  login: (user) => {
    localStorage.setItem("token", user.token);
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));
