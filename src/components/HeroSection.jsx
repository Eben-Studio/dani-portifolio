import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ImageWithFallback from './ImageWithFallback'

function HeroSection({ id, imagem1Img, imagem2Img, heroImg }) {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const leftContentRef = useRef(null)
  const rightImageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      })

      gsap.from(leftContentRef.current?.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3,
      })

      gsap.from(rightImageRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
  <section id={id} ref={sectionRef} className="bg-white/30 backdrop-blur-md w-full p-4 sm:p-6 lg:p-7">
      <div className="grid gap-6 xl:grid-cols-[1.8fr_0.78fr]">
        <div className="flex flex-col justify-between font-['Intel_One_Mono'] text-ink">
          <h1 ref={titleRef} className="mb-7 max-w-[700px] text-left text-[28px] leading-[1.08] tracking-[0.01em] sm:text-[38px] lg:text-[44px]">
            Pinturas que aproximam
            <br className="hidden sm:block" />{' '}
            cor, memória, natureza
            <span className="sm:hidden"><br /></span> e
            <br className="hidden sm:block" />{' '}
            cidade_
          </h1>

          <div ref={leftContentRef} className="flex flex-col gap-10 sm:flex-row sm:items-end sm:gap-5">
            <ImageWithFallback
              src={imagem1Img}
              alt="Artista segurando pinceis"
              fallbackSrc={heroImg}
              className="h-[280px] w-full max-w-[260px] self-center object-cover object-center transition-transform duration-700 ease-out sm:h-[420px] sm:w-[240px] sm:self-auto lg:h-[440px] lg:w-[305px]"
              fallbackClassName="h-[280px] w-full max-w-[260px] sm:h-[420px] sm:w-[240px] lg:h-[440px] lg:w-[305px]"
            />

            <div className="flex max-w-[370px] flex-col items-start pb-1 text-left">
              <h2 className="mb-3 text-[32px] leading-[0.94] sm:text-[38px]">Sobre a artista_</h2>
              <p className="font-['Intel_One_Mono'] mb-4 text-[15px] uppercase leading-[1.35] tracking-[0.05em]">
                Pinturas autorais que exploram memória, gesto e atmosfera.{' '}
                <span className="sm:hidden"><br /></span>
                Cada obra nasce para
                viver em coleção, em interiores com presença e em encomendas feitas sob medida.
              </p>
              <Link
                to="/#processo"
                className="inline-flex bg-[#D5C9A4] px-6 py-2 text-[16px] uppercase tracking-[0.08em] text-ink transition hover:bg-[#2F2200] hover:text-[#FFFCF4]"
              >
                Ver processo
              </Link>
            </div>
          </div>
        </div>

        <ImageWithFallback
          ref={rightImageRef}
          src={imagem2Img}
          alt="Artista pintando"
          fallbackSrc={heroImg}
          className="h-[320px] w-full object-cover object-center transition-transform duration-700 ease-out sm:h-[520px] xl:h-[650px]"
          fallbackClassName="h-[320px] w-full sm:h-[520px] xl:h-[650px]"
        />
      </div>
    </section>
  )
}

export default HeroSection
