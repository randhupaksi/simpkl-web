import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { LoginPage } from './login-page'

describe('LoginPage', () => {
  it('shows accessible validation messages', async () => {
    const user = userEvent.setup()
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Masuk ke SIMPKL' }))

    expect(
      await screen.findByText('Email atau username wajib diisi.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Password minimal 8 karakter.')).toBeInTheDocument()
  })
})
