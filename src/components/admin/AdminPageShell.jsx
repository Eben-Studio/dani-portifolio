import { Link, useLocation } from 'react-router-dom'
import ImageWithFallback from '../ImageWithFallback'
import Button from '../ui/button'

function AdminPageShell({ logoImg, title, subtitle, actions, onSignOut, children }) {
  const { pathname } = useLocation()
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'

  const isActive = (href) => {
    if (href === '/admin') return normalizedPath === '/admin'
    return normalizedPath.startsWith(href)
  }

  const navItems = [
    { label: 'Home', href: '/admin/home', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M6.5 10.5V20h11V10.5" />
        <path d="M10 20v-6h4v6" />
      </svg>
    ) },
    { label: 'Painel', href: '/admin', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        <path d="M4 4h7v7H4z" />
        <path d="M13 4h7v4h-7z" />
        <path d="M13 10h7v10h-7z" />
        <path d="M4 13h7v7H4z" />
      </svg>
    ) },
    { label: 'Obras', href: '/admin/obras', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </svg>
    ) },
    { label: 'Colecoes', href: '/admin/colecoes', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        <path d="M4 6h16v12H4z" />
        <path d="M8 6v12" />
        <path d="M16 6v12" />
      </svg>
    ) },
  ]

  const shouldRenderActions = Boolean(actions) || Boolean(onSignOut)

  return (
    <main className="min-h-screen w-full bg-canvas">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <aside className="w-full border-b border-border/15 bg-surface-2/80 px-4 py-5 shadow-[0_16px_30px_rgba(64,47,1,0.08)] lg:sticky lg:top-0 lg:h-screen lg:w-[264px] lg:border-b-0 lg:border-r lg:px-5">
          <div className="flex items-center justify-center">
            <ImageWithFallback
              src={logoImg}
              alt="Painel admin"
              className="h-12 w-36 object-contain"
              fallbackClassName="font-['Intel_One_Mono'] text-[18px] text-ink"
              fallbackText="DK"
            />
          </div>

          <nav className="mt-6">
            <p className="font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.28em] text-ink/40">
              Menu
            </p>
            <ul className="mt-3 space-y-2">
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 rounded-[16px] border px-3 py-2 text-[13px] font-['Inter'] transition ${
                        active
                          ? 'border-border/30 bg-white/80 text-ink shadow-[0_10px_24px_rgba(64,47,1,0.08)]'
                          : 'border-transparent text-ink/60 hover:border-border/20 hover:bg-white/60 hover:text-ink'
                      }`}
                    >
                      <span className={`flex h-7 w-7 items-center justify-center rounded-[10px] ${
                        active ? 'bg-surface-3 text-ink' : 'bg-white/60 text-ink/45'
                      }`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="mt-6 rounded-[18px] border border-dashed border-border/25 bg-surface-1/70 px-4 py-3">
            <p className="font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.24em] text-ink/40">
              Portfolio
            </p>
            <Link
              to="/"
              className="mt-2 inline-flex items-center gap-2 text-[12px] font-['Inter'] text-ink/70 hover:text-ink"
            >
              Voltar para o site
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </aside>

        <section className="flex-1 bg-[radial-gradient(900px_circle_at_10%_-10%,rgba(255,255,255,0.7),transparent_60%)]">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
            <header className="rounded-[28px] border border-border/15 bg-white/80 px-6 py-6 shadow-[0_20px_40px_rgba(64,47,1,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.3em] text-ink/45">
                    Supabase Admin
                  </p>
                  <h1 className="mt-3 font-['Intel_One_Mono'] text-[28px] text-ink">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="mt-2 font-['Inter'] text-[13px] text-ink-muted/70">
                      {subtitle}
                    </p>
                  )}
                </div>
                {shouldRenderActions && (
                  <div className="flex flex-wrap items-center gap-2">
                    {actions}
                    {onSignOut && (
                      <Button type="button" variant="outline" size="sm" onClick={onSignOut}>
                        Sair
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </header>

            <div className="mt-6 space-y-6">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminPageShell
