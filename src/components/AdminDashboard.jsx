import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext'
import AdminAccessDenied from './admin/AdminAccessDenied'
import AdminPageShell from './admin/AdminPageShell'
import { useAdminData } from './admin/useAdminData'
import { supabase } from '../lib/supabaseClient'
import ImageWithFallback from './ImageWithFallback'
import Button from './ui/button'
import Badge from './ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import Select from './ui/select'
import Pagination from './ui/pagination'

const PAGE_SIZE = 10
const STORAGE_BUCKET = 'daniela'

const CATEGORY_LABELS = {
  residencial: 'Residencial',
  corporativo: 'Corporativo',
  collab: 'Collab',
  exposicao: 'Exposição',
}

const ORIGIN_LABELS = {
  direta: 'Direta',
  arquiteta: 'Arquiteta',
  escritorio: 'Escritório',
}

const SALE_STATUS_LABELS = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  vendido: 'Vendido',
}

const normalizeValue = (value) => String(value || '').trim().toLowerCase()
const formatCategory = (value) => CATEGORY_LABELS[normalizeValue(value)] || value
const formatOrigin = (value) => ORIGIN_LABELS[normalizeValue(value)] || value
const formatSaleStatus = (value) => SALE_STATUS_LABELS[normalizeValue(value)] || value

const artworkSortOptions = [
  { value: 'year-desc', label: 'Ano (desc)' },
  { value: 'year-asc', label: 'Ano (asc)' },
  { value: 'title-asc', label: 'Título (A-Z)' },
  { value: 'title-desc', label: 'Título (Z-A)' },
]

const collectionSortOptions = [
  { value: 'name-asc', label: 'Nome (A-Z)' },
  { value: 'name-desc', label: 'Nome (Z-A)' },
  { value: 'id-desc', label: 'Mais recentes' },
  { value: 'id-asc', label: 'Mais antigas' },
]

