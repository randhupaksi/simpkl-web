import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import { ProtectedRoute } from './protected-route'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'

afterEach(() => useAuthStore.getState().clearSession())

describe('ProtectedRoute', () => {
  it('redirects guests to the login page', async () => {
    const router = createMemoryRouter(
      [
        {
          element: <ProtectedRoute />,
          children: [{ path: '/dashboard', element: <p>Dashboard aman</p> }],
        },
        { path: '/auth/login', element: <p>Halaman login</p> },
      ],
      { initialEntries: ['/dashboard'] },
    )

    render(<RouterProvider router={router} />)
    expect(await screen.findByText('Halaman login')).toBeInTheDocument()
  })
})
