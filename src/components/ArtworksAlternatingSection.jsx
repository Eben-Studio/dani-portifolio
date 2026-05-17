import ImageWithFallback from './ImageWithFallback'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function ArtworksAlternatingSection({ id, artworkImg, heroImg }) {
  const sectionRef = useRef(null)
  const articlesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      articlesRef.current.forEach((article) => {
        if (article) {
          gsap.from(article, {
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: article,
              start: 'top 80%',
              toggleActions: 'play none none none',
              once: true,
            },
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const rows = [
    {
      id: 1,
      title: 'Processo',
      text: 'Cada pintura nasce de camadas, pausas e observação da luz. O resultado é uma obra com presença e delicadeza.',
    },
    {
      id: 2,
      title: 'Materialidade',
      text: 'A artista trabalha acrílica, veladuras e texturas para equilibrar cor, gesto e superfície.',
    },
    {
      id: 3,
      title: 'Encomendas',
      text: 'Obras sob medida podem ser pensadas para colecionadores, ambientes e presentes afetivos.',
    },
  ]

  return (
    <section id={id} ref={sectionRef} className="px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-14 sm:gap-24 lg:gap-30">
        {rows.map((row, index) => {
          const textFirst = index % 2 === 0

          return (
            <article
              ref={(el) => {
                articlesRef.current[index] = el
              }}
              key={row.id}
              className="grid items-center gap-6 sm:grid-cols-[0.7fr_1.3fr] sm:gap-8 lg:gap-10"
            >
              <div className={`${textFirst ? 'sm:order-1' : 'sm:order-2'} w-full max-w-full justify-self-center sm:max-w-[245px] sm:justify-self-start`}>
                <h3 className="font-['Intel_One_Mono'] text-[34px] uppercase leading-[0.9] tracking-[0.02em] text-[#3A2B05] sm:text-[38px] lg:text-[40px]">
                  {row.title}
                </h3>
                <p className="mt-2.5 ml-0 font-['Intel_One_Mono'] text-[12px] leading-[1.35] tracking-[0.03em] text-[#3A2B05] sm:ml-[25px] sm:text-[13px] lg:ml-[27px]">
                  {row.text}
                </p>
              </div>

              <div className={`${textFirst ? 'sm:order-2' : 'sm:order-1'} justify-self-center sm:justify-self-end`}>
                <ImageWithFallback
                  src={artworkImg}
                  alt="Artista pintando tela"
                  fallbackSrc={heroImg}
                  className="w-full max-w-[583.1875px] aspect-[583.1875/259.1875] object-cover object-center"
                  fallbackClassName="w-full max-w-[583.1875px] aspect-[583.1875/259.1875] bg-[#D5C9A4]"
                />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ArtworksAlternatingSection
