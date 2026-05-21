import { useCallback, useEffect, useMemo } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import heroImg from './assets/hero.png'
import logoImg from './assets/logo.png'
import imagem1Img from './assets/imagem1.png'
import imagem2Img from './assets/imagem2.png'
import videoSrc from './assets/video_apresentacao.mp4'
import teste_imagem from './assets/imagem.jpg'
import PortfolioHeader from './components/PortfolioHeader'
import HeroSection from './components/HeroSection'
import PresentationVideoSection from './components/PresentationVideoSection'
import ArtworksCarouselSection from './components/ArtworksCarouselSection'
import ArtworkDetailSection from './components/ArtworkDetailSection'
import Footer from './components/Footer'
import AboutPage from './components/AboutPage'
import PortfolioPage from './components/PortfolioPage'
import ShopPage from './components/ShopPage'
import CollectionDetailPage from './components/CollectionDetailPage'
import AuthPage from './components/AuthPage'
import AdminDashboard from './components/AdminDashboard'
import AdminArtworkFormPage from './components/admin/AdminArtworkFormPage'
import AdminCollectionFormPage from './components/admin/AdminCollectionFormPage'
import { usePortfolioData } from './hooks/usePortfolioData'

function LoadingOverlay({ visible }) {
  if (!visible) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFFCF4]/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-full border border-border/20 bg-white/80 px-5 py-3 shadow-[0_12px_30px_rgba(64,47,1,0.12)]">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#7F6A34]/30 border-t-[#7F6A34]" />
        <span className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.2em] text-ink/60">
          Carregando
        </span>
      </div>
    </div>
  )
}

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname, hash])

  return null
}

function HomeRoute({
  artworks,
  selectedArtwork,
  heroImgSrc,
  logoImgSrc,
  videoSource,
  imageSrc,
  onArtworkSelect,
  onBack,
}) {
  if (selectedArtwork) {
    return (
      <main id="top" className="min-h-screen w-full bg-[#FFFCF4]">
        <div className="px-2 py-4 sm:px-4 lg:px-5">
          <div className="mx-auto w-full max-w-[1480px]">
            <PortfolioHeader logoImg={logoImgSrc} />
            <ArtworkDetailSection
              id="obra-destaque"
              artwork={selectedArtwork}
              heroImg={heroImgSrc}
              pageMode
              onBack={onBack}
            />
          </div>
        </div>
        <Footer id="contato" />
      </main>
    )
  }

  return (
    <main id="top" className="min-h-screen w-full bg-[#FFFCF4]">
      <div className="px-2 py-4 sm:px-4 lg:px-5">
        <div className="mx-auto w-full max-w-[1480px]">
          <PortfolioHeader logoImg={logoImgSrc} />
          <HeroSection id="sobre" heroImg={heroImgSrc} image={imageSrc} />
          <ArtworksCarouselSection
            id="obras"
            artworks={artworks}
            heroImg={heroImgSrc}
            onArtworkSelect={onArtworkSelect}
          />
          <div className="mt-4 flex justify-end px-4 sm:px-6" />
          <PresentationVideoSection id="processo" videoSrc={videoSource} />
          {/* <ArtworksAlternatingSection id="atelier" artworkImg={carouselImg} heroImg={heroImgSrc} /> */}
        </div>
      </div>
      <Footer id="contato" />
    </main>
  )
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isAuthRoute = location.pathname === '/auth'
  const shouldLoadPortfolio = !isAdminRoute && !isAuthRoute

  const { collections, artworks, isLoading, hasLoaded } = usePortfolioData({
    enabled: shouldLoadPortfolio,
  })

  const artworkId = searchParams.get('obra')
  const selectedArtwork = useMemo(() => {
    if (!artworkId) return null
    return artworks.find((artwork) => String(artwork.id) === String(artworkId)) || null
  }, [artworks, artworkId])

  const handleArtworkSelect = useCallback(
    (artwork) => {
      const params = new URLSearchParams()
      params.set('obra', artwork.id)
      navigate({ pathname: '/', search: params.toString() })
    },
    [navigate],
  )

  const goHome = useCallback(() => {
    navigate('/')
  }, [navigate])

  const backToPortfolio = useCallback(() => {
    navigate('/')
  }, [navigate])

  const showLoader = shouldLoadPortfolio && !hasLoaded && isLoading

  return (
    <>
      <ScrollToHash />
      <LoadingOverlay visible={showLoader} />
      <Routes>
        <Route
          path="/"
          element={
            <HomeRoute
              artworks={artworks}
              selectedArtwork={selectedArtwork}
              heroImgSrc={heroImg}
              logoImgSrc={logoImg}
              imageSrc={teste_imagem}
              videoSource={videoSrc}
              onArtworkSelect={handleArtworkSelect}
              onBack={backToPortfolio}
            />
          }
        />
        <Route
          path="/sobre"
          element={
            <AboutPage
              logoImg={logoImg}
              heroImg={heroImg}
              imagem1Img={imagem1Img}
              imagem2Img={imagem2Img}
              onHome={goHome}
            />
          }
        />
        <Route path="/obras" element={<Navigate to="/portifolio" replace />} />
        <Route
          path="/shop"
          element={
            <ShopPage
              artworks={artworks}
              heroImg={heroImg}
              logoImg={logoImg}
              onArtworkSelect={handleArtworkSelect}
            />
          }
        />
        <Route
          path="/portifolio"
          element={
            <PortfolioPage
              collections={collections}
              artworks={artworks}
              heroImg={heroImg}
              logoImg={logoImg}
              onArtworkSelect={handleArtworkSelect}
            />
          }
        />
        <Route
          path="/colecao/:slug"
          element={
            <CollectionDetailPage
              collections={collections}
              artworks={artworks}
              heroImg={heroImg}
              logoImg={logoImg}
              onArtworkSelect={handleArtworkSelect}
            />
          }
        />
        <Route
          path="/colecoes"
          element={<Navigate to="/portifolio" replace />}
        />
        <Route path="/auth" element={<AuthPage logoImg={logoImg} />} />
        <Route path="/admin" element={<AdminDashboard logoImg={logoImg} defaultTab="artworks" />} />
        <Route path="/admin/obras" element={<AdminDashboard logoImg={logoImg} defaultTab="artworks" />} />
        <Route path="/admin/obras/nova" element={<AdminArtworkFormPage logoImg={logoImg} />} />
        <Route path="/admin/obras/editar" element={<AdminArtworkFormPage logoImg={logoImg} />} />
        <Route
          path="/admin/colecoes"
          element={<AdminDashboard logoImg={logoImg} defaultTab="collections" />}
        />
        <Route path="/admin/colecoes/nova" element={<AdminCollectionFormPage logoImg={logoImg} />} />
        <Route path="/admin/colecoes/editar" element={<AdminCollectionFormPage logoImg={logoImg} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
