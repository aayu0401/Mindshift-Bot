"use client";

export default function PremiumBackground() {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: '#020617', overflow: 'hidden' }}>

            {/* Deep Field Gradient */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #020617 70%)',
                opacity: 1
            }}></div>

            {/* Animated Orbs */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>

            {/* Grid Overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '100px 100px',
                opacity: 0.3,
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
            }}></div>

            <style jsx>{`
            .orb {
                position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4;
                animation: floatOrb 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
            }
            .orb-1 { width: 600px; height: 600px; background: #0ea5e9; top: -100px; left: -100px; animation-duration: 25s; }
            .orb-2 { width: 500px; height: 500px; background: #6366f1; top: 40%; right: -150px; animation-duration: 30s; animation-delay: -5s; }
            .orb-3 { width: 400px; height: 400px; background: #d946ef; bottom: -100px; left: 20%; animation-duration: 20s; animation-delay: -10s; }

            @keyframes floatOrb {
                0% { transform: translate(0, 0) scale(1); }
                100% { transform: translate(50px, 50px) scale(1.1); }
            }
        `}</style>
        </div>
    );
}
