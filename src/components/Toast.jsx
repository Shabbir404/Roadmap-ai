import { useState, useEffect } from 'react'

export function useToast() {
    const [toasts, setToasts] = useState([])

    function showToast(message, type = 'success') {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3000)
    }

    return { toasts, showToast }
}

export function ToastContainer({ toasts }) {
    const colors = {
        success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#10B981', icon: '✓' },
        info: { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)', color: '#60A5FA', icon: '⚡' },
        warn: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: '#F59E0B', icon: '⚠' },
    }

    return (
        <div style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 999,
            display: 'flex', flexDirection: 'column', gap: 10,
        }}>
            {toasts.map(t => {
                const c = colors[t.type] || colors.success
                return (
                    <div key={t.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '12px 18px', borderRadius: 12,
                        background: c.bg, border: `1px solid ${c.border}`,
                        backdropFilter: 'blur(20px)',
                        animation: 'fadeUp 0.3s ease both',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    }}>
                        <span style={{ color: c.color, fontSize: 14 }}>{c.icon}</span>
                        <span style={{
                            fontFamily: 'DM Sans', fontSize: '0.88rem',
                            color: 'rgba(255,255,255,0.85)',
                        }}>{t.message}</span>
                    </div>
                )
            })}
        </div>
    )
}