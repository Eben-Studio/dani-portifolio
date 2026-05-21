import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import ImageWithFallback from './ImageWithFallback'
import PortfolioHeader from './PortfolioHeader'
import Footer from './Footer'
import CustomSelect from './CustomSelect'
import Pagination from './ui/pagination'

const PAGE_SIZE = 6

const TYPE_OPTIONS = ['Todos', 'Coleções', 'Obras']
const AVAILABILITY_OPTIONS = ['Todos', 'disponivel', 'vendido']
const AVAILABILITY_LABELS = {
  disponivel: 'Disponível',
  vendido: 'Vendida',
}

const CATEGORY_LABELS = {
  residencial: 'Residencial',
  corporativo: 'Corporativo',
  collab: 'Collab',
  exposicao: 'Exposição',
}

const normalizeValue = (value) => String(value || '').trim().toLowerCase()
const toYearNumber = (value) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

// ── Artwork Card ─────────────────────────────────────────────────
function ArtworkCard({ artwork, heroImg, index, onSelect }) {
  const imgRef = useRef(null)
  const delay = `${(index % 3) * 70 + Math.floor(index / 3) * 40}ms`

  const onEnter = useCallback(() => {
    gsap.to(imgRef.current, { scale: 1.07, duration: 0.55, ease: 'power2.out' })
  }, [])

  const onLeave = useCallback(() => {
    gsap.to(imgRef.current, { scale: 1, duration: 0.5, ease: 'power2.inOut' })
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
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/15 bg-surface-8 px-4 py-3.5">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate font-['Intel_One_Mono'] text-[13px] leading-[1.2] text-ink">{artwork.title}</p>
          <p className="font-['Inter'] text-[11px] text-ink-muted/55">{artwork.year}</p>
        </div>
        <span className="shrink-0 text-border/45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-ink/60">
          →
        </span>
      </div>
    </article>
  )
}

// ── Collection Card ──────────────────────────────────────────────
function CollectionCard({ collection, artworks, heroImg, onOpen, index }) {
  const img0Ref = useRef(null)
  const img1Ref = useRef(null)
  const img2Ref = useRef(null)

  const years = (artworks || []).map((artwork) => artwork?.year).filter(Boolean)
  let yearLabel = ''
  if (years.length > 0) {
    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)
    yearLabel = minYear === maxYear ? String(minYear) : `${minYear}–${maxYear}`
  }

  const onEnter = () => {
    gsap.to([img0Ref.current, img1Ref.current, img2Ref.current].filter(Boolean), {
      scale: 1.05,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.03,
    })
  }

  const onLeave = () => {
    gsap.to([img0Ref.current, img1Ref.current, img2Ref.current].filter(Boolean), {
      scale: 1,
      duration: 0.5,
      ease: 'power2.inOut',
    })
  }

  const primary = artworks[0]
  const secondary = artworks[1] || artworks[0]
  const tertiary = artworks[2] || artworks[0]

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative w-full aspect-square overflow-hidden rounded-[28px] border border-[#7F6A34]/14 bg-[#F0E8D2] shadow-[0_10px_36px_rgba(64,47,1,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(64,47,1,0.14)]"
      style={{
        opacity: 0,
        animation: 'revealUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        animationDelay: `${index * 90}ms`,
      }}
    >
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1.5 p-2">
        <div className="relative col-span-1 row-span-2 overflow-hidden rounded-[18px] bg-[#D5C9A4]">
          <div ref={img0Ref} className="h-full w-full">
            <ImageWithFallback
              src={primary?.image}
              alt={primary?.title || collection.name}
              fallbackSrc={heroImg}
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2A2002]/70 via-[#2A2002]/20 to-transparent" />

          <div className="absolute inset-x-4 bottom-4 text-left text-white flex flex-col items-start">
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#C8B789]/70">
              Coleção
            </span>

            <h3 className="font-['Intel_One_Mono'] text-[18px] leading-tight line-clamp-2">
              {collection.name}
            </h3>

            {yearLabel && (
              <span className="text-[11px] text-white/80">
                {yearLabel}
              </span>
            )}

            <p className="text-[11px] text-white/70 line-clamp-2 max-w-[80%]">
              {collection.tagline}
            </p>

            <span className="mt-2 inline-flex w-fit rounded-full bg-[#C8B789] px-3 py-1 text-[9px] uppercase tracking-[0.14em] text-[#2A2002]">
              Explorar
            </span>
          </div>
        </div>

        {[{ ref: img1Ref, art: secondary }, { ref: img2Ref, art: tertiary }].map(({ ref, art }, index2) => (
          <div
            key={index2}
            className="relative overflow-hidden rounded-[18px] bg-[#D5C9A4]"
          >
            <div ref={ref} className="h-full w-full">
              <ImageWithFallback
                src={art?.image}
                alt={art?.title || ''}
                fallbackSrc={heroImg}
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2A2002]/30 to-transparent" />
          </div>
        ))}
      </div>

      <div className="absolute top-4 right-4 rounded-full bg-[#2A2002]/70 px-2.5 py-1 backdrop-blur-sm">
        <span className="font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.14em] text-[#C8B789]">
          {artworks.length} obras
        </span>
      </div>
    </button>
  )
}

