import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { login } from './auth.api'
import { server } from '../../../../tests/mocks/server'

describe('auth API', () => {
  it('maps the documented login request to the API', async () => {
    server.use(
      http.post(
        'http://localhost:8080/api/v1/auth/login',
        async ({ request }) => {
          const body = (await request.json()) as {
            login: string
            password: string
          }
          expect(body.login).toBe('admin')
          return HttpResponse.json({
            success: true,
            message: 'Login berhasil',
            data: {
              user: {
                id: '1',
                name: 'Admin',
                email: 'admin@example.test',
                username: 'admin',
                status: 'active',
                roles: ['super_admin'],
                permissions: ['*'],
              },
              tokens: {
                access_token: 'access',
                refresh_token: 'refresh',
                token_type: 'Bearer',
                expires_in: 900,
              },
            },
            meta: null,
          })
        },
      ),
    )

    const result = await login({ login: 'admin', password: 'password123' })
    expect(result.tokens.access_token).toBe('access')
  })
})
