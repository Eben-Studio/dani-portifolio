import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext'
import AdminAccessDenied from './AdminAccessDenied'
import AdminPageShell from './AdminPageShell'
import { useAdminData } from './useAdminData'
import Button from '../ui/button'
import Input from '../ui/input'
import Textarea from '../ui/textarea'
import Label from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

const emptyCollectionForm = {
  name: '',
  slug: '',
  tagline: '',
  description: '',
}

// ── Skeleton shimmer block ──────────────────────────────────────────────────
function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gradient-to-r from-black/5 via-black/10 to-black/5 bg-[length:200%_100%] ${className}`}
      style={{
        animation: 'skeletonShimmer 1.4s infinite linear',
        ...style,
      }}
    />
  )
}

function SkeletonPage() {
  return (
    <div className="animate-[fadeUp_0.4s_ease-out_both]">
      <style>{`
        @keyframes skeletonShimmer {
          to { background-position: -200% 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="mb-7 flex items-start justify-between">
        <div>
          <Skeleton style={{ width: 160, height: 18, marginBottom: 8 }} />
          <Skeleton style={{ width: 280, height: 12 }} />
        </div>
        <Skeleton style={{ width: 70, height: 34, borderRadius: 10 }} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="rounded-[18px] border border-black/10 bg-white p-5">
          <Skeleton style={{ width: 80, height: 13, marginBottom: 16 }} />
          {[140, 180].map((w, i) => (
            <div key={i} className="mb-3 rounded-[13px] border border-black/10 p-3">
              <Skeleton style={{ width: 50, height: 10, marginBottom: 6 }} />
              <Skeleton style={{ width: w, height: 11 }} />
            </div>
          ))}
        </div>
        <div className="rounded-[18px] border border-black/10 bg-white p-5">
          <Skeleton style={{ width: 90, height: 13, marginBottom: 20 }} />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} style={{ width: '100%', height: 36, borderRadius: 10, marginBottom: 12 }} />
          ))}
          <Skeleton style={{ width: '100%', height: 80, borderRadius: 10 }} />
        </div>
      </div>
    </div>
  )
}

// ── Animated field wrapper ──────────────────────────────────────────────────
function AnimatedField({ index = 0, children }) {
  return (
    <div
      style={{
        animation: `fieldIn 0.35s cubic-bezier(0.16,1,0.3,1) ${0.22 + index * 0.06}s both`,
      }}
    >
      <style>{`
        @keyframes fieldIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      {children}
    </div>
  )
}

// ── Pulsing status dot ──────────────────────────────────────────────────────
function StatusDot() {
  return (
    <span
      className="mr-2 inline-block h-[6px] w-[6px] rounded-full bg-blue-500 align-[1px]"
      style={{ animation: 'pulseDot 2s ease-in-out infinite' }}
    >
      <style>{`
        @keyframes pulseDot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.45; transform:scale(0.75); }
        }
      `}</style>
    </span>
  )
}

// ── Validation checkmark dot ────────────────────────────────────────────────
function ValidDot({ show }) {
  return (
    <span
      className="ml-[6px] inline-block h-2 w-2 rounded-full bg-green-600 align-[1px]"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'scale(1)' : 'scale(0)',
        transition: 'opacity 0.25s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    />
  )
}

// ── Char counter ────────────────────────────────────────────────────────────
function CharCount({ value, max }) {
  const near = value.length > max * 0.83
  return (
    <p
      className="mt-1 text-right font-mono text-[10px] transition-colors duration-200"
      style={{ color: near ? '#dc2626' : 'rgba(26,26,26,0.45)' }}
    >
      {value.length} / {max}
    </p>
  )
}

// ── Progress pill ───────────────────────────────────────────────────────────
function ProgressPill({ form }) {
  const filled = Object.values(form).filter((v) => v.trim().length > 0).length
  const pct = Math.round((filled / 4) * 100)
  if (filled === 0) return null
  return (
    <div
      className="rounded-[13px] border border-black/10 bg-white/70 px-4 py-3"
      style={{ animation: 'fadeUp 0.3s ease-out both' }}
    >
      <p className="font-['DM_Mono',monospace] text-[10px] uppercase tracking-[0.22em] text-ink/45">
        Progresso
      </p>
      <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-black/8">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${pct}%`, transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </div>
      <p className="mt-2 text-[11px] text-ink/70">
        {filled} de 4 campos preenchidos
      </p>
    </div>
  )
}

