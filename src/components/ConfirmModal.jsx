export default function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    danger = false,
    onConfirm,
    onCancel,
}) {
    if (!open) return null

    return (
        <div
            role="dialog"
            aria-modal="true"
            style={{
                position: 'fixed', inset: 0, zIndex: 10000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 20,
                background: 'rgba(0,0,0,0.72)',
                backdropFilter: 'blur(10px)',
            }}
            onClick={onCancel}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: 400,
                    background: '#0E0E1A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 20,
                    padding: '28px 24px 24px',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
                }}
            >
                <h3 style={{
                    fontFamily: 'Space Grotesk', fontWeight: 700,
                    fontSize: '1.15rem', color: 'rgba(255,255,255,0.95)',
                    marginBottom: 10, letterSpacing: '-0.02em',
                }}>{title}</h3>
                <p style={{
                    fontFamily: 'DM Sans', fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.45)', lineHeight: 1.65,
                    marginBottom: 24,
                }}>{message}</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onCancel} style={{
                        padding: '10px 18px', borderRadius: 10, cursor: 'pointer',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontFamily: 'DM Sans', fontSize: '0.88rem',
                        color: 'rgba(255,255,255,0.55)',
                    }}>{cancelLabel}</button>
                    <button type="button" onClick={onConfirm} style={{
                        padding: '10px 20px', borderRadius: 10, cursor: 'pointer', border: 'none',
                        background: danger ? 'linear-gradient(135deg,#EF4444,#DC2626)' : 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                        fontFamily: 'Space Grotesk', fontSize: '0.88rem', fontWeight: 600, color: 'white',
                    }}>{confirmLabel}</button>
                </div>
            </div>
        </div>
    )
}
