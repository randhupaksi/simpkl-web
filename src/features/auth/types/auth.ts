export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface AuthTokenPayload {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface AuthUser {
  id: string
  name: string
  email: string
  username: string
  status: string
  majorId?: string
  classId?: string
  roles: string[]
  permissions: string[]
}

export interface AuthUserPayload {
  id: string
  name: string
  email: string
  username: string
  status: string
  major_id?: string
  class_id?: string
  roles: string[]
  permissions: string[]
}

export interface AuthResultPayload {
  user: AuthUserPayload
  tokens: AuthTokenPayload
}

export interface AuthSession {
  user: AuthUser | null
  tokens: AuthTokens | null
}
