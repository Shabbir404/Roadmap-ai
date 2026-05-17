import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase.js'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Handle the OAuth redirect
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth event:', event, session?.user?.email)
            setUser(session?.user ?? null)
            setLoading(false)
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
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
                skipBrowserRedirect: false,
            },
        })
        if (error) console.error('Sign in error:', error)
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