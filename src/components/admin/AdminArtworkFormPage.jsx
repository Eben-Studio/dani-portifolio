import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext'
import AdminAccessDenied from './AdminAccessDenied'
import AdminPageShell from './AdminPageShell'
import { useAdminData } from './useAdminData'
import ImageWithFallback from '../ImageWithFallback'
import Button from '../ui/button'
import Input from '../ui/input'
import Textarea from '../ui/textarea'
import Label from '../ui/label'
import Select from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

const emptyArtworkForm = {
  title: '',
  year: '',
  technique: '',
  size: '',
  description: '',
  artwork_type: 'obra',
  category: 'residencial',
  commission_source: '',
  partner_name: '',
  sale_status: '',
  image_url: '',
  collection_id: '',
}

// ── Skeleton shimmer ──────────────────────────────────────────────────────
function Skeleton({ style = {}, className = '' }) {
  return (
    <div
      className={className}
      style={{
        borderRadius: 8,
        background: 'linear-gradient(90deg,rgba(0,0,0,0.06) 25%,rgba(0,0,0,0.03) 50%,rgba(0,0,0,0.06) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.4s infinite linear',
        ...style,
      }}
    />
  )
}

function SkeletonPage() {
  return (
    <div style={{ animation: 'fadeUp 0.4s ease-out both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <Skeleton style={{ width: 130, height: 18, marginBottom: 8 }} />
          <Skeleton style={{ width: 260, height: 12 }} />
        </div>
        <Skeleton style={{ width: 70, height: 34, borderRadius: 10 }} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        {/* Preview card skeleton */}
        <div style={{ borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.1)', background: '#fff', overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 0' }}>
            <Skeleton style={{ width: 70, height: 13, marginBottom: 6 }} />
            <Skeleton style={{ width: 180, height: 11, marginBottom: 16 }} />
          </div>
          <div style={{ padding: '0 20px 20px' }}>
            <Skeleton style={{ width: '100%', height: 220, borderRadius: 14, marginBottom: 12 }} />
            <Skeleton style={{ width: '100%', height: 56, borderRadius: 14 }} />
          </div>
        </div>
        {/* Form card skeleton */}
        <div style={{ borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.1)', background: '#fff', padding: '20px' }}>
          <Skeleton style={{ width: 90, height: 13, marginBottom: 6 }} />
          <Skeleton style={{ width: 200, height: 11, marginBottom: 20 }} />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} style={{ width: '100%', height: 36, borderRadius: 10, marginBottom: 12 }} />
          ))}
          <Skeleton style={{ width: '100%', height: 80, borderRadius: 10, marginBottom: 12 }} />
          <Skeleton style={{ width: '100%', height: 90, borderRadius: 14 }} />
        </div>
      </div>
    </div>
  )
}

// ── Animated field wrapper ────────────────────────────────────────────────
function AnimatedField({ index = 0, children }) {
  return (
    <div style={{ animation: `fieldIn 0.35s cubic-bezier(0.16,1,0.3,1) ${0.2 + index * 0.055}s both` }}>
      {children}
    </div>
  )
}

// ── Pulsing status dot ────────────────────────────────────────────────────
function StatusDot() {
  return (
    <span
      className="mr-2 inline-block h-[6px] w-[6px] rounded-full bg-blue-500 align-[1px]"
      style={{ animation: 'pulseDot 2s ease-in-out infinite' }}
    />
  )
}

// ── Validation dot ────────────────────────────────────────────────────────
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

// ── Char counter ──────────────────────────────────────────────────────────
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

// ── Progress pill ─────────────────────────────────────────────────────────
function ProgressPill({ form }) {
  const typeKey = String(form.artwork_type || 'obra').toLowerCase()
  const isCartao = typeKey === 'cartao'
  const keys = isCartao
    ? ['title', 'year', 'size', 'description', 'partner_name', 'collection_id']
    : ['title', 'year', 'technique', 'size', 'description', 'category', 'commission_source']
  const filled = keys.filter((k) => String(form[k] || '').trim().length > 0).length
  const hasImage = Boolean(form.image_url) || false
  const total = keys.length + 1
  const totalFilled = filled + (hasImage ? 1 : 0)
  const pct = Math.round((totalFilled / total) * 100)
  if (totalFilled === 0) return null
  return (
    <div
      className="rounded-[18px] border border-border/15 bg-white/70 px-4 py-3"
      style={{ animation: 'fadeUp 0.3s ease-out both' }}
    >
      <p className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.22em] text-ink/45">
        Progresso
      </p>
      <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-black/8">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${pct}%`, transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </div>
      <p className="mt-2 text-[11px] text-ink/70">
        {totalFilled} de {total} campos preenchidos
      </p>
    </div>
  )
}

