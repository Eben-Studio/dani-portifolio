import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import gsap from 'gsap'
import ImageWithFallback from './ImageWithFallback'
import PortfolioHeader from './PortfolioHeader'
import Footer from './Footer'

const normalizeValue = (value) => String(value || '').trim().toLowerCase()

// ── Artwork Tile ──────────────────────────────────────────────────
function ArtworkTile({ artwork, heroImg, index, onSelect }) {
  const tileRef = useRef(null)
  const imgRef = useRef(null)
  const isCartao = normalizeValue(artwork?.artwork_type) === 'cartao'
  const subtitle = isCartao ? (artwork.size || 'Cartão') : (artwork.technique || 'Técnica')

  useEffect(() => {
    const tile = tileRef.current
    const img = imgRef.current
    if (!tile || !img) return

    gsap.fromTo(
      tile,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: (index % 3) * 0.07 },
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
          <ImageWithFallback
            src={artwork.image}
            alt={artwork.title}
            fallbackSrc={heroImg}
            className="h-full w-full object-cover"
            fallbackClassName="h-full w-full bg-[#D5C9A4]"
          />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-[#2A2002]/70 px-2.5 py-1 font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.14em] text-[#C8B789] backdrop-blur-sm">
          {artwork.year}
        </span>
      </div>
      <div className="border-t border-[#7F6A34]/12 bg-[#E8DCBA] px-4 py-4">
        <h3 className="font-['Intel_One_Mono'] text-[15px] leading-[1.1] text-[#2A2002]">{artwork.title}</h3>
        <p className="mt-0.5 font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.16em] text-[#7F6A34]/60">{subtitle}</p>
        {artwork.description && (
          <p className="mt-2.5 font-['Inter'] text-[12.5px] leading-[1.65] text-[#3A2B05]/60 line-clamp-2">{artwork.description}</p>
        )}
      </div>
    </article>
  )
}

// ── Main ──────────────────────────────────────────────────────────
function CollectionDetailPage({ collections = [], artworks = [], heroImg, logoImg, onArtworkSelect }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const [gridKey, setGridKey] = useState(0)

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

  const selectedCollection = useMemo(() => {
    if (!collectionsWithArtworks.length) return null
    return collectionsWithArtworks.find((collection) => collection.slug === slug) || null
  }, [collectionsWithArtworks, slug])

  const highlightArtwork = selectedCollection?.artworks?.[0]
  const highlightIsCartao = normalizeValue(highlightArtwork?.artwork_type) === 'cartao'
  const highlightTechnique = highlightIsCartao
    ? 'Cartão'
    : (highlightArtwork?.technique || 'Acrílica')
  const hasHighlightArtwork = Boolean(highlightArtwork)

  useEffect(() => {
    if (!selectedCollection) return
    setGridKey((key) => key + 1)

    const ctx = gsap.context(() => {
      gsap.from('.collection-detail-anim', {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
      })
    }, pageRef)

    return () => ctx.revert()
  }, [selectedCollection])

  if (!selectedCollection) {
    return (
      <main ref={pageRef} className="min-h-screen w-full bg-[#FFFCF4]">
        <div className="px-2 py-4 sm:px-4 lg:px-5">
          <div className="mx-auto w-full max-w-[1480px] space-y-4">
            <PortfolioHeader logoImg={logoImg} />
            <div className="flex flex-col items-center justify-center gap-3 rounded-[24px] bg-[#EDE4CC] py-24">
              <p className="font-['Intel_One_Mono'] text-[12px] uppercase tracking-[0.2em] text-[#2A2002]/35">
                Coleção não encontrada
              </p>
              <button
                type="button"
                onClick={() => navigate('/portifolio')}
                className="rounded-full border border-[#2A2002]/25 px-5 py-2.5 font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.16em] text-[#2A2002]/60 transition hover:border-[#2A2002]/45 hover:text-[#2A2002]"
              >
                Voltar ao portfólio
              </button>
            </div>
          </div>
        </div>
        <Footer id="contato" />
      </main>
    )
  }

  return (
    <main ref={pageRef} className="min-h-screen w-full bg-[#FFFCF4]">
      <div className="px-2 py-4 sm:px-4 lg:px-5">
        <div className="mx-auto w-full max-w-[1480px] space-y-4">
          <PortfolioHeader logoImg={logoImg} />

          <section className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-stretch collection-detail-anim">
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
                      { label: 'Técnica', value: highlightTechnique },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-[14px] border border-[#C8B789]/10 bg-[#FFFCF4]/4 px-4 py-3.5">
                        <p className="font-['Intel_One_Mono'] text-[12px] uppercase tracking-[0.22em] text-[#2A2002]/35">{stat.label}</p>
                        <p className="mt-1.5 font-['Intel_One_Mono'] text-[18px] text-[#2A2002]/80">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/#contato"
                    className="inline-flex items-center gap-2 rounded-full bg-[#C8B789] px-5 py-3 font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.16em] text-[#2A2002] transition hover:bg-[#D5C9A4]"
                  >
                    Encomende a sua
                  </Link>
                  <button
                    type="button"
                    onClick={() => navigate('/portifolio')}
                    className="inline-flex items-center rounded-full border border-[#2A2002]/18 px-5 py-3 font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.16em] text-[#2A2002]/55 transition hover:border-[#2A2002]/35 hover:text-[#2A2002]/80"
                  >
                    Ver todas
                  </button>
                </div>
              </div>

              <div className="relative min-h-[260px] overflow-hidden rounded-[28px] border border-[#7F6A34]/12 bg-[#D5C9A4] shadow-[0_18px_48px_rgba(64,47,1,0.12)] sm:min-h-[360px]">
                {hasHighlightArtwork ? (
                  <>
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
                  </>
                ) : (
                  <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,252,244,0.9),rgba(213,201,164,0.95)_60%,rgba(200,183,137,0.98))] px-6 text-center">
                    <div className="max-w-[340px] space-y-3 rounded-[22px] border border-[#2A2002]/10 bg-[#FFFCF4]/55 px-6 py-8 backdrop-blur-sm">
                      <p className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.22em] text-[#2A2002]/45">
                        Coleção sem obras ainda
                      </p>
                      <h4 className="font-['Intel_One_Mono'] text-[24px] leading-[1] text-[#2A2002] sm:text-[30px]">
                        {selectedCollection.name}
                      </h4>
                      <p className="font-['Inter'] text-[13px] leading-[1.6] text-[#2A2002]/70">
                        Em breve esta coleção vai receber novas peças. Por enquanto, a apresentação da página
                        fica focada no nome, na tagline e na descrição.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 collection-detail-anim">
              <div className="flex items-end justify-between px-1 pt-1">
                <div>
                  <h3 className="font-['Intel_One_Mono'] text-[22px] leading-[0.96] text-[#2A2002] sm:text-[28px]">
                    Obras da coleção_
                  </h3>
                </div>

                <span className="font-['Intel_One_Mono'] text-[9.5px] uppercase tracking-[0.18em] text-[#7F6A34]/55">
                  {selectedCollection.artworks.length} {selectedCollection.artworks.length === 1 ? 'obra' : 'obras'}
                </span>
              </div>

              {selectedCollection.artworks.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-[20px] bg-[#EDE4CC] py-16">
                  <p className="font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.2em] text-[#2A2002]/30">
                    Obras em breve
                  </p>
                </div>
              ) : (
                <div key={gridKey} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {selectedCollection.artworks.map((artwork, index) => (
                    <ArtworkTile
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
          </section>
        </div>
      </div>
      <Footer id="contato" />
    </main>
  )
}

export default CollectionDetailPage
