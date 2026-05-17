import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const COLLECTIONS_TABLE = 'collections'
const ARTWORKS_TABLE = 'artworks'
const STORAGE_BUCKET = 'daniela'

function resolveArtworkImage(imageUrl) {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http')) return imageUrl
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imageUrl)
  return data?.publicUrl || ''
}

export function usePortfolioData({ enabled = true } = {}) {
  const [collections, setCollections] = useState([])
  const [artworks, setArtworks] = useState([])
  const [isLoading, setIsLoading] = useState(Boolean(enabled))
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    if (!enabled) return
    setIsLoading(true)
    setError('')

    try {
      const [collectionsRes, artworksRes] = await Promise.all([
        supabase.from(COLLECTIONS_TABLE).select('*').order('name', { ascending: true }),
        supabase.from(ARTWORKS_TABLE).select('*').order('year', { ascending: false }),
      ])

      if (collectionsRes.error || artworksRes.error) {
        setError(
          collectionsRes.error?.message || artworksRes.error?.message || 'Erro ao carregar dados.'
        )
      }

      setCollections(collectionsRes.data || [])
      setArtworks(artworksRes.data || [])
    } finally {
      setIsLoading(false)
      setHasLoaded(true)
    }
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
      .channel('portfolio-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: COLLECTIONS_TABLE }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: ARTWORKS_TABLE }, loadData)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [enabled, loadData])

  const normalizedArtworks = useMemo(
    () =>
      artworks.map((artwork) => ({
        ...artwork,
        year: artwork.year ? String(artwork.year) : '',
        image: resolveArtworkImage(artwork.image_url),
      })),
    [artworks]
  )

  return {
    collections,
    artworks: normalizedArtworks,
    isLoading,
    hasLoaded,
    error,
    reload: loadData,
  }
}
