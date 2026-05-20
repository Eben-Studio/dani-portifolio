import React from 'react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Footer({ id }) {
  const footerRef = useRef(null)
  const leftSectionRef = useRef(null)
  const rightSectionRef = useRef(null)

  const isExternalHref = (href) => /^https?:\/\//.test(href)

  const serviceRows = [
    {
      service: { label: 'Obras originais', href: '/shop' },
      canal: {
        label: 'Instagram',
        href: 'https://www.instagram.com/danielakamachistudio/',
      },
    },
    {
      service: {
        label: 'Encomendas',
        href: 'https://www.instagram.com/danielakamachistudio/',
      },
      canal: { label: 'E-mail' },
    },
    {
      service: { label: 'Cartões', href: '/shop' },
      canal: { label: '' },
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftSectionRef.current, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      })

      gsap.from(rightSectionRef.current, {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      })
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer id={id} ref={footerRef} className="bg-[#C8B789] px-5 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-8 sm:grid-cols-[1fr_1.5fr]">
          {/* Left Section */}
          <div ref={leftSectionRef} className="flex flex-col items-start justify-between">
            <div>
              <h2 className="font-['Intel_One_Mono'] text-[28px] leading-[1.2] tracking-[0.01em] text-[#2A2002] sm:text-[32px]">
                Obras originais e sob encomenda_
              </h2>
              <p className="mt-2 font-['Intel_One_Mono'] text-[12px] leading-[1.5] tracking-[0.03em] text-[#3A2B05] opacity-75">
               Solicite um orçamento.
              </p>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex gap-4 sm:mt-12">
              <a
                href="https://www.instagram.com/danielakamachistudio/"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center text-[#2A2002] transition duration-300 hover:opacity-70"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.015-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.981-1.28-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
              </a>
              <a
                href="https://substack.com/@danielakamachi?r=87nzw6&utm_medium=ios&utm_source=stories&shareImageVariant=image"
                aria-label="Substack"
                className="flex h-10 w-10 items-center justify-center text-[#2A2002] transition duration-300 hover:opacity-70"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Section - Table */}
          <div ref={rightSectionRef} className="grid grid-cols-2 gap-1 sm:gap-1">
            {/* Column Headers */}
            <div className="pb-2">
              <span className="font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.08em] text-[#3A2B05]">
                Serviços
              </span>
            </div>
            <div className="pb-2">
              <span className="font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.08em] text-[#3A2B05]">
                Contato
              </span>
            </div>

            {/* Data Rows */}
            {serviceRows.map((row) => (
              <React.Fragment key={row.service.label}>
                <div className="py-2">
                  {row.service.href ? (
                    isExternalHref(row.service.href) ? (
                      <a
                        href={row.service.href}
                        className="font-['Intel_One_Mono'] text-[11px] text-[#3A2B05] transition duration-300 hover:opacity-70"
                      >
                        {row.service.label}
                      </a>
                    ) : (
                      <Link
                        to={row.service.href}
                        className="font-['Intel_One_Mono'] text-[11px] text-[#3A2B05] transition duration-300 hover:opacity-70"
                      >
                        {row.service.label}
                      </Link>
                    )
                  ) : (
                    <span className="font-['Intel_One_Mono'] text-[11px] text-[#3A2B05]">
                      {row.service.label}
                    </span>
                  )}
                </div>
                <div className="py-2">
                  {row.canal?.href ? (
                    <a
                      href={row.canal.href}
                      className="font-['Intel_One_Mono'] text-[11px] text-[#3A2B05] transition duration-300 hover:opacity-70"
                    >
                      {row.canal.label}
                    </a>
                  ) : (
                    <span className="font-['Intel_One_Mono'] text-[11px] text-[#3A2B05]">
                      {row.canal?.label}
                    </span>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-8 border-t border-[#3A2B05]/20 pt-4 sm:mt-10 lg:mt-12">
          <p className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.1em] text-[#3A2B05] opacity-60">
            © 2026 Daniela Kamachi. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
