import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import { PermissionRoute } from './permission-route'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'

afterEach(() => useAuthStore.getState().clearSession())

describe('PermissionRoute', () => {
  it('renders a 403 route when permission is missing', async () => {
    useAuthStore.getState().setSession(
      {
        id: '1',
        name: 'Staf',
        email: 'staf@example.test',
        username: 'staf',
        status: 'active',
        roles: ['staff'],
        permissions: ['student.view'],
      },
      {
        accessToken: 'access',
        refreshToken: 'refresh',
        expiresIn: 900,
        tokenType: 'Bearer',
      },
    )
    const router = createMemoryRouter(
      [
        {
          element: <PermissionRoute permission="company.view" />,
          children: [{ path: '/companies', element: <p>Perusahaan</p> }],
        },
        { path: '/403', element: <p>Akses ditolak</p> },
      ],
      { initialEntries: ['/companies'] },
    )

    render(<RouterProvider router={router} />)
    expect(await screen.findByText('Akses ditolak')).toBeInTheDocument()
  })
})