// ── Main ─────────────────────────────────────────────────────────
function PortfolioPage({ collections = [], artworks = [], heroImg, logoImg, onArtworkSelect }) {
  const [typeFilter, setTypeFilter] = useState('Todos')
  const [yearFilter, setYearFilter] = useState('Todos')
  const [techniqueFilter, setTechniqueFilter] = useState('Todos')
  const [categoryFilter, setCategoryFilter] = useState('Todos')
  const [availabilityFilter, setAvailabilityFilter] = useState('Todos')
  const [sortBy, setSortBy] = useState('recente')

  const [collectionsPage, setCollectionsPage] = useState(1)
  const [artworksPage, setArtworksPage] = useState(1)
  const [collectionsGridKey, setCollectionsGridKey] = useState(0)
  const [artworksGridKey, setArtworksGridKey] = useState(0)

  const pageRef = useRef(null)
  const headerRef = useRef(null)
  const filterBarRef = useRef(null)
  const countsRef = useRef(null)

  const navigate = useNavigate()

  const years = useMemo(() => {
    const values = artworks.map((artwork) => artwork.year).filter((year) => year)
    const unique = Array.from(new Set(values.map((year) => String(year))))
    return ['Todos', ...unique.sort((a, b) => Number(b) - Number(a))]
  }, [artworks])

  const techniques = useMemo(() => {
    const values = artworks.map((artwork) => artwork.technique).filter((technique) => technique)
    return ['Todos', ...Array.from(new Set(values))]
  }, [artworks])

  const categories = useMemo(() => {
    const values = artworks.map((artwork) => normalizeValue(artwork.category)).filter((category) => category)
    return ['Todos', ...Array.from(new Set(values))]
  }, [artworks])

  const matchesFilters = useCallback((artwork) => {
    if (yearFilter !== 'Todos' && String(artwork.year) !== String(yearFilter)) return false
    if (techniqueFilter !== 'Todos' && artwork.technique !== techniqueFilter) return false
    if (categoryFilter !== 'Todos' && normalizeValue(artwork.category) !== categoryFilter) return false
    if (availabilityFilter !== 'Todos' && normalizeValue(artwork.sale_status) !== availabilityFilter) return false
    return true
  }, [yearFilter, techniqueFilter, categoryFilter, availabilityFilter])

  const filteredArtworks = useMemo(() => {
    let list = artworks.filter(matchesFilters)
    if (sortBy === 'recente') list = [...list].sort((a, b) => toYearNumber(b.year) - toYearNumber(a.year))
    if (sortBy === 'antigo') list = [...list].sort((a, b) => toYearNumber(a.year) - toYearNumber(b.year))
    return list
  }, [artworks, matchesFilters, sortBy])

  const artworksByCollection = useMemo(() => {
    const map = new Map()
    artworks.forEach((artwork) => {
      if (!artwork.collection_id) return
      const key = String(artwork.collection_id)
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(artwork)
    })
    return map
  }, [artworks])

  const collectionsWithArtworks = useMemo(
    () =>
      collections.map((collection) => ({
        ...collection,
        artworks: artworksByCollection.get(String(collection.id)) || [],
      })),
    [collections, artworksByCollection],
  )

  const hasContentFilters =
    yearFilter !== 'Todos' ||
    techniqueFilter !== 'Todos' ||
    categoryFilter !== 'Todos' ||
    availabilityFilter !== 'Todos'

  const filteredCollections = useMemo(() => {
    const list = collectionsWithArtworks
      .map((collection) => {
        const filtered = hasContentFilters ? collection.artworks.filter(matchesFilters) : collection.artworks
        return { ...collection, artworks: filtered }
      })
      .filter((collection) => (hasContentFilters ? collection.artworks.length > 0 : true))

    const sorted = [...list]
    sorted.sort((a, b) => {
      const aYears = a.artworks.map((artwork) => toYearNumber(artwork.year)).filter((year) => year > 0)
      const bYears = b.artworks.map((artwork) => toYearNumber(artwork.year)).filter((year) => year > 0)
      const aValue = aYears.length ? (sortBy === 'recente' ? Math.max(...aYears) : Math.min(...aYears)) : 0
      const bValue = bYears.length ? (sortBy === 'recente' ? Math.max(...bYears) : Math.min(...bYears)) : 0
      return sortBy === 'recente' ? bValue - aValue : aValue - bValue
    })

    return sorted
  }, [collectionsWithArtworks, hasContentFilters, matchesFilters, sortBy])

  const collectionsPageCount = Math.ceil(filteredCollections.length / PAGE_SIZE)
  const artworksPageCount = Math.ceil(filteredArtworks.length / PAGE_SIZE)

  useEffect(() => {
    if (collectionsPage > collectionsPageCount && collectionsPageCount > 0) {
      setCollectionsPage(collectionsPageCount)
    }
  }, [collectionsPage, collectionsPageCount])

  useEffect(() => {
    if (artworksPage > artworksPageCount && artworksPageCount > 0) {
      setArtworksPage(artworksPageCount)
    }
  }, [artworksPage, artworksPageCount])

  const pagedCollections = filteredCollections.slice((collectionsPage - 1) * PAGE_SIZE, collectionsPage * PAGE_SIZE)
  const pagedArtworks = filteredArtworks.slice((artworksPage - 1) * PAGE_SIZE, artworksPage * PAGE_SIZE)

  const hasActiveFilters =
    typeFilter !== 'Todos' ||
    yearFilter !== 'Todos' ||
    techniqueFilter !== 'Todos' ||
    categoryFilter !== 'Todos' ||
    availabilityFilter !== 'Todos' ||
    sortBy !== 'recente'

  const resetPages = () => {
    setCollectionsPage(1)
    setArtworksPage(1)
  }

  const bumpGrids = () => {
    setCollectionsGridKey((key) => key + 1)
    setArtworksGridKey((key) => key + 1)
  }

  const applyType = (value) => {
    setTypeFilter(value)
    resetPages()
    bumpGrids()
  }
  const applyYear = (value) => {
    setYearFilter(value)
    resetPages()
    bumpGrids()
  }
  const applyTechnique = (value) => {
    setTechniqueFilter(value)
    resetPages()
    bumpGrids()
  }
  const applyCategory = (value) => {
    setCategoryFilter(value)
    resetPages()
    bumpGrids()
  }
  const applyAvailability = (value) => {
    setAvailabilityFilter(value)
    if (value !== 'Todos') {
      setTypeFilter('Obras')
    }
    resetPages()
    bumpGrids()
  }
  const applySort = (value) => {
    setSortBy(value)
    resetPages()
    bumpGrids()
  }

  const clearFilters = () => {
    setTypeFilter('Todos')
    setYearFilter('Todos')
    setTechniqueFilter('Todos')
    setCategoryFilter('Todos')
    setAvailabilityFilter('Todos')
    setSortBy('recente')
    resetPages()
    bumpGrids()
  }

  const handleCollectionPageChange = (page) => {
    setCollectionsPage(page)
    setCollectionsGridKey((key) => key + 1)
  }

  const handleArtworksPageChange = (page) => {
    setArtworksPage(page)
    setArtworksGridKey((key) => key + 1)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([headerRef.current, filterBarRef.current], {
        opacity: 0,
        y: 16,
        duration: 0.65,
        stagger: 0.1,
        ease: 'expo.out',
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!countsRef.current) return
    gsap.fromTo(countsRef.current, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' })
  }, [filteredCollections.length, filteredArtworks.length])

  const openCollection = (slug) => {
    if (!slug) return
    navigate(`/colecao/${encodeURIComponent(slug)}`)
  }

  return (
    <main ref={pageRef} className="min-h-screen w-full bg-canvas">
      <style>{`
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="px-2 py-4 sm:px-4 lg:px-5">
        <div className="mx-auto w-full max-w-[1480px] space-y-4">
          <PortfolioHeader logoImg={logoImg} />

          <div ref={headerRef} className="flex flex-col items-start gap-2 px-1 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h1 className="font-['Intel_One_Mono'] text-[32px] leading-[0.95] tracking-[0.01em] text-ink sm:text-[44px]">
                Portfólio_
              </h1>
              <p className="font-['Inter'] text-[12px] text-ink/45 sm:text-[13px]">
                Coleções e obras reunidas em um único fluxo.
              </p>
            </div>
            <div ref={countsRef} className="flex items-baseline gap-6">
              <div className="flex items-baseline gap-1">
                <span className="font-['Intel_One_Mono'] text-[30px] leading-none text-ink/14 sm:text-[40px]">
                  {String(filteredCollections.length).padStart(2, '0')}
                </span>
                <span className="mb-1 font-['Inter'] text-[10px] text-ink/28">coleções</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-['Intel_One_Mono'] text-[30px] leading-none text-ink/14 sm:text-[40px]">
                  {String(filteredArtworks.length).padStart(2, '0')}
                </span>
                <span className="mb-1 font-['Inter'] text-[10px] text-ink/28">obras</span>
              </div>
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
              label="Tipo"
              value={typeFilter}
              options={TYPE_OPTIONS}
              onChange={applyType}
              active={typeFilter !== 'Todos'}
            />

            <CustomSelect
              label="Ano"
              value={yearFilter}
              options={years}
              onChange={applyYear}
              active={yearFilter !== 'Todos'}
            />

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
              label="Disponibilidade"
              value={availabilityFilter}
              options={AVAILABILITY_OPTIONS}
              onChange={applyAvailability}
              active={availabilityFilter !== 'Todos'}
              displayMap={AVAILABILITY_LABELS}
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

          {availabilityFilter === 'Todos' && typeFilter !== 'Obras' && (
            <section id="colecoes" className="space-y-3">
              <div className="flex items-end justify-between px-1 pt-1">
                <div>
                  <h2 className="font-['Intel_One_Mono'] text-[24px] leading-[0.96] text-ink sm:text-[30px]">
                    Coleções_
                  </h2>
                  <p className="mt-1 font-['Inter'] text-[12px] text-ink/45">
                    Conjuntos curados que agrupam obras por narrativa.
                  </p>
                </div>
                <span className="font-['Intel_One_Mono'] text-[9.5px] uppercase tracking-[0.18em] text-ink/45">
                  {filteredCollections.length} {filteredCollections.length === 1 ? 'coleção' : 'coleções'}
                </span>
              </div>

              {filteredCollections.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-[24px] bg-surface-3 py-20">
                  <p className="font-['Intel_One_Mono'] text-[12px] uppercase tracking-[0.2em] text-ink/30">
                    Nenhuma coleção encontrada
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-full border border-border/25 px-5 py-2.5 font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.16em] text-ink/50 transition hover:border-border/45 hover:text-ink/75"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <>
                  <div key={collectionsGridKey} className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {pagedCollections.map((collection, index) => (
                      <CollectionCard
                        key={collection.id || collection.slug}
                        collection={collection}
                        artworks={collection.artworks}
                        heroImg={heroImg}
                        index={index}
                        onOpen={() => openCollection(collection.slug)}
                      />
                    ))}
                  </div>
                  <Pagination
                    className="mt-4 w-full justify-end"
                    page={collectionsPage}
                    pageCount={collectionsPageCount}
                    onPageChange={handleCollectionPageChange}
                  />
                </>
              )}
            </section>
          )}

          {(availabilityFilter !== 'Todos' || typeFilter !== 'Coleções') && (
            <section id="obras" className="space-y-3">
              <div className="flex items-end justify-between px-1 pt-3">
                <div>
                  <h2 className="font-['Intel_One_Mono'] text-[24px] leading-[0.96] text-ink sm:text-[30px]">
                    Obras_
                  </h2>
                  <p className="mt-1 font-['Inter'] text-[12px] text-ink/45">
                    Obras individuais com detalhes e especificações.
                  </p>
                </div>
                <span className="font-['Intel_One_Mono'] text-[9.5px] uppercase tracking-[0.18em] text-ink/45">
                  {filteredArtworks.length} {filteredArtworks.length === 1 ? 'obra' : 'obras'}
                </span>
              </div>

              {filteredArtworks.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-[24px] bg-surface-3 py-20">
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
              ) : (
                <>
                  <div key={artworksGridKey} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pagedArtworks.map((artwork, index) => (
                      <ArtworkCard
                        key={artwork.id}
                        artwork={artwork}
                        heroImg={heroImg}
                        index={index}
                        onSelect={onArtworkSelect}
                      />
                    ))}
                  </div>
                  <Pagination
                    className="mt-4 w-full justify-end"
                    page={artworksPage}
                    pageCount={artworksPageCount}
                    onPageChange={handleArtworksPageChange}
                  />
                </>
              )}
            </section>
          )}
        </div>
      </div>
      <Footer id="contato" />
    </main>
  )
}

export default PortfolioPage
