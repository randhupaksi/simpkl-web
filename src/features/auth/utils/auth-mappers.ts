import type {
  AuthTokenPayload,
  AuthTokens,
  AuthUser,
  AuthUserPayload,
} from '@/features/auth/types/auth'

export function mapAuthTokens(payload: AuthTokenPayload): AuthTokens {
  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    tokenType: payload.token_type,
    expiresIn: payload.expires_in,
  }
}

export function mapAuthUser(payload: AuthUserPayload): AuthUser {
  return {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    username: payload.username,
    status: payload.status,
    majorId: payload.major_id,
    classId: payload.class_id,
    roles: payload.roles,
    permissions: payload.permissions,
  }
}