// ── Keyframes (injected once) ─────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes skeletonShimmer { to { background-position: -200% 0; } }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideIn {
    from { opacity:0; transform:translateY(-5px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes rowIn {
    from { opacity:0; transform:translateX(-6px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes countUp {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
`

// ── Skeleton shimmer block ────────────────────────────────────────────────
function Skeleton({ style = {}, className = '' }) {
  return (
    <div
      className={className}
      style={{
        borderRadius: 8,
        background:
          'linear-gradient(90deg,rgba(0,0,0,0.07) 25%,rgba(0,0,0,0.03) 50%,rgba(0,0,0,0.07) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.4s infinite linear',
        ...style,
      }}
    />
  )
}

// ── Summary cards skeleton ────────────────────────────────────────────────
function SummarySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2" style={{ animation: 'fadeUp 0.4s ease-out both' }}>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="rounded-[22px] border border-border/15 bg-white/70 px-5 py-4"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          <Skeleton style={{ width: 60, height: 10, marginBottom: 12 }} />
          <Skeleton style={{ width: 48, height: 28 }} />
        </div>
      ))}
    </div>
  )
}

// ── Toolbar skeleton ──────────────────────────────────────────────────────
function ToolbarSkeleton() {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-border/20 bg-surface-2/80 px-4 py-3"
      style={{ animation: 'fadeUp 0.4s ease-out 0.08s both' }}
    >
      <div className="flex items-center gap-3">
        <Skeleton style={{ width: 60, height: 24, borderRadius: 99 }} />
        <Skeleton style={{ width: 200, height: 34, borderRadius: 8 }} />
      </div>
      <Skeleton style={{ width: 90, height: 34, borderRadius: 8 }} />
    </div>
  )
}

// ── List skeleton ─────────────────────────────────────────────────────────
function ListSkeleton({ isArtworks }) {
  return (
    <div className="space-y-3" style={{ animation: 'fadeUp 0.4s ease-out 0.14s both' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-[18px] border border-border/15 bg-white/70 px-4 py-3"
          style={{ opacity: 1 - i * 0.18 }}
        >
          {isArtworks && (
            <Skeleton style={{ width: 64, height: 64, borderRadius: 12, flexShrink: 0 }} />
          )}
          <div style={{ flex: 1 }}>
            <Skeleton style={{ width: '55%', height: 13, marginBottom: 10 }} />
            <Skeleton style={{ width: '35%', height: 10, marginBottom: 6 }} />
            <Skeleton style={{ width: '45%', height: 10 }} />
          </div>
          <div className="flex gap-2">
            <Skeleton style={{ width: 60, height: 30, borderRadius: 8 }} />
            <Skeleton style={{ width: 70, height: 30, borderRadius: 8 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Animated summary card ─────────────────────────────────────────────────
function SummaryCard({ label, value, index }) {
  return (
    <div
      className="rounded-[22px] border border-border/15 bg-white/70 px-5 py-4 shadow-[0_16px_32px_rgba(64,47,1,0.12)] transition-shadow hover:shadow-[0_20px_40px_rgba(64,47,1,0.16)]"
      style={{ animation: `fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) ${index * 0.07}s both` }}
    >
      <p className="font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.22em] text-ink/45">
        {label}
      </p>
      <p
        className="mt-2 font-['Intel_One_Mono'] text-[26px] text-ink"
        style={{ animation: `countUp 0.5s cubic-bezier(0.16,1,0.3,1) ${0.15 + index * 0.07}s both` }}
      >
        {String(value).padStart(2, '0')}
      </p>
    </div>
  )
}

// ── Artwork row ───────────────────────────────────────────────────────────
function ArtworkRow({ artwork, index, collectionLabel, isSaving, onEdit, onDelete }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const categoryLabel = formatCategory(artwork.category) || 'Sem categoria'
  const originLabel = formatOrigin(artwork.commission_source) || 'Sem origem'
  const partnerLabel = artwork.partner_name || 'Sem parceiro'
  const saleStatusLabel = formatSaleStatus(artwork.sale_status) || 'Sem status'

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-border/15 bg-white/70 px-4 py-3 transition-[border-color,box-shadow] hover:border-border/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
      style={{ animation: `rowIn 0.35s cubic-bezier(0.16,1,0.3,1) ${index * 0.045}s both` }}
    >
      <div className="flex min-w-[240px] flex-1 items-start gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-[12px] bg-surface-5">
          {!imgLoaded && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg,rgba(0,0,0,0.06) 25%,rgba(0,0,0,0.03) 50%,rgba(0,0,0,0.06) 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeletonShimmer 1.4s infinite linear',
              }}
            />
          )}
          <ImageWithFallback
            src={artwork._resolvedImg}
            alt={artwork.title || 'Obra'}
            fallbackClassName="h-full w-full bg-surface-6"
            className="h-full w-full object-cover"
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.35s ease-out' }}
            onLoad={() => setImgLoaded(true)}
          />
        </div>
        <div>
          <p className="font-['Intel_One_Mono'] text-[13px] text-ink">
            {artwork.title || 'Sem título'}
          </p>
          <div className="mt-2 grid gap-1 text-[11.5px] text-ink-muted/70">
            {[
              ['Ano', artwork.year || 'Sem ano'],
              ['Técnica', artwork.technique || 'Sem técnica'],
              ['Dimensões', artwork.size || 'Sem dimensões'],
              ['Categoria', categoryLabel],
              ['Origem', originLabel],
              ['Parceiro', partnerLabel],
              ['Status shop', saleStatusLabel],
              ['Coleção', collectionLabel || 'Sem coleção'],
              ['Descrição', artwork.description || 'Sem descrição'],
            ].map(([lbl, val]) => (
              <p key={lbl} className="flex flex-wrap gap-2">
                <span className="font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.2em] text-ink/45">
                  {lbl}
                </span>
                <span>{val}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="transition-[transform,box-shadow] duration-150 hover:shadow-sm active:scale-[0.97]"
        >
          Editar
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={isSaving}
          onClick={onDelete}
          className="transition-[transform,opacity] duration-150 active:scale-[0.97]"
        >
          Remover
        </Button>
      </div>
    </div>
  )
}

// ── Collection row ────────────────────────────────────────────────────────
function CollectionRow({ collection, index, artworkCount, isSaving, onEdit, onDelete }) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-border/15 bg-white/70 px-4 py-3 transition-[border-color,box-shadow] hover:border-border/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
      style={{ animation: `rowIn 0.35s cubic-bezier(0.16,1,0.3,1) ${index * 0.045}s both` }}
    >
      <div className="min-w-[240px] flex-1">
        <p className="font-['Intel_One_Mono'] text-[13px] text-ink">
          {collection.name || 'Sem nome'}
        </p>
        <div className="mt-2 grid gap-1 text-[11.5px] text-ink-muted/70">
          {[
            ['Slug', `/${collection.slug || 'sem-slug'}`],
            ['Tagline', collection.tagline || 'Sem tagline'],
            ['Descrição', collection.description || 'Sem descrição'],
            ['Obras', artworkCount],
          ].map(([lbl, val]) => (
            <p key={lbl} className="flex flex-wrap gap-2">
              <span className="font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.2em] text-ink/45">
                {lbl}
              </span>
              <span>{val}</span>
            </p>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="transition-[transform,box-shadow] duration-150 hover:shadow-sm active:scale-[0.97]"
        >
          Editar
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={isSaving}
          onClick={onDelete}
          className="transition-[transform,opacity] duration-150 active:scale-[0.97]"
        >
          Remover
        </Button>
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────
function EmptyState({ label }) {
  return (
    <div
      className="rounded-[18px] border border-dashed border-border/25 bg-white/60 px-6 py-10 text-center"
      style={{ animation: 'fadeUp 0.4s ease-out both' }}
    >
      <p className="font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.2em] text-ink/40">
        {label}
      </p>
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────
function AdminDashboard({ logoImg, defaultTab = 'artworks' }) {
  const { user, signOut, isLoading: isAuthLoading } = useSupabaseAuth()
  const navigate = useNavigate()
  const { collections, artworks, isLoading, isSaving, error, deleteCollection, deleteArtwork } =
    useAdminData({ enabled: Boolean(user) })

  const [artworkSort, setArtworkSort] = useState('year-desc')
  const [collectionSort, setCollectionSort] = useState('name-asc')
  const [artworkPage, setArtworkPage] = useState(1)
  const [collectionPage, setCollectionPage] = useState(1)

  const [minLoadDone, setMinLoadDone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMinLoadDone(true), 400)
    return () => clearTimeout(t)
  }, [])

  const isArtworksPage = defaultTab === 'artworks'

  const counts = useMemo(
    () => ({
      collections: collections.length,
      artworks: artworks.length,
      uploads: artworks.filter((a) => a.image_url).length,
    }),
    [collections.length, artworks],
  )

  const summaryItems = useMemo(() => {
    if (isArtworksPage) return [
      { label: 'Obras', value: counts.artworks },
      { label: 'Uploads', value: counts.uploads },
    ]
    return [
      { label: 'Coleções', value: counts.collections },
      { label: 'Obras', value: counts.artworks },
    ]
  }, [counts, isArtworksPage])

  const collectionNameById = useMemo(
    () => new Map(collections.map((c) => [String(c.id), c.name])),
    [collections],
  )

  const artworksCountByCollection = useMemo(() => {
    const map = new Map()
    artworks.forEach((a) => {
      if (!a.collection_id) return
      const k = String(a.collection_id)
      map.set(k, (map.get(k) || 0) + 1)
    })
    return map
  }, [artworks])

  const resolveArtworkImage = (imageUrl) => {
    if (!imageUrl) return ''
    if (imageUrl.startsWith('http')) return imageUrl
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imageUrl)
    return data.publicUrl
  }

  const sortedArtworks = useMemo(() => {
    const list = artworks.map((a) => ({ ...a, _resolvedImg: resolveArtworkImage(a.image_url) }))
    switch (artworkSort) {
      case 'year-asc':  return list.sort((a, b) => (Number(a.year) || 0) - (Number(b.year) || 0))
      case 'title-asc': return list.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'pt'))
      case 'title-desc':return list.sort((a, b) => (b.title || '').localeCompare(a.title || '', 'pt'))
      default:          return list.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))
    }
  }, [artworks, artworkSort])

  const sortedCollections = useMemo(() => {
    const list = [...collections]
    switch (collectionSort) {
      case 'name-desc': return list.sort((a, b) => (b.name || '').localeCompare(a.name || '', 'pt'))
      case 'id-desc':   return list.sort((a, b) => (b.id || 0) - (a.id || 0))
      case 'id-asc':    return list.sort((a, b) => (a.id || 0) - (b.id || 0))
      default:          return list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt'))
    }
  }, [collections, collectionSort])

  const artworkPageCount = Math.ceil(sortedArtworks.length / PAGE_SIZE)
  const collectionPageCount = Math.ceil(sortedCollections.length / PAGE_SIZE)
  const artworkPageSafe = Math.min(artworkPage, artworkPageCount || 1)
  const collectionPageSafe = Math.min(collectionPage, collectionPageCount || 1)

  const pagedArtworks = sortedArtworks.slice(
    (artworkPageSafe - 1) * PAGE_SIZE, artworkPageSafe * PAGE_SIZE,
  )
  const pagedCollections = sortedCollections.slice(
    (collectionPageSafe - 1) * PAGE_SIZE, collectionPageSafe * PAGE_SIZE,
  )

  const goTo = (path) => navigate(path)

  const handleDeleteCollection = async (collection) => {
    if (isSaving) return
    if (!window.confirm(`Remover a coleção "${collection.name}"?`)) return
    await deleteCollection(collection.id)
  }

  const handleDeleteArtwork = async (artwork) => {
    if (isSaving) return
    if (!window.confirm(`Remover a obra "${artwork.title}"?`)) return
    await deleteArtwork(artwork.id)
  }

  if (!user && !isAuthLoading) return <AdminAccessDenied logoImg={logoImg} />

  const showSkeleton = isLoading || !minLoadDone

  return (
    <>
      <style>{KEYFRAMES}</style>

      <AdminPageShell
        logoImg={logoImg}
        title="Painel de Coleções e Obras"
        subtitle="Gerencie coleções, obras e uploads com o visual do portfólio."
        onSignOut={signOut}
      >
        {error && (
          <Alert className="mb-4" style={{ animation: 'slideIn 0.35s ease-out both' }}>
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ── Summary cards ── */}
        {showSkeleton ? (
          <SummarySkeleton />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {summaryItems.map((item, i) => (
              <SummaryCard key={item.label} label={item.label} value={item.value} index={i} />
            ))}
          </div>
        )}

        <div className="space-y-4">
          {/* ── Toolbar ── */}
          {showSkeleton ? (
            <ToolbarSkeleton />
          ) : (
            <div
              className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-border/20 bg-surface-2/80 px-4 py-3 shadow-[0_12px_24px_rgba(64,47,1,0.08)]"
              style={{ animation: 'fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-border/20 bg-white/80 px-3 py-1 font-['Intel_One_Mono'] text-[9px] uppercase tracking-[0.24em] text-ink/50">
                  Ordenar
                </span>
                {isArtworksPage ? (
                  <Select
                    className="w-[220px]"
                    value={artworkSort}
                    onChange={(e) => { setArtworkSort(e.target.value); setArtworkPage(1) }}
                    options={artworkSortOptions}
                  />
                ) : (
                  <Select
                    className="w-[220px]"
                    value={collectionSort}
                    onChange={(e) => { setCollectionSort(e.target.value); setCollectionPage(1) }}
                    options={collectionSortOptions}
                  />
                )}
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => goTo(isArtworksPage ? '/admin/obras/nova' : '/admin/colecoes/nova')}
                className="transition-[transform,box-shadow] duration-150 hover:shadow-md active:scale-[0.97]"
              >
                {isArtworksPage ? 'Nova obra' : 'Nova coleção'}
              </Button>
            </div>
          )}

          {/* ── List card ── */}
          {showSkeleton ? (
            <ListSkeleton isArtworks={isArtworksPage} />
          ) : (
            <Card style={{ animation: 'fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.18s both' }}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>{isArtworksPage ? 'Obras' : 'Coleções'}</CardTitle>
                    <CardDescription>
                      {isArtworksPage
                        ? 'Edite ou remova obras existentes.'
                        : 'Edite ou remova coleções existentes.'}
                    </CardDescription>
                  </div>
                  <Badge
                    className="px-4 py-1 text-[9px]"
                    style={{ animation: 'fadeUp 0.4s ease-out 0.28s both' }}
                  >
                    {isArtworksPage ? counts.artworks : counts.collections} itens
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {isArtworksPage ? (
                  <>
                    {pagedArtworks.length === 0 ? (
                      <EmptyState label="Nenhuma obra cadastrada" />
                    ) : (
                      <div className="space-y-3">
                        {pagedArtworks.map((artwork, i) => (
                          <ArtworkRow
                            key={artwork.id}
                            artwork={artwork}
                            index={i}
                            collectionLabel={
                              artwork.collection_id
                                ? collectionNameById.get(String(artwork.collection_id))
                                : ''
                            }
                            isSaving={isSaving}
                            onEdit={() => goTo(`/admin/obras/editar?id=${artwork.id}`)}
                            onDelete={() => handleDeleteArtwork(artwork)}
                          />
                        ))}
                      </div>
                    )}
                    <Pagination
                      page={artworkPageSafe}
                      pageCount={artworkPageCount}
                      onPageChange={setArtworkPage}
                    />
                  </>
                ) : (
                  <>
                    {pagedCollections.length === 0 ? (
                      <EmptyState label="Nenhuma coleção cadastrada" />
                    ) : (
                      <div className="space-y-3">
                        {pagedCollections.map((collection, i) => (
                          <CollectionRow
                            key={collection.id}
                            collection={collection}
                            index={i}
                            artworkCount={artworksCountByCollection.get(String(collection.id)) || 0}
                            isSaving={isSaving}
                            onEdit={() => goTo(`/admin/colecoes/editar?id=${collection.id}`)}
                            onDelete={() => handleDeleteCollection(collection)}
                          />
                        ))}
                      </div>
                    )}
                    <Pagination
                      page={collectionPageSafe}
                      pageCount={collectionPageCount}
                      onPageChange={setCollectionPage}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </AdminPageShell>
    </>
  )
}

export default AdminDashboard