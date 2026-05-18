import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const COLLECTIONS_TABLE = 'collections'
const ARTWORKS_TABLE = 'artworks'
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
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    if (!enabled) return
    setIsLoading(true)
    setError('')

    const [collectionsRes, artworksRes] = await Promise.all([
      supabase.from(COLLECTIONS_TABLE).select('*').order('name', { ascending: true }),
      supabase.from(ARTWORKS_TABLE).select('*').order('year', { ascending: false }),
    ])

    if (collectionsRes.error || artworksRes.error) {
      setError(collectionsRes.error?.message || artworksRes.error?.message || 'Erro ao carregar dados.')
    }

    setCollections(collectionsRes.data || [])
    setArtworks(artworksRes.data || [])
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

        const payload = {
          title: form.title?.trim() || '',
          year: parseNumber(form.year),
          technique: form.technique?.trim() || '',
          size: form.size?.trim() || '',
          description: form.description?.trim() || '',
          category: form.category?.trim().toLowerCase() || null,
          commission_source: form.commission_source?.trim().toLowerCase() || null,
          partner_name: form.partner_name?.trim() || null,
          sale_status: form.sale_status?.trim().toLowerCase() || null,
          image_url: imageUrl || null,
          collection_id: parseIdentifier(form.collection_id),
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
    isLoading,
    isSaving,
    error,
    setError,
    loadData,
    upsertCollection,
    upsertArtwork,
    deleteCollection,
    deleteArtwork,
  }
}
