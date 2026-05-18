import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import PortfolioHeader from './PortfolioHeader'
import ImageWithFallback from './ImageWithFallback'
import Footer from './Footer'

const exhibitions = [
  {
    year: '2019',
    title: 'A OUTRA FEIRA VI',
    description: 'Selecionada pelos jurados Roberto Bertani e Andrés Hernández para participar da feira de arte A OUTRA FEIRA VI, realizada por Lilian Bado em São Paulo, SP.',
  },
  {
    year: '2019',
    title: 'Arte em Andamento',
    description: 'Série de encontros com agentes do sistema da arte atual organizado e conduzido por Julie Belfer.',
  },
  {
    year: '2019',
    title: 'Arte Todo Mês',
    description: 'Visitas guiadas mensais por exposições em São Paulo com Julie Belfer.',
  },
  {
    year: '2017',
    title: 'Rockford Art Scene',
    description: 'Selecionada pelo curador Lenny French para participar da mostra coletiva da semana de arte da cidade de Rockford, Illinois — EUA.',
  },
  {
    year: '2016',
    title: 'Modern Calligraphy',
    description: 'Curso de caligrafia moderna e aquarela.',
  },
  {
    year: '2010',
    title: 'Lolby Galleri',
    description: 'Trabalhos expostos na Galeria Lolby, em Sønderborg, Dinamarca.',
  },
]

const education = [
  { year: '2010', title: 'MSc. in IT Product Design', place: 'Sønderborg, Denmark' },
  { year: '2004', title: 'Bacharel em Pedagogia', place: 'São Paulo, Brasil' },
]

