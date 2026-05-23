import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import ImageWithFallback from './ImageWithFallback'
import PortfolioHeader from './PortfolioHeader'
import Footer from './Footer'
import CustomSelect from './CustomSelect'

const normalizeValue = (value) => String(value || '').trim().toLowerCase()
const toYearNumber = (value) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

function CartaoCard({ artwork, heroImg, index, onSelect }) {
  const delay = `${(index % 3) * 70 + Math.floor(index / 3) * 40}ms`
  const metaParts = [artwork.year, artwork.size, artwork.partner_name].filter(Boolean)
  const metaText = metaParts.length ? metaParts.slice(0, 2).join(' · ') : 'Detalhes disponiveis'

  return (
    <article
      onClick={() => onSelect?.(artwork)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[22px] border border-border/12 bg-surface-4 shadow-[0_4px_18px_rgba(var(--color-accent-strong),0.07)] transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(var(--color-accent-strong),0.13)]"
      style={{
        opacity: 0,
        animation: `cardReveal 0.55s cubic-bezier(0.22,1,0.36,1) forwards`,
        animationDelay: delay,
      }}
    >
      <div className="relative h-[260px] overflow-hidden bg-surface-6">
        <div className="h-full w-full transition duration-700 ease-out group-hover:scale-[1.05]">
          <ImageWithFallback
            src={artwork.image}
            fallbackSrc={heroImg}
            alt={artwork.title || 'Cartão'}
            className="h-full w-full object-cover"
            fallbackClassName="h-full w-full bg-surface-5"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(to top, rgba(var(--color-ink),0.82) 0%, rgba(var(--color-ink),0.35) 45%, rgba(var(--color-ink),0.0) 75%)',
          }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/72 px-2.5 py-1 font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
          Cartão
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-accent px-3 py-1 font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.14em] text-ink opacity-0 transition duration-300 group-hover:opacity-100">
          Ver detalhes →
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/15 bg-surface-8 px-4 py-3.5">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate font-['Intel_One_Mono'] text-[13px] leading-[1.2] text-ink">
            {artwork.title || 'Cartão sem título'}
          </p>
          <p className="font-['Inter'] text-[11px] text-ink-muted/55">
            {metaText}
          </p>
        </div>
        <span className="shrink-0 text-border/45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-ink/60">
          →
        </span>
      </div>
    </article>
  )
}

