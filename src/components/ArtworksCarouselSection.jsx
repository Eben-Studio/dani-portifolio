import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ImageWithFallback from './ImageWithFallback'

gsap.registerPlugin(ScrollTrigger)

const normalizeValue = (value) => String(value || '').trim().toLowerCase()

function ArtworksCarouselSection({ id, artworks = [], heroImg, onArtworkSelect }) {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const prevBtnRef = useRef(null)
  const nextBtnRef = useRef(null)

  const carouselArtworks = useMemo(
    () => artworks.filter((artwork) => normalizeValue(artwork.artwork_type) !== 'cartao'),
    [artworks],
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      })

      gsap.to([prevBtnRef.current, nextBtnRef.current], {
        opacity: 0.7,
        duration: 0.3,
        ease: 'none',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const loopedSlides = useMemo(() => {
    if (carouselArtworks.length < 2) {
      return carouselArtworks
    }

    const tail = carouselArtworks.slice(-2)
    const head = carouselArtworks.slice(0, 2)

    return [...tail, ...carouselArtworks, ...head]
  }, [carouselArtworks])

  const baseIndex = carouselArtworks.length < 2 ? 0 : 4
  const [currentIndex, setCurrentIndex] = useState(baseIndex)
  const [withTransition, setWithTransition] = useState(true)

  useEffect(() => {
    const nextIndex = carouselArtworks.length < 2 ? 0 : 4
    setWithTransition(false)
    setCurrentIndex(nextIndex)
    const resetId = requestAnimationFrame(() => setWithTransition(true))
    return () => cancelAnimationFrame(resetId)
  }, [carouselArtworks.length])

  const prev = () => {
    setWithTransition(true)
    setCurrentIndex((prevIndex) => prevIndex - 1)
  }

  const next = () => {
    setWithTransition(true)
    setCurrentIndex((prevIndex) => prevIndex + 1)
  }

  const handleTransitionEnd = () => {
    if (carouselArtworks.length < 2) {
      return
    }

    if (currentIndex === 0) {
      setWithTransition(false)
      setCurrentIndex(carouselArtworks.length)
      return
    }

    if (currentIndex === carouselArtworks.length + 2) {
      setWithTransition(false)
      setCurrentIndex(2)
    }
  }

  return (
    <section id={id} ref={sectionRef} className="mt-14 pb-6 sm:mt-14">
      <div
        ref={containerRef}
        className="relative mx-auto max-w-[1500px] px-4 sm:px-6 [--slide-basis:88%] sm:[--slide-basis:44%] [--slide-offset:6%]"
      >
        <div className="overflow-hidden">
          <div
            className={`flex w-full ${withTransition ? 'transition-transform duration-900 ease-[cubic-bezier(0.2,0.9,0.2,1)]' : ''}`}
            style={{ transform: `translateX(calc(-${currentIndex} * var(--slide-basis) + var(--slide-offset)))` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {loopedSlides.map((artwork, index) => (
              <article
                key={`${artwork.id}-${index}`}
                className="shrink-0 basis-[88%] px-1.5 sm:basis-[44%] sm:px-2"
              >
                <button
                  type="button"
                  onClick={() => onArtworkSelect?.(artwork)}
                  className="group relative block w-full overflow-hidden rounded-[18px] bg-transparent text-left transition duration-700 ease-out hover:-translate-y-1"
                  aria-label={`Abrir página de ${artwork.title}`}
                >
                  <ImageWithFallback
                    src={artwork.image}
                    alt={artwork.title}
                    fallbackSrc={heroImg}
                    className="h-[360px] w-full object-cover object-center transition duration-1000 ease-out group-hover:scale-[1.05] sm:h-[520px] lg:h-[700px]"
                    fallbackClassName="flex h-[360px] w-full items-center justify-center bg-[#D5C9A4] sm:h-[520px] lg:h-[700px]"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,252,244,0.1),transparent_42%),linear-gradient(to_top,rgba(34,24,4,0.38),rgba(34,24,4,0.01))] opacity-0 transition duration-700 group-hover:opacity-100" />

                  <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-[#FFFCF4]/30 bg-[#402F01]/45 px-3 py-1 font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.16em] text-[#FFFCF4] backdrop-blur-md transition duration-700 group-hover:bg-[#402F01]/70 sm:left-4 sm:top-4 sm:text-[11px]">
                    Ver obra
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-6 p-3 text-[#FFFCF4] opacity-0 transition duration-700 group-hover:translate-y-0 group-hover:opacity-100 sm:p-4">
                    <div className="mx-auto max-w-[88%] rounded-[12px] border border-white/12 bg-[#402F01]/50 px-3 py-2 backdrop-blur-md sm:px-4 sm:py-3">
                      <p className="font-['Intel_One_Mono'] text-[16px] leading-none sm:text-[18px]">
                        {artwork.title}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-['Inter'] text-[10px] uppercase leading-none tracking-[0.14em] text-[#FFFCF4]/82 sm:text-[11px]">
                        <span>{artwork.year}</span>
                        <span>{artwork.technique}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2">
          <button
            ref={prevBtnRef}
            type="button"
            onClick={prev}
            aria-label="Obra anterior"
            className="pointer-events-auto absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#7F6A34] bg-[#fffcf4eb] text-[#402F01] shadow-[0_10px_26px_rgba(64,47,1,0.12)] backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-[#FFFCF4] sm:left-4 sm:h-12 sm:w-12"
          >
            ←
          </button>
          <button
            ref={nextBtnRef}
            type="button"
            onClick={next}
            aria-label="Próxima obra"
            className="pointer-events-auto absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#7F6A34] bg-[#fffcf4eb] text-[#402F01] shadow-[0_10px_26px_rgba(64,47,1,0.12)] backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-[#FFFCF4] sm:right-4 sm:h-12 sm:w-12"
          >
            →
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 mt-6">
        <div className="flex items-center justify-end">
          <Link
            to="/portifolio"
            className="inline-flex items-center justify-center rounded-full bg-[#D5C9A4] px-5 py-3 font-['Intel_One_Mono'] text-[12px] uppercase tracking-[0.16em] text-[#402F01] transition duration-300 hover:bg-[#2F2200] hover:text-[#FFFCF4]"
          >
            Ver portfólio completo
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ArtworksCarouselSection
