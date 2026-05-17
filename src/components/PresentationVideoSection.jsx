import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function PresentationVideoSection({ id, videoSrc }) {
  const sectionRef = useRef(null)
  const videoContainerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(videoContainerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: videoContainerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id={id} ref={sectionRef} className="mx-auto flex w-full max-w-[1240px] justify-center px-4 py-10 sm:px-6 sm:py-14">
      <div ref={videoContainerRef} className="aspect-[16/9] w-full max-w-[980px] overflow-hidden bg-ink-strong shadow-[0_18px_40px_rgba(var(--color-accent-strong),0.12)]">
        <video
          className="block h-full w-full object-contain"
          src={videoSrc}
          autoPlay
          controls
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
    </section>
  )
}

export default PresentationVideoSection
