import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ImageWithFallback from './ImageWithFallback'

function HeroSection({ id, heroImg, image }) {
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
      <div className="flex flex-col">
        <div className="flex flex-col justify-between font-['Intel_One_Mono'] text-ink">
          <h1 ref={titleRef} className="mb-7 max-w-[700px] text-left text-[28px] leading-[1.08] tracking-[0.01em] sm:text-[38px] lg:text-[44px]">
          Arte que te <br/>encontra_
          </h1>
        </div>

        <ImageWithFallback
          ref={rightImageRef}
          src={image}
          alt="Artista pintando"
          fallbackSrc={heroImg}
          className="h-[300px] w-full object-cover object-[50%_30%] transition-transform duration-700 ease-out sm:h-[500px] sm:object-cover xl:h-[600px]"
          fallbackClassName="h-[300px] w-full brightness-90 sm:h-[500px] xl:h-[540px]"
        />
      </div>
    </section>
  )
}

export default HeroSection