// ── Save feedback banner ────────────────────────────────────────────────────
function SaveStatus({ visible }) {
  return (
    <span
      className="flex items-center gap-1 text-[12px] text-green-600"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }}
    >
      ✓ Salvo com sucesso
    </span>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────
const emptyForm = { name: '', slug: '', tagline: '', description: '' }

function AdminCollectionFormPage({ logoImg }) {
  const { user, signOut, isLoading: isAuthLoading } = useSupabaseAuth()
  const navigate = useNavigate()
  const { collections, isLoading, isSaving, error, upsertCollection } = useAdminData({
    enabled: Boolean(user),
  })

  const [searchParams] = useSearchParams()
  const editingId = searchParams.get('id')
  const isEditing = Boolean(editingId)

  const collectionToEdit = useMemo(() => {
    if (!editingId) return null
    return collections.find((c) => String(c.id) === String(editingId))
  }, [collections, editingId])

  const [draftValues, setDraftValues] = useState({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Show skeleton for at least 400 ms so it never flickers
  const [minLoadDone, setMinLoadDone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMinLoadDone(true), 400)
    return () => clearTimeout(t)
  }, [])

  const baseForm = useMemo(
    () => ({
      name: collectionToEdit?.name || '',
      slug: collectionToEdit?.slug || '',
      tagline: collectionToEdit?.tagline || '',
      description: collectionToEdit?.description || '',
    }),
    [collectionToEdit],
  )

  const collectionForm = useMemo(
    () => ({ ...baseForm, ...draftValues }),
    [baseForm, draftValues],
  )

  const handleChange = (key) => (e) =>
    setDraftValues((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await upsertCollection(collectionForm, editingId)
    if (success) {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      setTimeout(() => navigate('/admin/colecoes'), 900)
    }
  }

  if (!user && !isAuthLoading) return <AdminAccessDenied logoImg={logoImg} />

  const showSkeleton = isLoading || !minLoadDone
  const isNotFound = isEditing && !isLoading && !collectionToEdit

  return (
    <>
      {/* Global keyframes injected once */}
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <AdminPageShell
        logoImg={logoImg}
        title={isEditing ? 'Editar coleção' : 'Nova coleção'}
        subtitle="Cadastre ou atualize coleções com os mesmos critérios do portfólio."
        onSignOut={signOut}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/colecoes')}
          >
            Voltar
          </Button>
        }
      >
        {/* ── Loading skeleton ── */}
        {showSkeleton && <SkeletonPage />}

        {/* ── Content (fade in after skeleton) ── */}
        {!showSkeleton && (
          <div style={{ animation: 'fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both' }}>
            {error && (
              <Alert
                className="mb-4"
                style={{ animation: 'slideIn 0.35s cubic-bezier(0.16,1,0.3,1) both' }}
              >
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isNotFound && (
              <Alert
                className="mb-4"
                style={{ animation: 'slideIn 0.35s cubic-bezier(0.16,1,0.3,1) both' }}
              >
                <AlertTitle>Coleção não encontrada</AlertTitle>
                <AlertDescription>Verifique o id informado ou volte para a lista.</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
              {/* ── Checklist card ── */}
              <Card style={{ animation: 'fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.06s both' }}>
                <CardHeader>
                  <CardTitle>Checklist</CardTitle>
                  <CardDescription>Confirme os campos antes de salvar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-[13px] border border-black/10 bg-white/70 px-4 py-3 transition-colors hover:border-black/20 hover:bg-black/[0.02]">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/45">
                      Status
                    </p>
                    <p className="mt-1 text-[12px] text-black/70">
                      <StatusDot />
                      {isEditing ? 'Editando coleção existente' : 'Criando nova coleção'}
                    </p>
                  </div>

                  <div className="rounded-[13px] border border-black/10 bg-white/70 px-4 py-3 transition-colors hover:border-black/20 hover:bg-black/[0.02]">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/45">
                      Dica
                    </p>
                    <p className="mt-1 text-[12px] text-black/70">
                      Use um slug curto e consistente para manter a URL limpa.
                    </p>
                  </div>

                  <ProgressPill form={collectionForm} />
                </CardContent>
              </Card>

              {/* ── Form card ── */}
              <Card style={{ animation: 'fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.13s both' }}>
                <CardHeader>
                  <CardTitle>Formulário</CardTitle>
                  <CardDescription>Preencha os dados principais da coleção.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="grid gap-4">
                    {/* Name */}
                    <AnimatedField index={0}>
                      <div className="grid gap-2">
                        <Label>
                          Nome
                          <ValidDot show={collectionForm.name.length >= 2} />
                        </Label>
                        <Input
                          value={collectionForm.name}
                          onChange={handleChange('name')}
                          placeholder="Nome da coleção"
                          required
                          className="transition-[border-color,box-shadow,background] duration-200 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </AnimatedField>

                    {/* Slug */}
                    <AnimatedField index={1}>
                      <div className="grid gap-2">
                        <Label>
                          Slug
                          <ValidDot show={collectionForm.slug.length >= 3} />
                        </Label>
                        <Input
                          value={collectionForm.slug}
                          onChange={handleChange('slug')}
                          placeholder="memoria-em-cor"
                          required
                          className="transition-[border-color,box-shadow,background] duration-200 focus:ring-2 focus:ring-blue-500/20"
                        />
                        {collectionForm.slug && (
                          <p
                            className="font-mono text-[11px] text-blue-600"
                            style={{ animation: 'slideIn 0.2s ease-out both' }}
                          >
                            /colecoes/{collectionForm.slug}
                          </p>
                        )}
                      </div>
                    </AnimatedField>

                    {/* Tagline */}
                    <AnimatedField index={2}>
                      <div className="grid gap-2">
                        <Label>
                          Tagline
                          <ValidDot show={collectionForm.tagline.length >= 5} />
                        </Label>
                        <Input
                          value={collectionForm.tagline}
                          onChange={handleChange('tagline')}
                          placeholder="Resumo curto"
                          maxLength={120}
                          className="transition-[border-color,box-shadow,background] duration-200 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <CharCount value={collectionForm.tagline} max={120} />
                      </div>
                    </AnimatedField>

                    {/* Description */}
                    <AnimatedField index={3}>
                      <div className="grid gap-2">
                        <Label>Descrição</Label>
                        <Textarea
                          value={collectionForm.description}
                          onChange={handleChange('description')}
                          placeholder="Descreva a narrativa da coleção"
                          rows={4}
                          maxLength={600}
                          className="transition-[border-color,box-shadow,background] duration-200 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <CharCount value={collectionForm.description} max={600} />
                      </div>
                    </AnimatedField>

                    {/* Actions */}
                    <div
                      className="flex flex-wrap items-center gap-3"
                      style={{ animation: 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) 0.46s both' }}
                    >
                      <Button
                        type="submit"
                        disabled={isSaving || isNotFound}
                        className="relative transition-[opacity,transform] duration-150 active:scale-[0.97]"
                      >
                        {isSaving ? (
                          <span className="flex items-center gap-2">
                            <span
                              className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                              style={{ animation: 'spin 0.7s linear infinite' }}
                            />
                            Salvando…
                          </span>
                        ) : isEditing ? (
                          'Atualizar coleção'
                        ) : (
                          'Criar coleção'
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (isEditing) { setDraftValues({}); return }
                          setDraftValues(emptyCollectionForm)
                        }}
                        className="transition-[opacity,transform] duration-150 active:scale-[0.97]"
                      >
                        Limpar
                      </Button>

                      <SaveStatus visible={saveSuccess} />
                    </div>

                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </AdminPageShell>
    </>
  )
}

export default AdminCollectionFormPage