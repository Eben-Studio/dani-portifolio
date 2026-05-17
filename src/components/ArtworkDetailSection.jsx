import { forwardRef, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ImageWithFallback from './ImageWithFallback'

const ArtworkDetailSection = forwardRef(function ArtworkDetailSection(
  { id, artwork, heroImg, pageMode = false, onBack },
  ref,
) {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const imageRef = useRef(null)
  const specRefs = useRef([])
  const ctaRef = useRef(null)
  const setSectionElement = (node) => {
    sectionRef.current = node

    if (typeof ref === 'function') {
      ref(node)
      return
    }

    if (ref) {
      ref.current = node
    }
  }

  useEffect(() => {
    if (!artwork) {
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
      )

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.06 },
      )

      gsap.fromTo(
        imageRef.current,
        { opacity: 0, y: 40, scale: 0.92, rotate: -1 },
        { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 1.1, ease: 'power4.out', delay: 0.1 },
      )

      gsap.fromTo(
        specRefs.current.filter(Boolean),
        { opacity: 0, y: 18, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.09,
          delay: 0.22,
        },
      )

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.34 },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [artwork])

  if (!artwork) {
    return null
  }

  const specs = [
    { label: 'Nome da obra', value: artwork.title },
    { label: 'Tamanho', value: artwork.size },
    { label: 'Técnica', value: artwork.technique },
    { label: 'Ano', value: artwork.year },
  ]

  return (
    <section id={id} ref={setSectionElement} className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1480px]">
        <div className={`relative overflow-hidden rounded-[34px] border border-[#2A2002]/15 bg-[linear-gradient(135deg,rgba(255,252,244,0.96)_0%,rgba(247,233,195,0.9)_48%,rgba(200,183,137,0.66)_100%)] px-5 py-6 shadow-[0_28px_60px_rgba(64,47,1,0.1)] sm:px-8 sm:py-8 lg:px-10 lg:py-10 ${pageMode ? 'mt-2' : ''}`}>
          <div className="absolute -right-10 top-0 h-44 w-44 rounded-full bg-[#D5C9A4]/35 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#FFFCF4]/55 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div ref={contentRef} className="space-y-5 text-[#2A2002]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2A2002]/30 bg-[#FFFCF4]/70 px-3 py-1 font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.16em] backdrop-blur-md sm:text-[11px]">
                <span className="h-2 w-2 rounded-full bg-[#2A2002]" />
                Obra em destaque
              </div>

              <div>
                <p className="font-['Inter'] text-[12px] uppercase tracking-[0.2em] text-[#3A2B05]/75">
                  Coleção da artista
                </p>
                <h2 className="mt-2 max-w-[620px] font-['Intel_One_Mono'] text-[38px] uppercase leading-[0.96] tracking-[0.02em] sm:text-[52px] lg:text-[60px]">
                  {artwork.title}
                </h2>
                <p className="mt-4 max-w-[620px] font-['Inter'] text-[15px] leading-[1.7] text-[#3A2B05] sm:text-[16px]">
                  {artwork.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {specs.map((spec, index) => (
                  <div
                    key={spec.label}
                    ref={(element) => {
                      specRefs.current[index] = element
                    }}
                    className="rounded-[18px] border border-[#7F6A34]/20 bg-[#FFFCF4]/70 px-4 py-4 shadow-[0_12px_26px_rgba(64,47,1,0.07)] backdrop-blur-sm"
                  >
                    <p className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.16em] text-[#7F6A34] sm:text-[11px]">
                      {spec.label}
                    </p>
                    <p className="mt-2 font-['Intel_One_Mono'] text-[16px] leading-[1.25] text-[#2A2002] sm:text-[18px]">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>

              <div ref={ctaRef} className="flex flex-wrap items-center gap-3 pt-1">
                {pageMode ? (
                  <>
                    <a
                      href="#contato"
                      className="inline-flex items-center justify-center rounded-full bg-[#402F01] px-5 py-3 font-['Intel_One_Mono'] text-[12px] uppercase tracking-[0.16em] text-[#FFFCF4] transition duration-300 hover:translate-y-[-1px] hover:bg-[#2F2200]"
                    >
                      Encomende a sua
                    </a>

                    <button
                      type="button"
                      onClick={onBack}
                      className="inline-flex items-center justify-center rounded-full border border-[#7F6A34]/20 bg-transparent px-5 py-3 font-['Intel_One_Mono'] text-[12px] uppercase tracking-[0.16em] text-[#2A2002] transition duration-300 hover:bg-[#FFFCF4]/70"
                    >
                      Voltar ao portfólio
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="#contato"
                      className="inline-flex items-center justify-center rounded-full bg-[#402F01] px-5 py-3 font-['Intel_One_Mono'] text-[12px] uppercase tracking-[0.16em] text-[#FFFCF4] transition duration-300 hover:translate-y-[-1px] hover:bg-[#2F2200]"
                    >
                      Encomende a sua
                    </a>
                    <a
                      href="#obras"
                      className="inline-flex items-center justify-center rounded-full border border-[#7F6A34]/30 bg-[#FFFCF4]/60 px-5 py-3 font-['Intel_One_Mono'] text-[12px] uppercase tracking-[0.16em] text-[#2A2002] transition duration-300 hover:bg-[#FFFCF4]"
                    >
                      Ver outras obras
                    </a>
                  </>
                )}
              </div>
            </div>

            <div ref={imageRef} className="relative w-full max-w-[580px] justify-self-center lg:justify-self-end">
              <div className="absolute -inset-4 rounded-[30px] bg-[#7F6A34]/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[30px] border border-[#7F6A34]/20 bg-[#D5C9A4] shadow-[0_30px_60px_rgba(64,47,1,0.12)]">
                <ImageWithFallback
                  src={artwork.image}
                  alt={artwork.title}
                  fallbackSrc={heroImg}
                  className="h-[320px] w-full object-cover object-center sm:h-[520px] lg:h-[620px]"
                  fallbackClassName="flex h-[320px] w-full items-center justify-center bg-[#D5C9A4] sm:h-[520px] lg:h-[620px]"
                />

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(42,32,2,0.35),rgba(42,32,2,0)_45%)]" />

                <div className="absolute left-4 top-4 rounded-full border border-[#FFFCF4]/25 bg-[#402F01]/55 px-3 py-1 font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.16em] text-[#FFFCF4] backdrop-blur-md sm:left-5 sm:top-5 sm:text-[11px]">
                  {artwork.year}
                </div>

                <div className="absolute right-4 bottom-4 rounded-full border border-[#FFFCF4]/25 bg-[#FFFCF4]/15 px-3 py-1 font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.16em] text-[#FFFCF4] backdrop-blur-md sm:right-5 sm:bottom-5 sm:text-[11px]">
                  {artwork.technique}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default ArtworkDetailSection
