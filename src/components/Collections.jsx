import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ImageWithFallback from './ImageWithFallback'
import PortfolioHeader from './PortfolioHeader'
import Footer from './Footer'
import CustomSelect from './CustomSelect'

gsap.registerPlugin(ScrollTrigger)


// ── Collection Card (list view) ───────────────────────────────────
function CollectionCard({ collection, artworks, heroImg, onOpen, index }) {
  const img0Ref = useRef(null)
  const img1Ref = useRef(null)
  const img2Ref = useRef(null)

  const years = (artworks || []).map(a => a?.year).filter(Boolean)
  let yearLabel = ''
  if (years.length > 0) {
    const minY = Math.min(...years)
    const maxY = Math.max(...years)
    yearLabel = minY === maxY ? String(minY) : `${minY}–${maxY}`
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

  const p0 = artworks[0]
  const p1 = artworks[1] || artworks[0]
  const p2 = artworks[2] || artworks[0]

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
      {/* GRID PADRONIZADO */}
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1.5 p-2">

        {/* IMAGEM PRINCIPAL */}
        <div className="relative col-span-1 row-span-2 overflow-hidden rounded-[18px] bg-[#D5C9A4]">
          <div ref={img0Ref} className="h-full w-full">
            <ImageWithFallback
              src={p0?.image}
              alt={p0?.title || collection.name}
              fallbackSrc={heroImg}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* OVERLAY */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2A2002]/70 via-[#2A2002]/20 to-transparent" />

          {/* TEXTO FIXO */}
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

        {/* IMAGENS MENORES */}
        {[{ ref: img1Ref, art: p1 }, { ref: img2Ref, art: p2 }].map(({ ref, art }, i) => (
          <div
            key={i}
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

      {/* BADGE */}
      <div className="absolute top-4 right-4 rounded-full bg-[#2A2002]/70 px-2.5 py-1 backdrop-blur-sm">
        <span className="font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.14em] text-[#C8B789]">
          {artworks.length} obras
        </span>
      </div>
    </button>
  )
}

// ── Artwork Tile ──────────────────────────────────────────────────
function ArtworkTile({ artwork, heroImg, index, onSelect }) {
  const tileRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const tile = tileRef.current
    const img = imgRef.current
    if (!tile || !img) return

    gsap.fromTo(
      tile,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: (index % 3) * 0.07 }
    )

    const onEnter = () => gsap.to(img, { scale: 1.06, duration: 0.5, ease: 'power2.out' })
    const onLeave = () => gsap.to(img, { scale: 1, duration: 0.45, ease: 'power2.inOut' })
    tile.addEventListener('mouseenter', onEnter)
    tile.addEventListener('mouseleave', onLeave)
    return () => {
      tile.removeEventListener('mouseenter', onEnter)
      tile.removeEventListener('mouseleave', onLeave)
    }
  }, [index])

  return (
    <article
      ref={tileRef}
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(artwork)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect?.(artwork)
        }
      }}
      className="group cursor-pointer overflow-hidden rounded-[20px] border border-[#7F6A34]/12 bg-[#F0E8D2] shadow-[0_6px_22px_rgba(64,47,1,0.07)]"
    >
      <div className="relative h-[220px] overflow-hidden bg-[#DDD0AD] sm:h-[270px]">
        <div ref={imgRef} className="h-full w-full">
          <ImageWithFallback src={artwork.image} alt={artwork.title} fallbackSrc={heroImg}
            className="h-full w-full object-cover" fallbackClassName="h-full w-full bg-[#D5C9A4]" />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-[#2A2002]/70 px-2.5 py-1 font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.14em] text-[#C8B789] backdrop-blur-sm">
          {artwork.year}
        </span>
      </div>
      <div className="border-t border-[#7F6A34]/12 bg-[#E8DCBA] px-4 py-4">
        <h3 className="font-['Intel_One_Mono'] text-[15px] leading-[1.1] text-[#2A2002]">{artwork.title}</h3>
        <p className="mt-0.5 font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.16em] text-[#7F6A34]/60">{artwork.technique}</p>
        {artwork.description && (
          <p className="mt-2.5 font-['Inter'] text-[12.5px] leading-[1.65] text-[#3A2B05]/60 line-clamp-2">{artwork.description}</p>
        )}
      </div>
    </article>
  )
}

