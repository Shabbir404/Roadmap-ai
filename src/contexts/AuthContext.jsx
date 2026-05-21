import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase.js'
import { syncLocalDataToCloud } from '../utils/storage.js'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Handle the OAuth redirect
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null
            setUser(currentUser)
            setLoading(false)
            if (currentUser) {
                syncLocalDataToCloud().catch(err => console.error('Initial sync error:', err))
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            const currentUser = session?.user ?? null
            setUser(currentUser)
            setLoading(false)
            if (currentUser && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
                syncLocalDataToCloud().catch(err => console.error('Auth change sync error:', err))
            }
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