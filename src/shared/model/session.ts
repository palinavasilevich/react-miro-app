import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { publicFetchClient } from "../api/instance";

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
  refreshToken: () => Promise<string | null>;
};

const TOKEN_KEY = "token";
let refreshTokenPromise: Promise<string | null> | null = null;

export const useSession = create<SessionStore>()(
  persist(
    (set, get) => ({
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

      refreshToken: async () => {
        const token = get().token;
        if (!token) return null;

        const session = jwtDecode<Session>(token);

        if (session.exp < Date.now() / 1000) {
          if (!refreshTokenPromise) {
            refreshTokenPromise = publicFetchClient
              .POST("/auth/refresh")
              .then((res) => res.data?.accessToken ?? null)
              .then((newToken) => {
                if (newToken) {
                  set({
                    token: newToken,
                    session: jwtDecode<Session>(newToken),
                  });

                  return newToken;
                } else {
                  get().logout();
                  return null;
                }
              })
              .finally(() => {
                refreshTokenPromise = null;
              });
          }

          return refreshTokenPromise;
        }

        return token;
      },
    }),
    {
      name: TOKEN_KEY,
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        const token = state?.token;
        if (token) {
          try {
            state!.session = jwtDecode<Session>(token);
          } catch {
            state!.token = null;
            state!.session = null;
          }
        }
      },
    },
  ),
);
