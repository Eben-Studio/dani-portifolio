import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import ImageWithFallback from './ImageWithFallback'
import PortfolioHeader from './PortfolioHeader'
import Footer from './Footer'
import CustomSelect from './CustomSelect'

const CATEGORY_LABELS = {
  residencial: 'Residencial',
  corporativo: 'Corporativo',
  collab: 'Collab',
  exposicao: 'Exposicao',
}

const STATUS_LABELS = {
  disponivel: 'Disponivel',
  reservado: 'Reservado',
  vendido: 'Vendido',
}

const STATUS_BADGE_CLASSES = {
  disponivel: 'bg-ink/80 text-accent',
  reservado: 'bg-border/80 text-canvas',
  vendido: 'bg-ink/45 text-canvas',
}

const normalizeValue = (value) => String(value || '').trim().toLowerCase()

const buildWhatsappLink = (title) => {
  const base = 'https://wa.me/5511991810285'
  const message = title
    ? `Ola! Tenho interesse na obra "${title}".`
    : 'Ola! Tenho interesse em uma obra do shop.'
  return `${base}?text=${encodeURIComponent(message)}`
}

function ShopArtworkCard({ artwork, heroImg, index, onSelect }) {
  const imgRef = useRef(null)
  const overlayRef = useRef(null)
  const delay = `${(index % 3) * 70 + Math.floor(index / 3) * 40}ms`
  const statusKey = normalizeValue(artwork.sale_status)
  const statusLabel = STATUS_LABELS[statusKey] || 'Disponível'
  const statusClass = STATUS_BADGE_CLASSES[statusKey] || STATUS_BADGE_CLASSES.disponivel

  const onEnter = useCallback(() => {
    gsap.to(imgRef.current, { scale: 1.06, duration: 0.55, ease: 'power2.out' })
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

        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.14em] backdrop-blur-sm ${statusClass}`}>
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-col gap-3 border-t border-border/15 bg-surface-8 px-4 py-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate font-['Intel_One_Mono'] text-[13px] leading-[1.2] text-ink">{artwork.title}</p>
            <p className="font-['Inter'] text-[11px] text-ink-muted/55">{artwork.technique}</p>
          </div>
          <span className="shrink-0 text-border/45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-ink/60">
            →
          </span>
        </div>

        <a
          href={buildWhatsappLink(artwork.title)}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-ink px-4 py-2 font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.16em] text-accent transition hover:bg-ink/90"
        >
          Falar no WhatsApp
        </a>
      </div>
    </article>
  )
}

function ShopPage({ artworks = [], heroImg, logoImg, onArtworkSelect }) {
  const [yearFilter, setYearFilter] = useState('Todos')
  const [techniqueFilter, setTechniqueFilter] = useState('Todos')
  const [categoryFilter, setCategoryFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('disponivel')
  const [gridKey, setGridKey] = useState(0)

  const pageRef = useRef(null)
  const headerRef = useRef(null)
  const filterBarRef = useRef(null)
  const countRef = useRef(null)

  const saleArtworks = useMemo(
    () => artworks.filter(
      (artwork) => normalizeValue(artwork.sale_status) && normalizeValue(artwork.artwork_type) !== 'cartao',
    ),
    [artworks],
  )

  const years = useMemo(() => {
    const values = saleArtworks.map((a) => a.year).filter((year) => year)
    const unique = Array.from(new Set(values.map((year) => String(year))))
    return ['Todos', ...unique.sort((a, b) => Number(b) - Number(a))]
  }, [saleArtworks])

  const techniques = useMemo(() => {
    const values = saleArtworks.map((a) => a.technique).filter((technique) => technique)
    return ['Todos', ...Array.from(new Set(values))]
  }, [saleArtworks])

  const categories = useMemo(() => {
    const values = saleArtworks.map((a) => normalizeValue(a.category)).filter((category) => category)
    return ['Todos', ...Array.from(new Set(values))]
  }, [saleArtworks])

  const statuses = useMemo(() => ['Todos', 'disponivel', 'reservado', 'vendido'], [])

  const filtered = useMemo(() => {
    let list = saleArtworks.filter((a) => {
      if (yearFilter !== 'Todos' && a.year !== yearFilter) return false
      if (techniqueFilter !== 'Todos' && a.technique !== techniqueFilter) return false
      if (categoryFilter !== 'Todos' && normalizeValue(a.category) !== categoryFilter) return false
      if (statusFilter !== 'Todos' && normalizeValue(a.sale_status) !== statusFilter) return false
      return true
    })
    return list
  }, [saleArtworks, yearFilter, techniqueFilter, categoryFilter, statusFilter])

  const hasActiveFilters =
    yearFilter !== 'Todos' ||
    techniqueFilter !== 'Todos' ||
    categoryFilter !== 'Todos' ||
    statusFilter !== 'disponivel'

  const applyYear = (v) => { setYearFilter(v); setGridKey((k) => k + 1) }
  const applyTechnique = (v) => { setTechniqueFilter(v); setGridKey((k) => k + 1) }
  const applyCategory = (v) => { setCategoryFilter(v); setGridKey((k) => k + 1) }
  const applyStatus = (v) => { setStatusFilter(v); setGridKey((k) => k + 1) }
  const clearFilters = () => {
    setYearFilter('Todos')
    setTechniqueFilter('Todos')
    setCategoryFilter('Todos')
    setStatusFilter('disponivel')
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

          <div ref={headerRef} className="flex flex-col items-start gap-2 px-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-['Intel_One_Mono'] text-[32px] leading-[0.95] tracking-[0.01em] text-ink sm:text-[44px]">
                Shop_
              </h1>
              <p className="mt-2 max-w-[520px] font-['Inter'] text-[13px] text-ink/55 sm:text-[14px]">
                Obras disponiveis para venda, selecionadas para colecionadores e projetos especiais.
              </p>
            </div>
            <div ref={countRef} className="flex items-baseline gap-1">
              <span className="font-['Intel_One_Mono'] text-[32px] leading-none text-ink/14 sm:text-[44px]">
                {String(filtered.length).padStart(2, '0')}
              </span>
              <span className="mb-1 font-['Inter'] text-[10px] text-ink/28">obras</span>
            </div>
          </div>

          <div
            ref={filterBarRef}
            className="flex flex-wrap items-center gap-3 rounded-[16px] border border-border/20 bg-surface-3 px-4 py-3.5 sm:px-5"
          >
            <span className="font-['Intel_One_Mono'] text-[8.5px] uppercase tracking-[0.28em] text-ink/35 shrink-0">
              Filtrar
            </span>
            <div className="h-5 w-px bg-border/20" />

            <CustomSelect
              label="Ano"
              value={yearFilter}
              options={years}
              onChange={applyYear}
              active={yearFilter !== 'Todos'}
            />

            <CustomSelect
              label="Tecnica"
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
              label="Disponibilidade"
              value={statusFilter}
              options={statuses}
              onChange={applyStatus}
              active={statusFilter !== 'disponivel'}
              displayMap={STATUS_LABELS}
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-full border border-border/30 px-3 py-1.5 font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.16em] text-ink/45 transition hover:border-border/55 hover:text-ink/70"
              >
                <span>✕</span><span>Limpar</span>
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <div key={gridKey} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((artwork, i) => (
                <ShopArtworkCard
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
                Nenhuma obra disponivel
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
        </div>
      </div>
      <Footer id="contato" />
    </main>
  )
}

export default ShopPage
