import { useMemo, useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import gsap from 'gsap'
import ImageWithFallback from './ImageWithFallback'
import PortfolioHeader from './PortfolioHeader'
import Footer from './Footer'
import CustomSelect from './CustomSelect'

// `CustomSelect` moved to its own file; imported above

const CATEGORY_LABELS = {
  residencial: 'Residencial',
  corporativo: 'Corporativo',
  collab: 'Collab',
  exposicao: 'Exposição',
}

const ORIGIN_LABELS = {
  direta: 'Direta',
  arquiteta: 'Arquiteta',
  escritorio: 'Escritório',
}

const normalizeValue = (value) => String(value || '').trim().toLowerCase()

// ── Artwork Card ─────────────────────────────────────────────────
function ArtworkCard({ artwork, heroImg, index, onSelect }) {
  const imgRef = useRef(null)
  const overlayRef = useRef(null)
  const delay = `${(index % 3) * 70 + Math.floor(index / 3) * 40}ms`

  const onEnter = useCallback(() => {
    gsap.to(imgRef.current, { scale: 1.07, duration: 0.55, ease: 'power2.out' })
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.28, ease: 'power2.out' })
  }, [])

  const onLeave = useCallback(() => {
    gsap.to(imgRef.current, { scale: 1, duration: 0.5, ease: 'power2.inOut' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, ease: 'power2.in' })
  }, [])

  return (
    <article
      onClick={() => onSelect?.(artwork)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[20px] border border-border/12 bg-surface-4 shadow-[0_4px_18px_rgba(var(--color-accent-strong),0.07)] transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(var(--color-accent-strong),0.13)]"
      style={{
        opacity: 0,
        animation: `cardReveal 0.55s cubic-bezier(0.22,1,0.36,1) forwards`,
        animationDelay: delay,
      }}
    >
      {/* Image */}
      <div className="relative h-[260px] overflow-hidden bg-surface-6">
        <div ref={imgRef} className="h-full w-full">
          <ImageWithFallback
            src={artwork.image}
            fallbackSrc={heroImg}
            alt={artwork.title}
            className="h-full w-full object-cover"
            fallbackClassName="h-full w-full bg-surface-5"
          />
        </div>

        {/* Hover overlay — gradiente mais denso e "Ver detalhes" com bg sólido */}
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 opacity-0"
          style={{ background: 'linear-gradient(to top, rgba(var(--color-ink),0.92) 0%, rgba(var(--color-ink),0.35) 45%, rgba(var(--color-ink),0.0) 75%)' }}
        >
          <div className="flex justify-end">
            <span className="rounded-full bg-accent px-3 py-1.5 font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.16em] text-ink">
              Ver detalhes →
            </span>
          </div>
          <div>
            <p className="font-['Intel_One_Mono'] text-[18px] leading-[1.1] text-canvas">{artwork.title}</p>
            <p className="mt-1 font-['Inter'] text-[11.5px] text-accent/85">{artwork.year} · {artwork.technique}</p>
          </div>
        </div>

        {/* Year tag */}
        <span className="absolute left-3 top-3 rounded-full bg-ink/72 px-2.5 py-1 font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
          {artwork.year}
        </span>
      </div>

      {/* Info row — fundo dourado escuro garante contraste */}
      <div className="flex items-center justify-between gap-2 border-t border-border/15 bg-surface-8 px-4 py-3.5">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate font-['Intel_One_Mono'] text-[13px] leading-[1.2] text-ink">{artwork.title}</p>
          <p className="font-['Inter'] text-[11px] text-ink-muted/55">{artwork.technique}</p>
        </div>
        <span className="shrink-0 text-border/45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-ink/60">
          →
        </span>
      </div>
    </article>
  )
}