// ── Save feedback ─────────────────────────────────────────────────────────
function SaveStatus({ visible }) {
  return (
    <span
      className="flex items-center gap-1 text-[12px] text-green-600"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}
    >
      ✓ Salvo com sucesso
    </span>
  )
}

// ── Drop zone ─────────────────────────────────────────────────────────────
function DropZone({ fileInputRef, artworkFile, onDrop, onSelect }) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { setIsDragging(false); onDrop(e) }}
      role="button"
      tabIndex={0}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click() }
      }}
      style={{
        borderRadius: 18,
        border: `1.5px dashed ${isDragging ? 'rgba(37,99,235,0.5)' : 'rgba(0,0,0,0.18)'}`,
        background: isDragging ? 'rgba(37,99,235,0.04)' : 'rgba(255,255,255,0.7)',
        padding: '20px 16px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s, transform 0.15s',
        transform: isDragging ? 'scale(1.01)' : 'scale(1)',
      }}
    >
      <p className="font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.2em] text-ink/60">
        Arraste a imagem aqui
      </p>
      <p className="mt-2 text-[12px] text-ink/70">ou clique para selecionar</p>
      {artworkFile && (
        <p
          className="mt-3 text-[12px] text-ink"
          style={{ animation: 'slideIn 0.25s ease-out both' }}
        >
          📎 {artworkFile.name}
        </p>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => onSelect(e.target.files?.[0] || null)}
        className="hidden"
      />
    </div>
  )
}

// ── Preview card ──────────────────────────────────────────────────────────
function PreviewCard({ previewUrl, artworkForm, isEditing }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const typeKey = String(artworkForm.artwork_type || 'obra').toLowerCase()
  const isCartao = typeKey === 'cartao'
  const metaSecondary = isCartao ? (artworkForm.size || 'Tamanho') : (artworkForm.technique || 'Técnica')
  const statusLabel = isEditing
    ? (isCartao ? 'Editando cartão existente' : 'Editando obra existente')
    : (isCartao ? 'Criando novo cartão' : 'Criando nova obra')

  useEffect(() => { setImgLoaded(false) }, [previewUrl])

  return (
    <Card style={{ animation: 'fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.06s both' }}>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>Confira a imagem e os metadados.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-[18px] border border-border/15 bg-surface-5">
          <div className="relative h-[220px]">
            {previewUrl ? (
              <>
                {!imgLoaded && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg,rgba(0,0,0,0.06) 25%,rgba(0,0,0,0.03) 50%,rgba(0,0,0,0.06) 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'skeletonShimmer 1.4s infinite linear',
                    }}
                  />
                )}
                <ImageWithFallback
                  src={previewUrl}
                  alt={artworkForm.title || 'Preview da obra'}
                  fallbackClassName="absolute inset-0 bg-surface-6"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    opacity: imgLoaded ? 1 : 0,
                    transition: 'opacity 0.4s ease-out',
                  }}
                  onLoad={() => setImgLoaded(true)}
                />
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-surface-6">
                <span className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.2em] text-ink/40">
                  Sem imagem
                </span>
              </div>
            )}
          </div>
          <div className="border-t border-border/15 bg-white/70 px-4 py-3">
            <p
              className="font-['Intel_One_Mono'] text-[12px] text-ink transition-all duration-300"
              style={{ opacity: artworkForm.title ? 1 : 0.4 }}
            >
              {artworkForm.title || 'Título da obra'}
            </p>
            <p className="mt-1 font-['Inter'] text-[11px] text-ink-muted/60">
              {artworkForm.year ? `${artworkForm.year} · ` : ''}
              {metaSecondary}
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-border/15 bg-white/70 px-4 py-3 transition-colors hover:border-black/20">
          <p className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.24em] text-ink/45">
            Status
          </p>
          <p className="mt-1 font-['Inter'] text-[12px] text-ink/70">
            <StatusDot />
            {statusLabel}
          </p>
        </div>

        <ProgressPill form={artworkForm} />
      </CardContent>
    </Card>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
