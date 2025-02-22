import { create } from "zustand";

export interface UserType {
  name: string;
  email: string;
  role: "admin" | "user";
  accessToken: string;
}

interface AuthStore {
  user: UserType | null;
  login: (user: UserType) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
   
  login: (user) => {
   console.log(user);
   
    localStorage.setItem("token", user.accessToken);
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));
