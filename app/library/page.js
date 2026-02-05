"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserProgress } from '../hooks/useUserProgress';

const sessions = [
    { id: 1, title: "Deep Sleep Journey", category: "Sleep", duration: "15 min", image: "/meditation-sleep.png", locked: true, cost: 50 },
    { id: 2, title: "Morning Focus", category: "Focus", duration: "10 min", image: "/dashboard-bg.png", locked: false, cost: 0 },
    { id: 3, title: "Anxiety SOS", category: "Anxiety", duration: "5 min", image: "/dashboard-bg.png", locked: false, cost: 0 },
    { id: 4, title: "Self-Compassion", category: "Kindness", duration: "12 min", image: "/dashboard-bg.png", locked: true, cost: 30 },
];

export default function LibraryPage() {
    const { points, addPoints } = useUserProgress();
    const [activeSession, setActiveSession] = useState(null);
    const [unlocked, setUnlocked] = useState([]); // Array of unlocked session IDs

    const handleSessionClick = (session) => {
        if (session.locked && !unlocked.includes(session.id)) {
            // Check if user can afford
            if (points >= session.cost) {
                const confirmUnlock = window.confirm(`Unlock "${session.title}" for ${session.cost} XP?`);
                if (confirmUnlock) {
                    addPoints(-session.cost); // Deduct points
                    setUnlocked([...unlocked, session.id]);
                }
            } else {
                alert(`You need ${session.cost} XP to unlock this session. You have ${points} XP.`);
            }
        } else {
            setActiveSession(session);
        }
    };

    const isLocked = (session) => session.locked && !unlocked.includes(session.id);

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h1 className="title" style={{ marginBottom: '0.5rem' }}>Mindful Library</h1>
                    <p className="subtitle">Guided audio sessions for every state of mind.</p>
                </div>
                <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span>✨</span>
                    <span style={{ fontWeight: 'bold', color: '#a78bfa' }}>{points} XP</span>
                </div>
            </div>

            {/* Active Player Mock */}
            {activeSession && (
                <div className="glass-card animate-fade-in" style={{ marginBottom: '3rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden' }}>
                        <Image src={activeSession.image} alt={activeSession.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ color: '#fff' }}>{activeSession.title}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                            <button className="player-btn">⏮️</button>
                            <button className="player-btn play">⏸️</button>
                            <button className="player-btn">⏭️</button>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '30%' }}></div>
                            </div>
                            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>04:20 / {activeSession.duration}</span>
                        </div>
                    </div>
                    <button onClick={() => setActiveSession(null)} className="close-btn">✕</button>
                </div>
            )}

            <div className="library-grid">
                {sessions.map(session => {
                    const locked = isLocked(session);
                    return (
                        <div key={session.id} className="glass-card session-card" onClick={() => handleSessionClick(session)}>
                            <div className="image-wrapper">
                                <Image src={session.image} alt={session.title} fill style={{ objectFit: 'cover', filter: locked ? 'grayscale(80%)' : 'none' }} />
                                {locked ? (
                                    <div className="play-overlay" style={{ opacity: 1, background: 'rgba(0,0,0,0.6)' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.5rem' }}>🔒</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{session.cost} XP</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="play-overlay">▶</div>
                                )}
                            </div>
                            <div className="card-content">
                                <span className="category-tag">{session.category}</span>
                                <h3 style={{ opacity: locked ? 0.7 : 1 }}>{session.title}</h3>
                                <p>{session.duration} • Guided</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                .library-grid {
                    display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 2rem;
                }
                .session-card {
                    padding: 0; overflow: hidden; cursor: pointer; transition: transform 0.2s;
                }
                .session-card:hover { transform: translateY(-5px); border-color: var(--primary); }
                
                .image-wrapper {
                    position: relative; height: 180px; width: 100%;
                }
                .play-overlay {
                    position: absolute; inset: 0; background: rgba(0,0,0,0.3);
                    display: flex; align-items: center; justifyContent: center;
                    font-size: 3rem; color: white; opacity: 0; transition: opacity 0.2s;
                }
                .session-card:hover .play-overlay { opacity: 1; }

                .card-content { padding: 1.5rem; }
                .category-tag {
                    font-size: 0.8rem; color: var(--primary); text-transform: uppercase;
                    letter-spacing: 1px; font-weight: bold;
                }
                .card-content h3 { color: #fff; margin: 0.5rem 0; font-size: 1.2rem; }
                .card-content p { color: '#94a3b8'; font-size: 0.9rem; }

                .player-btn {
                    background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #cbd5e1;
                }
                .player-btn.play {
                    background: white; color: #020617; width: 50px; height: 50px;
                    border-radius: 50%; font-size: 1.2rem;
                    display: flex; align-items: center; justifyContent: center;
                }
                .progress-bar {
                    flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; position: relative;
                }
                .progress-fill {
                    height: 100%; background: var(--primary); border-radius: 3px;
                }
                .close-btn {
                    background: transparent; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer;
                }
            `}</style>
        </main>
    );
}
