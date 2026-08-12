import { zodResolver } from '@hookform/resolvers/zod'
import { LockKeyhole, LogIn, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useLoginMutation } from '@/features/auth/api'
import { loginSchema, type LoginInput } from '@/features/auth/schemas'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import { ROUTE_PATHS } from '@/app/router'
import { Button, Input, PasswordInput } from '@/shared/components/ui'
import { FormField } from '@/shared/design-system/form'
import { PageTitle, Typography } from '@/shared/design-system/typography'
import type { ApiError } from '@/shared/types/api'

type LoginLocationState = {
  from?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) =>
    Boolean(state.tokens?.accessToken),
  )
  const loginMutation = useLoginMutation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: '', password: '' },
  })

  if (isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.dashboard} replace />
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values)
      toast.success('Login berhasil', {
        description: 'Welcome to SIMPKL.',
      })
      const state = location.state as LoginLocationState | null
      navigate(state?.from ?? ROUTE_PATHS.dashboard, { replace: true })
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.errors) {
        for (const [field, messages] of Object.entries(apiError.errors)) {
          if (field === 'login' || field === 'password') {
            setError(field, { message: messages[0] })
          }
        }
      }
    }
  })

  return (
    <div className="enter-animation w-full max-w-md">
      <div className="mb-8 lg:hidden">
        <Typography as="p" variant="sectionTitle">
          SIMPKL
        </Typography>
        <Typography variant="caption">
          Pusat administrasi Praktik Kerja Lapangan
        </Typography>
      </div>
      <Typography variant="overline">Portal staf sekolah</Typography>
      <PageTitle className="mt-2">Selamat datang kembali</PageTitle>
      <Typography variant="muted" className="mt-3 max-w-sm">
        Masuk menggunakan akun internal untuk mengelola administrasi PKL secara
        aman dan terpusat.
      </Typography>

      <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
        <div className="border-border border-b pb-4">
          <p className="text-foreground text-sm font-semibold">Kredensial akun</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Gunakan akun staf yang terdaftar di SIMPKL.
          </p>
        </div>
        <FormField
          id="login"
          label="Email atau username"
          error={errors.login?.message}
          required
        >
          <Input
            id="login"
            autoComplete="username"
            placeholder="Masukkan email atau username"
            startIcon={<UserRound />}
            invalid={Boolean(errors.login)}
            aria-describedby={errors.login ? 'login-error' : undefined}
            {...register('login')}
          />
        </FormField>
        <FormField
          id="password"
          label="Password"
          error={errors.password?.message}
          required
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Masukkan password"
            startIcon={<LockKeyhole />}
            invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
        </FormField>

        {loginMutation.error ? (
          <div
            role="alert"
            className="border-danger-border bg-danger-subtle text-danger rounded-[var(--radius-md)] border px-4 py-3 text-sm"
          >
            {(loginMutation.error as unknown as ApiError).message}
          </div>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={loginMutation.isPending}
          loadingText="Memverifikasi akun…"
          startIcon={<LogIn />}
        >
          Masuk ke SIMPKL
        </Button>
      </form>

      <Typography variant="caption" className="mt-6 text-center">
        Lupa akses akun? Hubungi administrator sistem sekolah.
      </Typography>
    </div>
  )
}
