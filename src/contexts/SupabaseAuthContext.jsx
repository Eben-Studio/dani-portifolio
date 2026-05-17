import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const SupabaseAuthContext = createContext(null)

export function SupabaseAuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadSession = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession()
      if (!isMounted) return
      if (sessionError) {
        setError(sessionError.message)
      }
      setSession(data?.session ?? null)
      setUser(data?.session?.user ?? null)
      setIsLoading(false)
    }

    loadSession()

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
    })

    return () => {
      isMounted = false
      data?.subscription?.unsubscribe()
    }
  }, [])

  const signInWithPassword = useCallback(async ({ email, password }) => {
    setError('')
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      throw authError
    }

    return data
  }, [])

  const signOut = useCallback(async () => {
    setError('')
    const { error: authError } = await supabase.auth.signOut()
    if (authError) {
      setError(authError.message)
      throw authError
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user,
      isLoading,
      error,
      signInWithPassword,
      signOut,
    }),
    [session, user, isLoading, error, signInWithPassword, signOut]
  )

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext)
  if (!context) {
    throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider')
  }
  return context
}
