"use client";
import { useState, useEffect } from 'react';

// A simple global toast event system
export const toastEvent = new EventTarget();

export function showToast(message, type = 'success') {
    const event = new CustomEvent('toast', { detail: { message, type } });
    toastEvent.dispatchEvent(event);
}

export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleToast = (e) => {
            const id = Date.now();
            setToasts(prev => [...prev, { id, ...e.detail }]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 3000);
        };

        toastEvent.addEventListener('toast', handleToast);
        return () => toastEvent.removeEventListener('toast', handleToast);
    }, []);

    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    {t.type === 'success' && '✨'}
                    {t.type === 'error' && '⚠️'}
                    {t.message}
                </div>
            ))}
            <style jsx>{`
                .toast-container {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .toast {
                    background: rgba(15, 23, 42, 0.95);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #fff;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    animation: slideIn 0.3s ease;
                    display: flex; align-items: center; gap: 0.5rem;
                    backdrop-filter: blur(8px);
                }
                .toast-success { border-left: 4px solid #34d399; }
                .toast-error { border-left: 4px solid #ef4444; }

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
