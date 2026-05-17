import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase.js'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    // async function signInWithGoogle() {
    //     await supabase.auth.signInWithOAuth({
    //         provider: 'google',
    //         options: {
    //             redirectTo: window.location.origin,
    //         },
    //     })
    // }

    async function signInWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
    }


    async function signOut() {
        await supabase.auth.signOut()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}