import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { AuthSession, AuthTokens, AuthUser } from '../types/auth'

interface AuthState extends AuthSession {
  setSession: (user: AuthUser, tokens: AuthTokens) => void
  setTokens: (tokens: AuthTokens) => void
  clearSession: () => void
}

const INITIAL_SESSION: AuthSession = {
  user: null,
  tokens: null,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...INITIAL_SESSION,
      setSession: (user, tokens) => set({ user, tokens }),
      setTokens: (tokens) => set({ tokens }),
      clearSession: () => set(INITIAL_SESSION),
    }),
    {
      name: 'simpkl-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ user, tokens }) => ({ user, tokens }),
    },
  ),
)