// ── Main ─────────────────────────────────────────────────────────
function AllArtworks({ artworks = [], heroImg, logoImg, onArtworkSelect }) {
  const [yearFilter, setYearFilter] = useState('Todos')
  const [techniqueFilter, setTechniqueFilter] = useState('Todos')
  const [categoryFilter, setCategoryFilter] = useState('Todos')
  const [originFilter, setOriginFilter] = useState('Todos')
  const [sortBy, setSortBy] = useState('recente')
  const [gridKey, setGridKey] = useState(0)

  const pageRef = useRef(null)
  const headerRef = useRef(null)
  const filterBarRef = useRef(null)
  const countRef = useRef(null)

  const years = useMemo(() => {
    const values = artworks.map((a) => a.year).filter((year) => year)
    const unique = Array.from(new Set(values.map((year) => String(year))))
    return ['Todos', ...unique.sort((a, b) => Number(b) - Number(a))]
  }, [artworks])
  const techniques = useMemo(() => {
    const values = artworks.map((a) => a.technique).filter((technique) => technique)
    return ['Todos', ...Array.from(new Set(values))]
  }, [artworks])

  const categories = useMemo(() => {
    const values = artworks.map((a) => normalizeValue(a.category)).filter((category) => category)
    return ['Todos', ...Array.from(new Set(values))]
  }, [artworks])

  const origins = useMemo(() => {
    const values = artworks.map((a) => normalizeValue(a.commission_source)).filter((origin) => origin)
    return ['Todos', ...Array.from(new Set(values))]
  }, [artworks])

  const filtered = useMemo(() => {
    let list = artworks.filter((a) => {
      if (yearFilter !== 'Todos' && a.year !== yearFilter) return false
      if (techniqueFilter !== 'Todos' && a.technique !== techniqueFilter) return false
      if (categoryFilter !== 'Todos' && normalizeValue(a.category) !== categoryFilter) return false
      if (originFilter !== 'Todos' && normalizeValue(a.commission_source) !== originFilter) return false
      return true
    })
    if (sortBy === 'recente') list = [...list].sort((a, b) => b.year - a.year)
    if (sortBy === 'antigo') list = [...list].sort((a, b) => a.year - b.year)
    return list
  }, [artworks, yearFilter, techniqueFilter, categoryFilter, originFilter, sortBy])

  const hasActiveFilters =
    yearFilter !== 'Todos' ||
    techniqueFilter !== 'Todos' ||
    categoryFilter !== 'Todos' ||
    originFilter !== 'Todos'

  const applyYear      = (v) => { setYearFilter(v);      setGridKey((k) => k + 1) }
  const applyTechnique = (v) => { setTechniqueFilter(v); setGridKey((k) => k + 1) }
  const applyCategory  = (v) => { setCategoryFilter(v);  setGridKey((k) => k + 1) }
  const applyOrigin    = (v) => { setOriginFilter(v);    setGridKey((k) => k + 1) }
  const applySort      = (v) => { setSortBy(v);          setGridKey((k) => k + 1) }
  const clearFilters   = ()  => {
    setYearFilter('Todos')
    setTechniqueFilter('Todos')
    setCategoryFilter('Todos')
    setOriginFilter('Todos')
    setGridKey((k) => k + 1)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([headerRef.current, filterBarRef.current], {
        opacity: 0, y: 16, duration: 0.65, stagger: 0.1, ease: 'expo.out',
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!countRef.current) return
    gsap.fromTo(countRef.current, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' })
  }, [filtered.length])

  return (
    <main ref={pageRef} className="min-h-screen w-full bg-canvas">
      <style>{`
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="px-2 py-4 sm:px-4 lg:px-5">
        <div className="mx-auto w-full max-w-[1480px] space-y-4">

          <PortfolioHeader logoImg={logoImg} />

          {/* ── Título + contador ────────────────────── */}
          <div ref={headerRef} className="flex flex-col items-start gap-2 px-1 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-['Intel_One_Mono'] text-[32px] leading-[0.95] tracking-[0.01em] text-ink sm:text-[44px]">
              Obras_
            </h1>
            <div ref={countRef} className="flex items-baseline gap-1">
              <span className="font-['Intel_One_Mono'] text-[32px] leading-none text-ink/14 sm:text-[44px]">
                {String(filtered.length).padStart(2, '0')}
              </span>
              <span className="mb-1 font-['Inter'] text-[10px] text-ink/28">obras</span>
            </div>
          </div>

          {/* ══ Filter bar ══════════════════════════════════════════ */}
          <div
            ref={filterBarRef}
            className="flex flex-wrap items-center gap-3 rounded-[16px] border border-border/20 bg-surface-3 px-4 py-3.5 sm:px-5"
          >
            {/* Label */}
            <span className="font-['Intel_One_Mono'] text-[8.5px] uppercase tracking-[0.28em] text-ink/35 shrink-0">
              Filtrar
            </span>

            <div className="h-5 w-px bg-border/20" />

            {/* Custom select: Ano */}
            <CustomSelect
              label="Ano"
              value={yearFilter}
              options={years}
              onChange={applyYear}
              active={yearFilter !== 'Todos'}
            />

            {/* Custom select: Técnica */}
            <CustomSelect
              label="Técnica"
              value={techniqueFilter}
              options={techniques}
              onChange={applyTechnique}
              active={techniqueFilter !== 'Todos'}
            />

            <CustomSelect
              label="Categoria"
              value={categoryFilter}
              options={categories}
              onChange={applyCategory}
              active={categoryFilter !== 'Todos'}
              displayMap={CATEGORY_LABELS}
            />

            <CustomSelect
              label="Origem"
              value={originFilter}
              options={origins}
              onChange={applyOrigin}
              active={originFilter !== 'Todos'}
              displayMap={ORIGIN_LABELS}
            />

            {/* Clear */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-full border border-border/30 px-3 py-1.5 font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.16em] text-ink/45 transition hover:border-border/55 hover:text-ink/70"
              >
                <span>✕</span><span>Limpar</span>
              </button>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Sort toggle */}
            <div className="flex items-center gap-1 rounded-full border border-border/20 bg-canvas/60 p-1">
              {[
                { key: 'recente', label: 'Recente' },
                { key: 'antigo',  label: 'Antigo'  },
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => applySort(s.key)}
                  className={[
                    "rounded-full px-3.5 py-1.5 font-['Intel_One_Mono'] text-[9.5px] uppercase tracking-[0.12em] transition-all duration-200",
                    sortBy === s.key
                      ? 'bg-ink text-accent shadow-sm'
                      : 'text-ink/38 hover:text-ink/65',
                  ].join(' ')}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          {/* ══════════════════════════════════════════════════════════ */}

          {/* ── Grid ─────────────────────────────────── */}
          {filtered.length > 0 ? (
            <div key={gridKey} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((artwork, i) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  heroImg={heroImg}
                  index={i}
                  onSelect={onArtworkSelect}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-[24px] bg-surface-3 py-24">
              <p className="font-['Intel_One_Mono'] text-[12px] uppercase tracking-[0.2em] text-ink/30">
                Nenhuma obra encontrada
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border border-border/25 px-5 py-2.5 font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.16em] text-ink/50 transition hover:border-border/45 hover:text-ink/75"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/* ── Footer — sem arredondamento ──────────── */}

        </div>
      </div>
          <Footer id="contato" />
    </main>
  )
}

export default AllArtworks
