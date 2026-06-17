import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const COLLECTIONS_TABLE = 'collections'
const ARTWORKS_TABLE = 'artworks'
const HOME_CONTENT_TABLE = 'home_page_content'
const STORAGE_BUCKET = 'daniela'

function parseNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

function parseIdentifier(value) {
  if (value === null || value === undefined || value === '') return null
  const trimmed = String(value).trim()
  if (!trimmed) return null
  if (/^\d+$/.test(trimmed)) return Number(trimmed)
  return trimmed
}

export function useAdminData({ enabled } = {}) {
  const [collections, setCollections] = useState([])
  const [artworks, setArtworks] = useState([])
  const [homeContent, setHomeContent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    if (!enabled) return
    setIsLoading(true)
    setError('')

    const [collectionsRes, artworksRes, homeContentRes] = await Promise.all([
      supabase.from(COLLECTIONS_TABLE).select('*').order('name', { ascending: true }),
      supabase.from(ARTWORKS_TABLE).select('*').order('year', { ascending: false }),
      supabase.from(HOME_CONTENT_TABLE).select('*').eq('page_key', 'home').maybeSingle(),
    ])

    if (collectionsRes.error || artworksRes.error || homeContentRes.error) {
      setError(
        collectionsRes.error?.message ||
          artworksRes.error?.message ||
          homeContentRes.error?.message ||
          'Erro ao carregar dados.'
      )
    }

    setCollections(collectionsRes.data || [])
    setArtworks(artworksRes.data || [])
    setHomeContent(homeContentRes.data || null)
    setIsLoading(false)
  }, [enabled])

  useEffect(() => {
    if (!enabled) return undefined
    const timeoutId = setTimeout(() => {
      loadData()
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [enabled, loadData])

  useEffect(() => {
    if (!enabled) return undefined

    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: COLLECTIONS_TABLE }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: ARTWORKS_TABLE }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: HOME_CONTENT_TABLE }, loadData)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [enabled, loadData])

  const uploadArtworkImage = async (file) => {
    const extension = file.name.split('.').pop() || 'jpg'
    const path = `artworks/${crypto.randomUUID()}.${extension}`

    const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file)
    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  const uploadHomeAsset = async (file, folder) => {
    const extension = file.name.split('.').pop() || (folder === 'videos' ? 'mp4' : 'jpg')
    const path = `home/${folder}/${crypto.randomUUID()}.${extension}`

    const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file)
    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  const upsertCollection = useCallback(
    async (form, collectionId) => {
      setIsSaving(true)
      setError('')

      const payload = {
        name: form.name?.trim() || '',
        slug: form.slug?.trim() || '',
        tagline: form.tagline?.trim() || '',
        description: form.description?.trim() || '',
      }

      try {
        if (collectionId) {
          const { error: updateError } = await supabase
            .from(COLLECTIONS_TABLE)
            .update(payload)
            .eq('id', collectionId)
          if (updateError) throw updateError
        } else {
          const { error: insertError } = await supabase.from(COLLECTIONS_TABLE).insert(payload)
          if (insertError) throw insertError
        }

        await loadData()
        return true
      } catch (submitError) {
        setError(submitError?.message || 'Erro ao salvar colecao.')
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [loadData],
  )

  const upsertArtwork = useCallback(
    async (form, artworkId, artworkFile) => {
      setIsSaving(true)
      setError('')

      try {
        let imageUrl = form.image_url?.trim() || ''
        if (artworkFile) {
          imageUrl = await uploadArtworkImage(artworkFile)
        }

        const typeKey = form.artwork_type?.trim().toLowerCase() || 'obra'
        const isCartao = typeKey === 'cartao'

        const payload = {
          title: form.title?.trim() || '',
          year: parseNumber(form.year),
          technique: isCartao ? null : (form.technique?.trim() || ''),
          size: form.size?.trim() || '',
          description: form.description?.trim() || '',
          category: isCartao ? null : (form.category?.trim().toLowerCase() || null),
          commission_source: isCartao ? null : (form.commission_source?.trim().toLowerCase() || null),
          partner_name: form.partner_name?.trim() || null,
          sale_status: isCartao ? null : (form.sale_status?.trim().toLowerCase() || null),
          image_url: imageUrl || null,
          collection_id: parseIdentifier(form.collection_id),
          artwork_type: typeKey,
        }

        if (artworkId) {
          const { error: updateError } = await supabase
            .from(ARTWORKS_TABLE)
            .update(payload)
            .eq('id', artworkId)
          if (updateError) throw updateError
        } else {
          const { error: insertError } = await supabase.from(ARTWORKS_TABLE).insert(payload)
          if (insertError) throw insertError
        }

        await loadData()
        return true
      } catch (submitError) {
        setError(submitError?.message || 'Erro ao salvar obra.')
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [loadData],
  )

  const upsertHomeContent = useCallback(
    async (form, heroImageFile, presentationVideoFile) => {
      setIsSaving(true)
      setError('')

      try {
        let heroImageUrl = form.hero_image_url?.trim() || ''
        let presentationVideoUrl = form.presentation_video_url?.trim() || ''

        if (heroImageFile) {
          heroImageUrl = await uploadHomeAsset(heroImageFile, 'images')
        }

        if (presentationVideoFile) {
          presentationVideoUrl = await uploadHomeAsset(presentationVideoFile, 'videos')
        }

        const payload = {
          page_key: 'home',
          hero_title: form.hero_title?.trim() || '',
          hero_image_url: heroImageUrl || null,
          presentation_video_url: presentationVideoUrl || null,
          updated_at: new Date().toISOString(),
        }

        const { error: upsertError } = await supabase
          .from(HOME_CONTENT_TABLE)
          .upsert(payload, { onConflict: 'page_key' })

        if (upsertError) throw upsertError

        await loadData()
        return true
      } catch (submitError) {
        setError(submitError?.message || 'Erro ao salvar o conteúdo da home.')
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [loadData],
  )

  const deleteCollection = useCallback(
    async (id) => {
      setIsSaving(true)
      setError('')

      try {
        const { error: deleteError } = await supabase.from(COLLECTIONS_TABLE).delete().eq('id', id)
        if (deleteError) throw deleteError
        await loadData()
        return true
      } catch (deleteErr) {
        setError(deleteErr?.message || 'Erro ao remover colecao.')
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [loadData],
  )

  const deleteArtwork = useCallback(
    async (id) => {
      setIsSaving(true)
      setError('')

      try {
        const { error: deleteError } = await supabase.from(ARTWORKS_TABLE).delete().eq('id', id)
        if (deleteError) throw deleteError
        await loadData()
        return true
      } catch (deleteErr) {
        setError(deleteErr?.message || 'Erro ao remover obra.')
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [loadData],
  )

  return {
    collections,
    artworks,
    homeContent,
    isLoading,
    isSaving,
    error,
    setError,
    loadData,
    upsertCollection,
    upsertArtwork,
    upsertHomeContent,
    deleteCollection,
    deleteArtwork,
  }
}
