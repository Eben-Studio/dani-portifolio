import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext'
import AdminAccessDenied from './AdminAccessDenied'
import AdminPageShell from './AdminPageShell'
import { useAdminData } from './useAdminData'
import ImageWithFallback from '../ImageWithFallback'
import Button from '../ui/button'
import Input from '../ui/input'
import Textarea from '../ui/textarea'
import Label from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

const emptyHomeForm = {
  hero_title: 'Arte que te\nencontra_',
  hero_image_url: '',
  presentation_video_url: '',
}

function useObjectUrl(file) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (!file) {
      setUrl('')
      return undefined
    }

    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return url
}

function ImageDropZone({ file, onSelect }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        onSelect(event.dataTransfer.files?.[0] || null)
      }}
      className={`rounded-[18px] border px-4 py-5 text-center transition-all duration-200 ${
        isDragging
          ? 'border-amber-400 bg-amber-50 shadow-[0_10px_24px_rgba(180,115,0,0.12)]'
          : 'border-dashed border-border/20 bg-white/75 hover:border-border/35 hover:bg-white'
      }`}
    >
      <p className="font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.2em] text-ink/60">
        Arraste a imagem aqui
      </p>
      <p className="mt-2 text-[12px] text-ink/70">
        ou clique para selecionar a foto principal da página inicial
      </p>
      <p className="mt-2 text-[11px] text-ink/50">
        É a imagem que aparece logo no começo do site, ao lado do texto.
      </p>
      <p className="mt-3 text-[12px] text-ink">
        {file ? file.name : 'Nenhuma imagem selecionada.'}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(event) => onSelect(event.target.files?.[0] || null)}
        className="hidden"
      />
    </div>
  )
}

function VideoDropZone({ file, onSelect }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        onSelect(event.dataTransfer.files?.[0] || null)
      }}
      className={`rounded-[18px] border px-4 py-5 text-center transition-all duration-200 ${
        isDragging
          ? 'border-amber-400 bg-amber-50 shadow-[0_10px_24px_rgba(180,115,0,0.12)]'
          : 'border-dashed border-border/20 bg-white/75 hover:border-border/35 hover:bg-white'
      }`}
    >
      <p className="font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.2em] text-ink/60">
        Arraste o vídeo aqui
      </p>
      <p className="mt-2 text-[12px] text-ink/70">
        ou clique para selecionar o vídeo de apresentação
      </p>
      <p className="mt-2 text-[11px] text-ink/50">
        Esse é o vídeo que aparece mais abaixo na página inicial.
      </p>
      <p className="mt-3 text-[12px] text-ink">
        {file ? file.name : 'Nenhum vídeo selecionado.'}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={(event) => onSelect(event.target.files?.[0] || null)}
        className="hidden"
      />
    </div>
  )
}

