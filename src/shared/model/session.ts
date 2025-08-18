import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

type Session = {
  userId: string;
  email: string;
  exp: number;
  iat: number;
};

type SessionStore = {
  token: string | null;
  session: Session | null;
  login: (token: string) => void;
  logout: () => void;
};

const TOKEN_KEY = "token";

export const useSession = create<SessionStore>()(
  persist(
    (set) => ({
      token: null,
      session: null,

      login: (token) => {
        set({
          token,
          session: jwtDecode<Session>(token),
        });
      },

      logout: () => {
        set({
          token: null,
          session: null,
        });
      },
    }),
    {
      name: TOKEN_KEY,
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        const token = state?.token;
        if (token) {
          state!.session = jwtDecode<Session>(token);
        }
      },
    },
  ),
);