// ── Main ──────────────────────────────────────────────────────────
function Collections({ collections = [], artworks = [], heroImg, logoImg, onArtworkSelect }) {
  const pageRef = useRef(null)
  const heroTextRef = useRef(null)
  const detailRef = useRef(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [listYearFilter, setListYearFilter] = useState('Todos')
  const [listTechniqueFilter, setListTechniqueFilter] = useState('Todos')
  const [listGridKey, setListGridKey] = useState(0)
  const [detailGridKey, setDetailGridKey] = useState(0)

  const selectedSlug = searchParams.get('colecao') || ''

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
    [collections, artworksByCollection]
  )

  const selectedCollection = useMemo(() => {
    if (!collectionsWithArtworks.length) return null
    return collectionsWithArtworks.find((c) => c.slug === selectedSlug) || null
  }, [collectionsWithArtworks, selectedSlug])

  useEffect(() => {
    if (!selectedCollection) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDetailGridKey((k) => k + 1)
  }, [selectedCollection])

  // Filters for selected collection (computed only when viewing a collection)

  const filteredCollectionArtworks = useMemo(() => {
    if (!selectedCollection) return []
    return selectedCollection.artworks.slice()
  }, [selectedCollection])

  // Global filters for the collections list (when viewing all collections)
  const allYears = useMemo(() => {
    const values = artworks.map((a) => a.year).filter((year) => year)
    const unique = Array.from(new Set(values.map((year) => String(year))))
    return ['Todos', ...unique.sort((a, b) => Number(b) - Number(a))]
  }, [artworks])
  const allTechniques = useMemo(() => {
    const values = artworks.map((a) => a.technique).filter((technique) => technique)
    return ['Todos', ...Array.from(new Set(values))]
  }, [artworks])

  // Collections adjusted by global filters: each collection keeps only artworks matching the filters
  const collectionsToShow = useMemo(() => {
    const hasFilters = listYearFilter !== 'Todos' || listTechniqueFilter !== 'Todos'
    return collectionsWithArtworks.map((col) => {
      const filtered = col.artworks.filter((a) => {
        if (listYearFilter !== 'Todos' && a.year !== listYearFilter) return false
        if (listTechniqueFilter !== 'Todos' && a.technique !== listTechniqueFilter) return false
        return true
      })
      return { ...col, artworks: filtered }
    }).filter((collection) => (hasFilters ? collection.artworks.length > 0 : true))
  }, [collectionsWithArtworks, listYearFilter, listTechniqueFilter])

  useEffect(() => {
  if (!selectedCollection) return

  const ctx = gsap.context(() => {
    const tl = gsap.timeline()

    // container geral
    tl.from('.collection-anim', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
    })

    // imagem destaque com zoom suave
    tl.from('.collection-image', {
      scale: 1.08,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    }, "-=0.6")

    // artworks grid
    tl.from('.artwork-item', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
    }, "-=0.5")

  }, pageRef)

  return () => ctx.revert()
}, [selectedCollection])

  const openCollection = (slug) => {
    const params = new URLSearchParams()
    params.set('colecao', slug)
    navigate({ pathname: '/colecoes', search: params.toString() })
  }

  const backToCollections = () => navigate('/colecoes')

  return (
    <main ref={pageRef} className="min-h-screen w-full bg-[#FFFCF4]">
      <style>{`
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="px-2 py-4 sm:px-4 lg:px-5">
        <div className="mx-auto w-full max-w-[1480px] space-y-4">
          <PortfolioHeader logoImg={logoImg} />

          {/* ── Hero ─────────────────────────────────── */}
          {!selectedCollection && (
            <section className="relative overflow-hidden rounded-[32px] border border-[#7F6A34]/20 bg-[#EDE4CC]  px-7 py-10 shadow-[0_28px_64px_rgba(42,32,2,0.18)] sm:px-10 sm:py-12">
              <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[#C8B789]/8 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 left-0 h-48 w-48 rounded-full bg-[#EDE4CC]/10 blur-3xl" />

              <div ref={heroTextRef} className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-col gap-4">
                  <span className="anim inline-flex items-center gap-2 self-start rounded-full border border-[#C8B789]/18 bg-[#C8B789]/8 px-3.5 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C8B789]" />
                    <span className="font-['Intel_One_Mono'] text-[9.5px] uppercase tracking-[0.24em] text-[#2A2002]/60">Coleções</span>
                  </span>
                  <h1 className="anim max-w-[680px] font-['Intel_One_Mono'] text-[36px] leading-[0.94] tracking-[0.01em] text-[#2A2002] sm:text-[52px] lg:text-[58px]">
                    Conjuntos que contam histórias_
                  </h1>
                  <p className="anim max-w-[52ch] font-['Inter'] text-[14px] leading-[1.8] text-[#2A2002]/65 sm:text-[15px]">
                    Obras reunidas por afinidade de cor, gesto e intenção. Cada coleção é uma narrativa completa — um mundo com começo, meio e continuidade.
                  </p>
                </div>
                <div className="anim shrink-0 self-end">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-['Intel_One_Mono'] text-[56px] leading-none text-[#7F6A34]/12">{String(collectionsWithArtworks.length).padStart(2, '0')}</span>
                    <span className="mb-1 font-['Inter'] text-[10px] text-[#2A2002]/28">coleções</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── List ─────────────────────────────────── */}
          {!selectedCollection ? (
            <>
              {/* Filter bar for collections listing */}
              <div className="mb-3 flex flex-wrap items-center gap-3 rounded-[16px] border border-[#7F6A34]/20 bg-[#EDE4CC] px-5 py-3.5">
                <span className="font-['Intel_One_Mono'] text-[12.5px] uppercase tracking-[0.28em] text-[#2A2002]/35 shrink-0">Filtrar</span>
                <div className="h-5 w-px bg-[#7F6A34]/20" />
                <CustomSelect label="Ano" value={listYearFilter} options={allYears} onChange={(v) => { setListYearFilter(v); setListGridKey(k => k + 1) }} active={listYearFilter !== 'Todos'} />
                <CustomSelect label="Técnica" value={listTechniqueFilter} options={allTechniques} onChange={(v) => { setListTechniqueFilter(v); setListGridKey(k => k + 1) }} active={listTechniqueFilter !== 'Todos'} />
                <div className="flex-1" />
                <button type="button" onClick={() => { setListYearFilter('Todos'); setListTechniqueFilter('Todos'); setListGridKey(k => k + 1) }} className=" font-['Intel_One_Mono'] rounded-full border px-3 py-1">Limpar</button>
              </div>

              <section key={listGridKey} className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
                {collectionsToShow.map((col, i) => (
                  <CollectionCard key={col.id || col.slug} collection={col} artworks={col.artworks}
                    heroImg={heroImg} index={i} onOpen={() => openCollection(col.slug)} />
                ))}
              </section>
            </>
          ) : (

            /* ── Detail ──────────────────────────────── */
            <section ref={detailRef} className="space-y-4">

              {/* Info + image */}
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-stretch">

                {/* Left: dark info panel */}
                <div className="flex flex-col justify-between gap-6 rounded-[28px] bg-[#EDE4CC] p-7 shadow-[0_16px_44px_rgba(42,32,2,0.16)] sm:p-9">
                  <div className="flex flex-col gap-5">

                    <div>
                      <p className="font-['Intel_One_Mono'] text-[12px] uppercase tracking-[0.26em] text-[#2A2002]">Coleção</p>
                      <h2 className="mt-1.5 font-['Intel_One_Mono'] text-[34px] leading-[0.94] text-[#2A2002] sm:text-[46px]">
                        {selectedCollection.name}
                      </h2>
                      <p className="mt-1 font-['Intel_One_Mono'] text-[12px] uppercase tracking-[0.2em] text-[#2A2002]">
                        {selectedCollection.tagline}
                      </p>
                      <p className="mt-4 max-w-[50ch] font-['Inter'] text-[14px] leading-[1.8] text-[#2A2002]">
                                              {selectedCollection.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Obras', value: selectedCollection.artworks.length },
                        { label: 'Técnica', value: selectedCollection.artworks[0]?.technique || 'Acrílica' },
                      ].map((s) => (
                        <div key={s.label} className="rounded-[14px] border border-[#C8B789]/10 bg-[#FFFCF4]/4 px-4 py-3.5">
                          <p className="font-['Intel_One_Mono'] text-[12px] uppercase tracking-[0.22em] text-[#2A2002]/35">{s.label}</p>
                          <p className="mt-1.5 font-['Intel_One_Mono'] text-[18px] text-[#2A2002]/80">{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link to="/#contato"
                      className="inline-flex items-center gap-2 rounded-full bg-[#C8B789] px-5 py-3 font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.16em] text-[#2A2002] transition hover:bg-[#D5C9A4]">
                      Encomende a sua
                    </Link>
                    <button type="button" onClick={backToCollections}
                      className="inline-flex items-center rounded-full border border-[#2A2002]/18 px-5 py-3 font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.16em] text-[#2A2002]/55 transition hover:border-[#2A2002]/35 hover:text-[#2A2002]/80">
                      Ver todas
                    </button>
                  </div>
                </div>

                {/* Right: featured image */}
                <div className="relative min-h-[260px] overflow-hidden rounded-[28px] border border-[#7F6A34]/12 bg-[#D5C9A4] shadow-[0_18px_48px_rgba(64,47,1,0.12)] sm:min-h-[360px]">
                  <ImageWithFallback
                    src={selectedCollection.artworks[0]?.image}
                    alt={selectedCollection.name}
                    fallbackSrc={heroImg}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    fallbackClassName="absolute inset-0 h-full w-full bg-[#D5C9A4]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#C8B789]/40 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 rounded-[14px] border border-[#C8B789]/14 bg-[#EDE4CC]/45 px-4 py-3.5 backdrop-blur-sm">
                    <p className="font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#2A2002]">Destaque</p>
                    <p className="mt-0.5 font-['Inter'] text-[13.5px] leading-[1.5] text-[#2A2002]">
                      {selectedCollection.artworks[0]?.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Artworks */}
              <div className="space-y-3">
                <div className="flex items-end justify-between px-1 pt-1">
                  <div>
                    <h3 className="font-['Intel_One_Mono'] text-[22px] leading-[0.96] text-[#2A2002] sm:text-[28px]">
                      Obras da coleção_
                    </h3>
                    <div className="mt-2 flex gap-2 text-sm">

                    </div>
                  </div>

                  <span className="font-['Intel_One_Mono'] text-[9.5px] uppercase tracking-[0.18em] text-[#7F6A34]/55">
                    {filteredCollectionArtworks.length} {filteredCollectionArtworks.length === 1 ? 'obra' : 'obras'}
                  </span>
                </div>

                {filteredCollectionArtworks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-[20px] bg-[#EDE4CC] py-16">
                    <p className="font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.2em] text-[#2A2002]/30">
                      Obras em breve
                    </p>
                  </div>
                ) : (
                  <div key={detailGridKey} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredCollectionArtworks.map((artwork, i) => (
                      <ArtworkTile
                        key={artwork.id}
                        artwork={artwork}
                        heroImg={heroImg}
                        index={i}
                        onSelect={onArtworkSelect}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

        </div>
      </div>
      <Footer id="contato" />
    </main>
  )
}

export default Collections