function AboutPage({ logoImg, heroImg, imagem1Img, onHome }) {
  const pageRef = useRef(null)
  const badgeRef = useRef(null)
  const headlineRef = useRef(null)
  const bodyRef = useRef(null)
  const quoteRef = useRef(null)
  const ctaRef = useRef(null)
  const imageRef = useRef(null)
  const bioSectionRef = useRef(null)
  const timelineRef = useRef(null)
  const markerRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Timeline master ─────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      // Badge pill
      tl.from(badgeRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.6,
      })

      // Headline words stagger
      tl.from(
        headlineRef.current?.querySelectorAll('.word'),
        {
          opacity: 0,
          y: 30,
          rotateX: -20,
          transformOrigin: 'top center',
          duration: 0.75,
          stagger: 0.055,
        },
        '-=0.2'
      )

      // Body paragraphs
      tl.from(
        bodyRef.current?.children,
        {
          opacity: 0,
          y: 16,
          duration: 0.65,
          stagger: 0.1,
        },
        '-=0.4'
      )

      // Quote bar
      tl.from(
        quoteRef.current,
        { opacity: 0, x: -20, duration: 0.55 },
        '-=0.25'
      )

      // CTA buttons
      tl.from(
        ctaRef.current?.children,
        { opacity: 0, y: 12, duration: 0.5, stagger: 0.08 },
        '-=0.2'
      )

      // Hero image — slides in from right
      tl.from(
        imageRef.current,
        {
          opacity: 0,
          x: 40,
          scale: 0.97,
          duration: 1.1,
          ease: 'power4.out',
        },
        0.15
      )

      // Bio section
      gsap.from(bioSectionRef.current?.children, {
        opacity: 0,
        y: 22,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bioSectionRef.current,
          start: 'top 82%',
        },
      })

      // Timeline items cascade
      if (markerRefs.current.length) {
        gsap.from(markerRefs.current, {
          opacity: 0,
          x: -18,
          duration: 0.55,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 80%',
          },
        })
      }
    }, pageRef)

    return () => ctx.revert()
  }, [])

  // Split headline into spans for per-word animation
  const headline = 'A Arte que te encontra'
  const words = headline.split(' ')

  return (
    <main ref={pageRef} id="top" className="min-h-screen w-full bg-[#FFFCF4]">
      <div className="px-2 py-4 sm:px-4 lg:px-5">
        <div className="mx-auto w-full max-w-[1480px] space-y-5">
          {/* ── Header ───────────────────────────────── */}
          <PortfolioHeader logoImg={logoImg} />

          {/* ── Hero section ────────────────────────── */}
          <section className="grid gap-6 rounded-[36px] bg-[#D5C9A4] p-5 shadow-[0_28px_64px_rgba(64,47,1,0.10)] sm:p-7 lg:grid-cols-[1fr_1.05fr] lg:p-8">
            {/* Left: text */}
            <div className="flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-5">
                {/* Pill badge */}
                <div ref={badgeRef} className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#7F6A34]/22 bg-[#402F01]/10 px-3.5 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#402F01]/60" />
                    <span className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.22em] text-[#2A2002]/70">
                      A Artista
                    </span>
                  </span>
                  <span className="font-['Inter'] text-[11px] text-[#2A2002]/40">São Paulo · 1984</span>
                </div>

                {/* Headline */}
                <h1
                  ref={headlineRef}
                  className="max-w-[480px] font-['Intel_One_Mono'] text-[40px] leading-[0.95] tracking-[0.01em] text-[#2A2002] sm:text-[54px] lg:text-[60px]"
                  style={{ perspective: '600px' }}
                >
                  {words.map((w, i) => (
                    <span
                      key={i}
                      className="word mr-[0.25em] inline-block last:mr-0"
                    >
                      {w}
                    </span>
                  ))}
                </h1>

                {/* Bio paragraphs */}
                <div ref={bodyRef} className="flex flex-col gap-3">
                  <p className="max-w-[520px] font-['Inter'] text-[15px] leading-[1.85] text-[#3A2B05] sm:text-[16px]">
                    Nascida em São Paulo em 1984, Daniela é uma artista que se dedica à pintura como forma de conexão, utilizando principalmente tinta acrílica sobre tela. Sua inspiração está intimamente ligada a elementos da natureza, recordações especiais e lugares que tiveram grande influência em sua vida.
                  </p>
                  <p className="max-w-[520px] font-['Inter'] text-[15px] leading-[1.85] text-[#3A2B05] sm:text-[16px]">
                    Contraste de cores vibrantes e tons pastel, traços marcantes e sobreposição de camadas são características do processo gradativo que ela imprime em seu trabalho. Forte e ao mesmo tempo delicado, o propósito de sua arte é trazer beleza e alegria — pinturas que contam histórias, acessam emoções e despertam algo novo.
                  </p>
                </div>
              </div>

              {/* Quote */}
              <blockquote
                ref={quoteRef}
                className="max-w-[460px] border-l-2 border-[#7F6A34]/35 pl-5 font-['Inter'] text-[13.5px] italic leading-[1.8] text-[#3A2B05]/80"
              >
                Acrílica sobre tela, camadas sutis e uma paleta entre tons vibrantes e pastel definem uma obra íntima, serena e viva.
              </blockquote>

              {/* CTA */}
              <div ref={ctaRef} className="flex flex-wrap items-center gap-3">
                <Link
                  to="/#obras"
                  className="inline-flex items-center gap-2 rounded-full bg-[#402F01] px-6 py-3 font-['Intel_One_Mono'] text-[11.5px] uppercase tracking-[0.18em] text-[#FFFCF4] transition-all duration-300 hover:bg-[#2F2200] hover:shadow-[0_6px_22px_rgba(64,47,1,0.28)] active:scale-[0.97]"
                >
                  <span>Ver obras</span>
                  <span className="text-[#FFFCF4]/50">↗</span>
                </Link>
                <button
                  type="button"
                  onClick={onHome}
                  className="inline-flex items-center rounded-full border border-[#7F6A34]/25 bg-[#FFFCF4]/55 px-6 py-3 font-['Intel_One_Mono'] text-[11.5px] uppercase tracking-[0.18em] text-[#2A2002] transition-all duration-300 hover:bg-[#FFFCF4]/80 active:scale-[0.97]"
                >
                  Voltar ao início
                </button>
              </div>
            </div>

            <div
              ref={imageRef}
              className="relative h-[360px] overflow-hidden rounded-[28px] border border-[#7F6A34]/12 bg-[#D5C9A4] shadow-[0_24px_56px_rgba(64,47,1,0.13)] sm:h-[480px] lg:h-auto lg:min-h-[520px]"
            >
              <ImageWithFallback
                src={imagem1Img}
                alt="Daniela segurando pincéis"
                fallbackSrc={heroImg}
                className="absolute inset-0 h-full w-full object-cover object-center"
                fallbackClassName="absolute inset-0 h-full w-full bg-[#D5C9A4]"
              />

              {/* Top badge */}
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-[#C8B789]/30 bg-[#C8B789]/50 px-3 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2A2002]/70" />
                <span className="font-['Intel_One_Mono'] text-[9.5px] uppercase tracking-[0.16em] text-[#2A2002]">
                  Daniela Kamachi
                </span>
              </div>

              {/* Bottom caption */}
              <div className="absolute inset-x-3 bottom-3 rounded-[16px] border border-[#C8B789]/25 bg-[#C8B789]/50 px-5 py-3.5 backdrop-blur-sm">
                <p className="font-['Inter'] text-[9.5px] uppercase tracking-[0.2em] text-[#2A2002]/55">
                  Essência
                </p>
                <p className="mt-1 font-['Inter'] text-[13.5px] leading-[1.6] text-[#2A2002]">
                  Forte, delicada e muito conectada à memória afetiva.
                </p>
              </div>
            </div>
          </section>

          {/* ── Bio + Formação ──────────────────────── */}
          <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Texto biográfico */}
            <div
              ref={bioSectionRef}
              className="flex flex-col gap-5 rounded-[32px] bg-[#D5C9A4] p-6 sm:p-8"
            >
              <div>
                <p className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.24em] text-[#2A2002]/60">
                  Vivência
                </p>
                <h2 className="mt-2 font-['Intel_One_Mono'] text-[28px] leading-[1.05] tracking-[0.01em] text-[#2A2002] sm:text-[34px]">
                  Vive e trabalha em São Paulo, SP.
                </h2>
              </div>

              <p className="font-['Inter'] text-[15px] leading-[1.85] text-[#2A2002]/85">
                Daniela vive e trabalha em São Paulo, cidade onde nasceu em 1984. Seu percurso atravessa fronteiras — da pedagogia ao design na Dinamarca — e retorna à pintura como linguagem essencial: uma forma de habitar o mundo com atenção, cor e sensibilidade.
              </p>

              {/* Education */}
              <div className="mt-2 flex flex-col gap-3 border-t border-[#7F6A34]/20 pt-5">
                <p className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.22em] text-[#C8B789]/50">
                  Formação
                </p>
                {education.map((e) => (
                  <div key={e.year} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-['Intel_One_Mono'] text-[13px] text-[#2A2002]/90">{e.title}</p>
                      <p className="mt-0.5 font-['Inter'] text-[12px] text-[#2A2002]/55">{e.place}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#FFFCF4]/8 px-2.5 py-0.5 font-['Intel_One_Mono'] text-[11px] text-[#C8B789]/60">
                      {e.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline de exposições */}
            <div
              ref={timelineRef}
              className="flex flex-col gap-0 rounded-[32px] bg-[#EDE4CC] p-6 sm:p-8"
            >
              <p className="mb-5 font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.24em] text-[#2A2002]/55">
                Exposições &amp; Cursos
              </p>

              <div className="relative flex flex-col gap-0">
                {/* Vertical line */}
                <div className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-[#7F6A34]/20" />

                {exhibitions.map((item, i) => (
                  <div
                    key={i}
                    ref={(el) => { markerRefs.current[i] = el }}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    {/* Dot */}
                    <div className="relative z-10 mt-1.5 flex h-[11px] w-[11px] shrink-0 items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full border border-[#7F6A34]/50 bg-[#C8B789]" />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-['Intel_One_Mono'] text-[10.5px] uppercase tracking-[0.18em] text-[#7F6A34]/70">
                          {item.year}
                        </span>
                      </div>
                      <p className="font-['Intel_One_Mono'] text-[13px] text-[#2A2002]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 font-['Inter'] text-[12.5px] leading-[1.7] text-[#3A2B05]/65">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Footer ──────────────────────────────── */}
        </div>
      </div>
      <Footer id="contato" />
    </main>
  )
}

export default AboutPage