function CartoesPage({ artworks = [], heroImg, logoImg, onArtworkSelect }) {
  const pageRef = useRef(null)
  const headerRef = useRef(null)
  const filterBarRef = useRef(null)
  const countRef = useRef(null)
  const [yearFilter, setYearFilter] = useState('Todos')
  const [sizeFilter, setSizeFilter] = useState('Todos')
  const [clienteFilter, setClienteFilter] = useState('Todos')
  const [collectionFilter, setCollectionFilter] = useState('Todos')
  const [sortBy, setSortBy] = useState('recente')
  const [gridKey, setGridKey] = useState(0)

  const cartoes = useMemo(
    () => artworks.filter((artwork) => normalizeValue(artwork.artwork_type) === 'cartao'),
    [artworks],
  )

  const years = useMemo(() => {
    const values = cartoes.map((artwork) => artwork.year).filter((year) => year)
    const unique = Array.from(new Set(values.map((year) => String(year))))
    return ['Todos', ...unique.sort((a, b) => Number(b) - Number(a))]
  }, [cartoes])

  const sizes = useMemo(() => {
    const values = cartoes.map((artwork) => artwork.size).filter((size) => size)
    return ['Todos', ...Array.from(new Set(values))]
  }, [cartoes])

  const clientes = useMemo(() => {
    const values = cartoes.map((artwork) => artwork.partner_name).filter((client) => client)
    return ['Todos', ...Array.from(new Set(values))]
  }, [cartoes])

  const collections = useMemo(() => {
    const values = cartoes.map((artwork) => artwork.collection_name).filter((collection) => collection)
    return ['Todos', ...Array.from(new Set(values))]
  }, [cartoes])

  const filteredCartoes = useMemo(() => {
    let list = cartoes.filter((artwork) => {
      if (yearFilter !== 'Todos' && String(artwork.year) !== String(yearFilter)) return false
      if (sizeFilter !== 'Todos' && String(artwork.size || '') !== String(sizeFilter)) return false
      if (clienteFilter !== 'Todos' && normalizeValue(artwork.partner_name) !== normalizeValue(clienteFilter)) return false
      if (collectionFilter !== 'Todos' && normalizeValue(artwork.collection_name) !== normalizeValue(collectionFilter)) return false
      return true
    })

    list = [...list].sort((a, b) => {
      const diff = toYearNumber(b.year) - toYearNumber(a.year)
      return sortBy === 'recente' ? diff : -diff
    })

    return list
  }, [cartoes, yearFilter, sizeFilter, clienteFilter, collectionFilter, sortBy])

  const hasActiveFilters =
    yearFilter !== 'Todos' ||
    sizeFilter !== 'Todos' ||
    clienteFilter !== 'Todos' ||
    collectionFilter !== 'Todos' ||
    sortBy !== 'recente'

  const bumpGrid = () => setGridKey((key) => key + 1)

  const applyYear = (value) => { setYearFilter(value); bumpGrid() }
  const applySize = (value) => { setSizeFilter(value); bumpGrid() }
  const applyCliente = (value) => { setClienteFilter(value); bumpGrid() }
  const applyCollection = (value) => { setCollectionFilter(value); bumpGrid() }
  const applySort = (value) => { setSortBy(value); bumpGrid() }

  const clearFilters = () => {
    setYearFilter('Todos')
    setSizeFilter('Todos')
    setClienteFilter('Todos')
    setCollectionFilter('Todos')
    setSortBy('recente')
    bumpGrid()
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([headerRef.current, filterBarRef.current, countRef.current], {
        opacity: 0,
        y: 16,
        duration: 0.65,
        stagger: 0.12,
        ease: 'expo.out',
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!countRef.current) return
    gsap.fromTo(countRef.current, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' })
  }, [filteredCartoes.length])

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
            <div className="space-y-1">
              <h1 className="font-['Intel_One_Mono'] text-[32px] leading-[0.95] tracking-[0.01em] text-ink sm:text-[44px]">
                Cartões_
              </h1>
              <p className="font-['Inter'] text-[12px] text-ink/45 sm:text-[13px]">
                Informações essenciais à vista. Para mais detalhes, clique em um cartão.
              </p>
            </div>
            <div ref={countRef} className="flex items-baseline gap-1">
              <span className="font-['Intel_One_Mono'] text-[30px] leading-none text-ink/14 sm:text-[40px]">
                {String(filteredCartoes.length).padStart(2, '0')}
              </span>
              <span className="mb-1 font-['Inter'] text-[10px] text-ink/28">cartões</span>
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
              label="Tamanho"
              value={sizeFilter}
              options={sizes}
              onChange={applySize}
              active={sizeFilter !== 'Todos'}
            />

            <CustomSelect
              label="Cliente"
              value={clienteFilter}
              options={clientes}
              onChange={applyCliente}
              active={clienteFilter !== 'Todos'}
            />

            <CustomSelect
              label="Coleção"
              value={collectionFilter}
              options={collections}
              onChange={applyCollection}
              active={collectionFilter !== 'Todos'}
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

            <div className="flex-1" />

            <div className="flex items-center gap-1 rounded-full border border-border/20 bg-canvas/60 p-1">
              {[
                { key: 'recente', label: 'Recente' },
                { key: 'antigo', label: 'Antigo' },
              ].map((sortOption) => (
                <button
                  key={sortOption.key}
                  type="button"
                  onClick={() => applySort(sortOption.key)}
                  className={[
                    "rounded-full px-3.5 py-1.5 font-['Intel_One_Mono'] text-[9.5px] uppercase tracking-[0.12em] transition-all duration-200",
                    sortBy === sortOption.key
                      ? 'bg-ink text-accent shadow-sm'
                      : 'text-ink/38 hover:text-ink/65',
                  ].join(' ')}
                >
                  {sortOption.label}
                </button>
              ))}
            </div>
          </div>

          {filteredCartoes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-[24px] bg-surface-3 py-20">
              <p className="font-['Intel_One_Mono'] text-[12px] uppercase tracking-[0.2em] text-ink/30">
                Nenhum cartão disponível
              </p>
            </div>
          ) : (
            <div key={gridKey} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCartoes.map((artwork, index) => (
                <CartaoCard
                  key={artwork.id}
                  artwork={artwork}
                  heroImg={heroImg}
                  index={index}
                  onSelect={onArtworkSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer id="contato" />
    </main>
  )
}

export default CartoesPage
