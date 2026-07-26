export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  roles: string[]
  permissions: string[]
}

export interface AuthSession {
  user: AuthUser | null
  tokens: AuthTokens | null
}