function AdminArtworkFormPage({ logoImg }) {
  const { user, signOut, isLoading: isAuthLoading } = useSupabaseAuth()
  const navigate = useNavigate()
  const { collections, artworks, isLoading, isSaving, error, upsertArtwork } = useAdminData({
    enabled: Boolean(user),
  })

  const fileInputRef = useRef(null)
  const [searchParams] = useSearchParams()
  const editingId = searchParams.get('id')
  const isEditing = Boolean(editingId)

  const artworkToEdit = useMemo(() => {
    if (!editingId) return null
    return artworks.find((a) => String(a.id) === String(editingId))
  }, [artworks, editingId])

  const [draftValues, setDraftValues] = useState({})
  const [artworkFile, setArtworkFile] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [minLoadDone, setMinLoadDone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMinLoadDone(true), 400)
    return () => clearTimeout(t)
  }, [])

  const collectionOptions = useMemo(() => [
    { value: '', label: 'Sem coleção' },
    ...collections.map((c) => ({ value: String(c.id), label: c.name })),
  ], [collections])

  const categoryOptions = useMemo(() => [
    { value: 'residencial', label: 'Residencial' },
    { value: 'corporativo', label: 'Corporativo' },
    { value: 'collab', label: 'Collab' },
    { value: 'exposicao', label: 'Exposição' },
  ], [])

  const typeOptions = useMemo(() => [
    { value: 'obra', label: 'Obra' },
    { value: 'cartao', label: 'Cartão' },
  ], [])

  const commissionOptions = useMemo(() => [
    { value: '', label: 'Sem origem' },
    { value: 'direta', label: 'Direta' },
    { value: 'arquiteta', label: 'Arquiteta' },
    { value: 'escritorio', label: 'Escritório' },
  ], [])

  const saleStatusOptions = useMemo(() => [
    { value: '', label: 'Não exibir no shop' },
    { value: 'disponivel', label: 'Disponível' },
    { value: 'reservado', label: 'Reservado' },
    { value: 'vendido', label: 'Vendido' },
  ], [])

  const baseForm = useMemo(() => {
    if (!artworkToEdit) return { ...emptyArtworkForm }
    return {
      ...emptyArtworkForm,
      title: artworkToEdit?.title || '',
      year: artworkToEdit?.year ? String(artworkToEdit.year) : '',
      technique: artworkToEdit?.technique || '',
      size: artworkToEdit?.size || '',
      description: artworkToEdit?.description || '',
      artwork_type: artworkToEdit?.artwork_type || 'obra',
      category: artworkToEdit?.category ?? '',
      commission_source: artworkToEdit?.commission_source ?? '',
      partner_name: artworkToEdit?.partner_name ?? '',
      sale_status: artworkToEdit?.sale_status ?? '',
      image_url: artworkToEdit?.image_url || '',
      collection_id: artworkToEdit?.collection_id ? String(artworkToEdit.collection_id) : '',
    }
  }, [artworkToEdit])

  const artworkForm = useMemo(() => ({ ...baseForm, ...draftValues }), [baseForm, draftValues])

  const normalizedType = String(artworkForm.artwork_type || 'obra').toLowerCase()
  const isCartao = normalizedType === 'cartao'
  const normalizedCategory = String(artworkForm.category || '').toLowerCase()
  const normalizedOrigin = String(artworkForm.commission_source || '').toLowerCase()
  const showPartnerField =
    isCartao ||
    normalizedCategory === 'collab' ||
    normalizedCategory === 'exposicao' ||
    normalizedOrigin === 'direta' ||
    normalizedOrigin === 'arquiteta' ||
    normalizedOrigin === 'escritorio'
  const partnerFieldLabel = (() => {
    if (isCartao) return 'Cliente'
    if (normalizedCategory === 'collab') return 'Marca'
    if (normalizedCategory === 'exposicao') return 'Nome da exposição'
    if (normalizedOrigin === 'arquiteta' || normalizedOrigin === 'escritorio') {
      return 'Escritório/Arquiteta'
    }
    return 'Cliente/Projeto'
  })()
  const partnerFieldPlaceholder = (() => {
    if (isCartao) return 'Ex: Nome do cliente'
    if (normalizedCategory === 'collab') return 'Ex: Marca parceira'
    if (normalizedCategory === 'exposicao') return 'Ex: Exposição coletiva'
    if (normalizedOrigin === 'arquiteta' || normalizedOrigin === 'escritorio') {
      return 'Ex: Escritório XYZ'
    }
    return 'Ex: Cliente/Projeto'
  })()

  const previewUrl = useMemo(() => {
    if (artworkFile) return URL.createObjectURL(artworkFile)
    return artworkForm.image_url || ''
  }, [artworkFile, artworkForm.image_url])

  useEffect(() => {
    if (!artworkFile) return undefined
    return () => URL.revokeObjectURL(previewUrl)
  }, [artworkFile, previewUrl])

  const handleChange = (key) => (e) =>
    setDraftValues((prev) => ({ ...prev, [key]: e.target.value }))

  const handleArtworkFileSelect = (file) => { if (file) setArtworkFile(file) }

  const handleArtworkDrop = (e) => {
    e.preventDefault()
    handleArtworkFileSelect(e.dataTransfer.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await upsertArtwork(artworkForm, editingId, artworkFile)
    if (success) {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      setTimeout(() => navigate('/admin/obras'), 900)
    }
  }

  if (!user && !isAuthLoading) return <AdminAccessDenied logoImg={logoImg} />

  const showSkeleton = isLoading || !minLoadDone
  const isNotFound = isEditing && !isLoading && !artworkToEdit

  return (
    <>
      <style>{`
        @keyframes skeletonShimmer { to { background-position: -200% 0; } }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateY(-5px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fieldIn {
          from { opacity:0; transform:translateX(-6px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes pulseDot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.45; transform:scale(0.75); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <AdminPageShell
        logoImg={logoImg}
        title={isEditing ? 'Editar obra' : 'Nova obra'}
        subtitle="Cadastre obras com imagem, técnica e dimensões."
        onSignOut={signOut}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/obras')}
          >
            Voltar
          </Button>
        }
      >
        {/* ── Skeleton ── */}
        {showSkeleton && <SkeletonPage />}

        {/* ── Content ── */}
        {!showSkeleton && (
          <div style={{ animation: 'fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both' }}>
            {error && (
              <Alert className="mb-4" style={{ animation: 'slideIn 0.35s ease-out both' }}>
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isNotFound && (
              <Alert className="mb-4" style={{ animation: 'slideIn 0.35s ease-out both' }}>
                <AlertTitle>Obra não encontrada</AlertTitle>
                <AlertDescription>Verifique o id informado ou volte para a lista.</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
              {/* ── Preview card ── */}
              <PreviewCard
                previewUrl={previewUrl}
                artworkForm={artworkForm}
                isEditing={isEditing}
              />

              {/* ── Form card ── */}
              <Card style={{ animation: 'fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.13s both' }}>
                <CardHeader>
                  <CardTitle>Formulário</CardTitle>
                  <CardDescription>Preencha as informações essenciais da obra.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="grid gap-4">
                    {/* Título */}
                    <AnimatedField index={0}>
                      <div className="grid gap-2">
                        <Label>
                          Título
                          <ValidDot show={artworkForm.title.length >= 2} />
                        </Label>
                        <Input
                          value={artworkForm.title}
                          onChange={handleChange('title')}
                          placeholder="Título da obra"
                          required
                          className="transition-[border-color,box-shadow,background] duration-200 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </AnimatedField>

                    {/* Tipo de obra */}
                    <AnimatedField index={1}>
                      <div className="grid gap-2">
                        <Label>
                          Tipo de obra
                          <ValidDot show={Boolean(artworkForm.artwork_type)} />
                        </Label>
                        <Select
                          value={artworkForm.artwork_type}
                          onChange={handleChange('artwork_type')}
                          options={typeOptions}
                          className="transition-[border-color,box-shadow] duration-200 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </AnimatedField>

                    {/* Ano + Técnica */}
                    <AnimatedField index={2}>
                      <div className={isCartao ? 'grid gap-3' : 'grid gap-3 sm:grid-cols-2'}>
                        <div className="grid gap-2">
                          <Label>
                            Ano
                            <ValidDot show={artworkForm.year.length === 4} />
                          </Label>
                          <Input
                            type="number"
                            value={artworkForm.year}
                            onChange={handleChange('year')}
                            placeholder="2024"
                            className="transition-[border-color,box-shadow,background] duration-200 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        {!isCartao && (
                          <div className="grid gap-2">
                            <Label>
                              Técnica
                              <ValidDot show={artworkForm.technique.length >= 3} />
                            </Label>
                            <Input
                              value={artworkForm.technique}
                              onChange={handleChange('technique')}
                              placeholder="Acrílica sobre tela"
                              className="transition-[border-color,box-shadow,background] duration-200 focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                        )}
                      </div>
                    </AnimatedField>

                    {!isCartao && (
                      <>
                        {/* Categoria + Origem */}
                        <AnimatedField index={3}>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid gap-2">
                              <Label>
                                Categoria
                                <ValidDot show={Boolean(artworkForm.category)} />
                              </Label>
                              <Select
                                value={artworkForm.category}
                                onChange={handleChange('category')}
                                options={categoryOptions}
                                className="transition-[border-color,box-shadow] duration-200 focus:ring-2 focus:ring-blue-500/20"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>
                                Origem da encomenda
                                <ValidDot show={Boolean(artworkForm.commission_source)} />
                              </Label>
                              <Select
                                value={artworkForm.commission_source}
                                onChange={handleChange('commission_source')}
                                options={commissionOptions}
                                className="transition-[border-color,box-shadow] duration-200 focus:ring-2 focus:ring-blue-500/20"
                              />
                            </div>
                          </div>
                        </AnimatedField>

                        {/* Status no shop */}
                        <AnimatedField index={4}>
                          <div className="grid gap-2">
                            <Label>
                              Status no shop
                              <ValidDot show={Boolean(artworkForm.sale_status)} />
                            </Label>
                            <Select
                              value={artworkForm.sale_status}
                              onChange={handleChange('sale_status')}
                              options={saleStatusOptions}
                              className="transition-[border-color,box-shadow] duration-200 focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                        </AnimatedField>
                      </>
                    )}

                    {showPartnerField && (
                      <AnimatedField index={5}>
                        <div className="grid gap-2">
                          <Label>{partnerFieldLabel}</Label>
                          <Input
                            value={artworkForm.partner_name}
                            onChange={handleChange('partner_name')}
                            placeholder={partnerFieldPlaceholder}
                            className="transition-[border-color,box-shadow,background] duration-200 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </AnimatedField>
                    )}

                    {/* Dimensões */}
                    <AnimatedField index={6}>
                      <div className="grid gap-2">
                        <Label>
                          Dimensões
                          <ValidDot show={artworkForm.size.length >= 3} />
                        </Label>
                        <Input
                          value={artworkForm.size}
                          onChange={handleChange('size')}
                          placeholder="120 x 90 cm"
                          className="transition-[border-color,box-shadow,background] duration-200 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </AnimatedField>

                    {/* Descrição */}
                    <AnimatedField index={7}>
                      <div className="grid gap-2">
                        <Label>Descrição</Label>
                        <Textarea
                          value={artworkForm.description}
                          onChange={handleChange('description')}
                          placeholder="Detalhes e narrativa da obra"
                          rows={4}
                          maxLength={600}
                          className="transition-[border-color,box-shadow,background] duration-200 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <CharCount value={artworkForm.description} max={600} />
                      </div>
                    </AnimatedField>

                    {/* URL da imagem */}
                    <AnimatedField index={8}>
                      <div className="grid gap-2">
                        <Label>URL da imagem</Label>
                        <Input
                          value={artworkForm.image_url}
                          onChange={handleChange('image_url')}
                          placeholder="https://..."
                          className="transition-[border-color,box-shadow,background] duration-200 focus:ring-2 focus:ring-blue-500/20"
                        />
                        {artworkForm.image_url && (
                          <p
                            className="font-mono text-[11px] text-blue-600"
                            style={{ animation: 'slideIn 0.2s ease-out both' }}
                          >
                            {artworkForm.image_url}
                          </p>
                        )}
                      </div>
                    </AnimatedField>

                    {/* Coleção */}
                    <AnimatedField index={9}>
                      <div className="grid gap-2">
                        <Label>Coleção</Label>
                        <Select
                          value={artworkForm.collection_id}
                          onChange={handleChange('collection_id')}
                          options={collectionOptions}
                          className="transition-[border-color,box-shadow] duration-200 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </AnimatedField>

                    {/* Drop zone */}
                    <AnimatedField index={10}>
                      <DropZone
                        fileInputRef={fileInputRef}
                        artworkFile={artworkFile}
                        onDrop={handleArtworkDrop}
                        onSelect={handleArtworkFileSelect}
                      />
                    </AnimatedField>

                    {/* Actions */}
                    <div
                      className="flex flex-wrap items-center gap-3"
                      style={{ animation: 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) 0.52s both' }}
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
                          'Atualizar obra'
                        ) : (
                          'Criar obra'
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (isEditing) { setDraftValues({}) } else { setDraftValues(emptyArtworkForm) }
                          setArtworkFile(null)
                        }}
                        className="transition-[opacity,transform] duration-150 active:scale-[0.97]"
                      >
                        Limpar
                      </Button>

                      <SaveStatus visible={saveSuccess} />
                    </div>
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

export default AdminArtworkFormPage