import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext'
import PortfolioHeader from './PortfolioHeader'
import Button from './ui/button'
import Input from './ui/input'
import Label from './ui/label'
import Badge from './ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

function AuthPage({ logoImg }) {
  const { user, signInWithPassword, signOut, isLoading } = useSupabaseAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const isDisabled = useMemo(() => !email || !password || isSubmitting, [email, password, isSubmitting])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setIsSubmitting(true)

    try {
      await signInWithPassword({ email, password })
      navigate('/admin')
    } catch (error) {
      setFormError(error?.message || 'Nao foi possivel entrar. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    setIsSubmitting(true)
    setFormError('')
    try {
      await signOut()
    } catch (error) {
      setFormError(error?.message || 'Nao foi possivel sair. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-canvas">
      <div className="px-2 py-4 sm:px-4 lg:px-5">
        <div className="mx-auto w-full max-w-[1200px]">
          <PortfolioHeader logoImg={logoImg} />

          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
            <Card className="rounded-[28px] bg-surface-1 px-0 py-0 shadow-[0_20px_40px_rgba(64,47,1,0.08)]">
              <CardHeader className="px-6 pt-8 sm:px-10">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>Supabase Admin</Badge>
                  <Badge>Acesso seguro</Badge>
                </div>
                <CardTitle className="mt-6 text-[34px] sm:text-[44px]">Entrar no painel</CardTitle>
                <CardDescription className="mt-4 max-w-[520px]">
                  Use suas credenciais para gerenciar colecoes, obras e uploads. O acesso e exclusivo por URL.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-8 sm:px-10">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { title: 'Colecoes', desc: 'Crie e atualize campanhas.' },
                    { title: 'Obras', desc: 'Controle detalhes e imagens.' },
                    { title: 'Realtime', desc: 'Atualizacoes ao vivo.' },
                    { title: 'Storage', desc: 'Uploads seguros.' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-[18px] border border-border/15 bg-white/70 px-4 py-4">
                      <p className="font-['Intel_One_Mono'] text-[12px] text-ink">{item.title}</p>
                      <p className="mt-1 font-['Inter'] text-[12px] text-ink-muted/70">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[18px] border border-ink/10 bg-canvas px-4 py-3">
                  <p className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.2em] text-ink/45">
                    Status
                  </p>
                  <p className="mt-2 font-['Inter'] text-[12.5px] leading-[1.6] text-ink-muted/70">
                    {user
                      ? 'Sessao ativa. Pode abrir o admin quando quiser.'
                      : 'Sem sessao ativa. Use as credenciais do Supabase Auth.'}
                  </p>
                  {user && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => navigate('/admin')}>
                        Ir para Admin
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={handleSignOut}>
                        Sair
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] bg-surface-2 px-0 py-0 shadow-[0_18px_36px_rgba(64,47,1,0.06)]">
              <CardHeader className="px-6 pt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.3em] text-ink/45">
                      Login
                    </p>
                    <CardTitle className="mt-3 text-[22px]">Credenciais</CardTitle>
                  </div>
                  <Badge className="px-3 py-1 text-[9px] tracking-[0.2em]">Supabase</Badge>
                </div>
              </CardHeader>

              <CardContent className="px-6 pb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="auth-email">Email</Label>
                    <Input
                      id="auth-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="voce@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="auth-password">Senha</Label>
                    <Input
                      id="auth-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="********"
                      required
                    />
                  </div>

                  {formError && (
                    <Alert>
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" disabled={isDisabled || isLoading} className="w-full">
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  )
}

export default AuthPage
