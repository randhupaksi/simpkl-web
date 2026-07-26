import { Eye, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 lg:hidden">
        <p className="text-lg font-semibold">SIMPKL Citra Negara</p>
        <p className="text-sm text-slate-500">Back-office pengelolaan PKL</p>
      </div>
      <p className="text-sm font-semibold text-teal-700">
        Selamat datang kembali
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        Masuk ke akun staf
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Gunakan akun sekolah untuk mengakses sistem pengelolaan PKL.
      </p>

      <form className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </span>
          <span className="relative block">
            <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              autoComplete="email"
              placeholder="nama@smkcitranegara.sch.id"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white pr-4 pl-10 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
            />
          </span>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </span>
          <span className="relative block">
            <LockKeyhole className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Masukkan password"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white pr-12 pl-10 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label={
                showPassword ? 'Sembunyikan password' : 'Tampilkan password'
              }
              onClick={() => setShowPassword((current) => !current)}
            >
              <Eye className="size-4" />
            </button>
          </span>
        </label>
        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input type="checkbox" className="size-4 accent-teal-600" />
            Ingat saya
          </label>
          <span className="text-slate-500">Hubungi administrator</span>
        </div>
        <Link
          to={ROUTE_PATHS.dashboard}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Masuk
        </Link>
      </form>
    </div>
  )
}
