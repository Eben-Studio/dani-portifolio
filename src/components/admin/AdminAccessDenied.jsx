import { useNavigate } from 'react-router-dom'
import PortfolioHeader from '../PortfolioHeader'
import Badge from '../ui/badge'
import Button from '../ui/button'

function AdminAccessDenied({ logoImg }) {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen w-full bg-canvas">
      <div className="px-2 py-4 sm:px-4 lg:px-5">
        <div className="mx-auto w-full max-w-[1200px]">
          <PortfolioHeader logoImg={logoImg} />
          <section className="mt-10 rounded-[28px] border border-border/15 bg-surface-1 px-8 py-10 text-center shadow-[0_18px_36px_rgba(64,47,1,0.06)]">
            <Badge>Admin</Badge>
            <h1 className="mt-5 font-['Intel_One_Mono'] text-[30px] text-ink">Acesso restrito</h1>
            <p className="mt-3 font-['Inter'] text-[13px] text-ink-muted/70">
              Para acessar o admin, faca login primeiro.
            </p>
            <Button type="button" onClick={() => navigate('/auth')} className="mt-6">
              Ir para login
            </Button>
          </section>
        </div>
      </div>
    </main>
  )
}

export default AdminAccessDenied