function HomePreviewCard({ form, heroPreviewUrl, videoPreviewUrl }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prévia da home</CardTitle>
          <CardDescription>Veja como o texto, a imagem principal e o vídeo vão aparecer.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-[18px] border border-border/15 bg-white/70">
          <div className="relative h-[220px] bg-surface-5">
            {heroPreviewUrl ? (
              <ImageWithFallback
                src={heroPreviewUrl}
                alt="Preview da imagem principal da home"
                fallbackClassName="absolute inset-0 bg-surface-6"
                className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-surface-6">
                <span className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.2em] text-ink/40">
                  Sem imagem
                </span>
              </div>
            )}
          </div>
          <div className="border-t border-border/15 bg-white/70 px-4 py-3">
            <p className="font-['Intel_One_Mono'] text-[12px] text-ink whitespace-pre-line">
              {form.hero_title || 'Arte que te\nencontra_'}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-border/15 bg-white/70">
          <div className="bg-ink-strong">
            {videoPreviewUrl ? (
              <video
                className="block h-[220px] w-full object-contain"
                src={videoPreviewUrl}
                controls
                muted
                playsInline
              />
            ) : (
              <div className="flex h-[220px] items-center justify-center bg-surface-6">
                <span className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.2em] text-ink/40">
                  Sem vídeo
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AdminHomeContentPage({ logoImg }) {
  const { user, signOut, isLoading: isAuthLoading } = useSupabaseAuth()
  const navigate = useNavigate()
  const { homeContent, isLoading, isSaving, error, upsertHomeContent } = useAdminData({
    enabled: Boolean(user),
  })

  const [draftValues, setDraftValues] = useState({})
  const [heroImageFile, setHeroImageFile] = useState(null)
  const [presentationVideoFile, setPresentationVideoFile] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [minLoadDone, setMinLoadDone] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => setMinLoadDone(true), 400)
    return () => clearTimeout(timeoutId)
  }, [])

  const baseForm = useMemo(
    () => ({
      ...emptyHomeForm,
      hero_title: homeContent?.hero_title || emptyHomeForm.hero_title,
      hero_image_url: homeContent?.hero_image_url || '',
      presentation_video_url: homeContent?.presentation_video_url || '',
    }),
    [homeContent],
  )

  const form = useMemo(() => ({ ...baseForm, ...draftValues }), [baseForm, draftValues])
  const heroPreviewUrl = useObjectUrl(heroImageFile) || form.hero_image_url || ''
  const videoPreviewUrl = useObjectUrl(presentationVideoFile) || form.presentation_video_url || ''

  const handleChange = (key) => (event) => {
    setDraftValues((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await upsertHomeContent(form, heroImageFile, presentationVideoFile)
    if (success) {
      setDraftValues({})
      setHeroImageFile(null)
      setPresentationVideoFile(null)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  if (!user && !isAuthLoading) return <AdminAccessDenied logoImg={logoImg} />

  const showSkeleton = isLoading || !minLoadDone

  return (
    <AdminPageShell
      logoImg={logoImg}
      title="Conteúdo da home"
      subtitle="Atualize o texto principal, a imagem de abertura e o vídeo de apresentação do site."
      onSignOut={signOut}
      actions={(
        <Button type="button" variant="outline" size="sm" onClick={() => navigate('/admin')}>
          Voltar ao painel
        </Button>
      )}
    >
      {error && (
        <Alert className="mb-4">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {saveSuccess && (
        <Alert className="mb-4">
          <AlertTitle>Salvo</AlertTitle>
          <AlertDescription>O conteúdo da home foi atualizado.</AlertDescription>
        </Alert>
      )}

      {showSkeleton ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <div className="h-[520px] rounded-[28px] border border-border/15 bg-white/70" />
          <div className="h-[520px] rounded-[28px] border border-border/15 bg-white/70" />
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
          <Card>
            <CardHeader>
              <CardTitle>Formulário</CardTitle>
              <CardDescription>Altere o texto e envie a nova mídia da página inicial.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label>
                    Texto principal da abertura
                    <span className="ml-[6px] inline-block h-2 w-2 rounded-full bg-green-600 align-[1px]" style={{ opacity: form.hero_title.trim().length >= 6 ? 1 : 0 }} />
                  </Label>
                  <Textarea
                    value={form.hero_title}
                    onChange={handleChange('hero_title')}
                    placeholder="Arte que te\nencontra_"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Foto principal da página inicial</Label>
                  <ImageDropZone file={heroImageFile} onSelect={setHeroImageFile} />
                  {form.hero_image_url && !heroImageFile && (
                    <p className="text-[11px] text-ink/50">A imagem atual já está salva no banco</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>Vídeo de apresentação</Label>
                  <VideoDropZone file={presentationVideoFile} onSelect={setPresentationVideoFile} />
                  {form.presentation_video_url && !presentationVideoFile && (
                    <p className="text-[11px] text-ink/50">O vídeo atual já está salvo no banco</p>
                  )}
                </div>

                {error && (
                  <Alert>
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar conteúdo'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDraftValues({})
                      setHeroImageFile(null)
                      setPresentationVideoFile(null)
                    }}
                  >
                    Limpar alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <HomePreviewCard
            form={form}
            heroPreviewUrl={heroPreviewUrl}
            videoPreviewUrl={videoPreviewUrl}
          />
        </div>
      )}
    </AdminPageShell>
  )
}

export default AdminHomeContentPage