import ImageWithFallback from './ImageWithFallback'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

function PortfolioHeader({ logoImg }) {
  const headerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      })
    }, headerRef)

    return () => ctx.revert()
  }, [])

  return (
    <header ref={headerRef} className="mb-4 flex flex-col items-center justify-between gap-4 px-8 sm:flex-row sm:items-center sm:gap-6">
      <ImageWithFallback
        src={logoImg}
        alt="Daniela Kamaki"
        className="h-20 w-56 sm:h-16"
        fallbackClassName="font-['Intel_One_Mono'] text-[44px] leading-none text-ink"
        fallbackText="Daniela Kamaki"
      />

      <nav className="w-full sm:w-auto">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[15px] font-medium font-['Inter'] text-ink-strong sm:justify-end sm:gap-x-8">
          <li><Link to="/#top" className="hover:opacity-70">Home</Link></li>
          <li><Link to="/sobre" className="hover:opacity-70">Sobre</Link></li>
          <li><Link to="/colecoes" className="hover:opacity-70">Coleções</Link></li>
          <li><Link to="/obras" className="hover:opacity-70">Obras</Link></li>
          <li><Link to="/#processo" className="hover:opacity-70">Processo</Link></li>
          <li><Link to="/#contato" className="hover:opacity-70">Contato</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default PortfolioHeader
