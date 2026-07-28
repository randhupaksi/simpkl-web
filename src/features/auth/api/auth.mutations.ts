import { useMutation } from '@tanstack/react-query'

import { login, logout } from './auth.api'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import { mapAuthTokens, mapAuthUser } from '@/features/auth/utils'

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      setSession(mapAuthUser(result.user), mapAuthTokens(result.tokens))
    },
  })
}

export function useLogoutMutation() {
  const tokens = useAuthStore((state) => state.tokens)
  const clearSession = useAuthStore((state) => state.clearSession)

  return useMutation({
    mutationFn: async () => {
      if (tokens?.refreshToken) {
        await logout(tokens.refreshToken)
      }
    },
    onSettled: clearSession,
  })
}
