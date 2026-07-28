import { useQuery } from '@tanstack/react-query'

import { getCurrentUser } from './auth.api'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import { mapAuthUser } from '@/features/auth/utils'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export function useCurrentUserQuery() {
  const hasToken = useAuthStore((state) => Boolean(state.tokens?.accessToken))
  const setSession = useAuthStore((state) => state.setSession)
  const tokens = useAuthStore((state) => state.tokens)

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const user = mapAuthUser(await getCurrentUser())
      if (tokens) setSession(user, tokens)
      return user
    },
    enabled: hasToken,
  })
}
