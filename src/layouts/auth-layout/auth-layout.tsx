import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-slate-950 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.3),_transparent_42%)]" />
        <div className="relative flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-teal-400 font-bold text-slate-950">
            SC
          </div>
          <div>
            <p className="font-semibold">SIMPKL Citra Negara</p>
            <p className="text-sm text-slate-400">
              Back-office pengelolaan PKL
            </p>
          </div>
        </div>
        <div className="relative max-w-xl">
          <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-teal-300 uppercase">
            Administrasi PKL terpusat
          </p>
          <h1 className="text-5xl leading-tight font-semibold tracking-tight">
            Kelola periode, penempatan, dan dokumen dengan lebih tertib.
          </h1>
        </div>
      </section>
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
        <Outlet />
      </section>
    </main>
  )
}
