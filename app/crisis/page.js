"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';

export default function CrisisPage() {
    const [seconds, setSeconds] = useState(4);
    const [phase, setPhase] = useState("Inhale");

    // Simple breathing pacer for immediate grounding
    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    if (phase === "Inhale") { setPhase("Hold"); return 4; }
                    if (phase === "Hold") { setPhase("Exhale"); return 8; }
                    setPhase("Inhale"); return 4;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [phase]);

    return (
        <main className="crisis-layout animate-fade-in">
            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
                <NextImage src="/crisis-bg.png" alt="Calm" fill style={{ objectFit: 'cover', opacity: 0.6 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #020617)' }}></div>
            </div>

            <div className="crisis-content">

                {/* Immediate Grounding Pacer */}
                <div className="grounding-pacer glass-card">
                    <div className="breath-circle-container">
                        <div className={`breath-circle ${phase.toLowerCase()}`}></div>
                        <div className="breath-text">
                            <h3>{phase}</h3>
                            <span>{seconds}s</span>
                        </div>
                    </div>
                    <div className="grounding-info">
                        <h2>Breathe with me.</h2>
                        <p>Focus on this circle. You are safe. You are not alone. Everything else can wait for a few moments.</p>
                    </div>
                </div>

                <div className="emergency-warning glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
                    <h1 style={{ color: '#fca5a5', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Immediate Danger?</h1>
                    <p style={{ color: '#e2e8f0' }}>If you have already harmed yourself or are about to, please call <strong>911</strong> (US/Canada), <strong>999</strong> (UK), or your local emergency number immediately.</p>
                </div>

                <div className="resources-grid">
                    <div className="resource-card glass-card priority">
                        <div className="resource-tag">Primary</div>
                        <h3>988 Lifeline</h3>
                        <p>24/7 free support for emotional distress or suicidal thoughts.</p>
                        <a href="tel:988" className="call-btn">Call 988</a>
                    </div>

                    <div className="resource-card glass-card">
                        <h3>Crisis Text Line</h3>
                        <p>Prefer typing? Connect with a crisis counselor via text.</p>
                        <a href="sms:741741" className="text-btn">Text HOME to 741741</a>
                    </div>

                    <div className="resource-card glass-card">
                        <h3>LGBTQ+ Support</h3>
                        <p>The Trevor Project offers specialized support for LGBTQ young people.</p>
                        <a href="tel:1-866-488-7386" className="alt-btn">Call TrevorLifeline</a>
                    </div>

                    <div className="resource-card glass-card">
                        <h3>Veterans Crisis</h3>
                        <p>Specialized responders for veterans and their families.</p>
                        <a href="tel:988" className="alt-btn">Call 988 (Press 1)</a>
                    </div>
                </div>

                <div className="safety-footer">
                    <Link href="/dashboard" className="btn-return">← I feel better, return to Dashboard</Link>
                </div>
            </div>

            <style jsx>{`
                .crisis-layout { min-height: 100vh; padding: 120px 1.5rem 4rem; position: relative; }
                .crisis-content { max-width: 800px; margin: 0 auto; display: grid; gap: 2rem; }

                .grounding-pacer { 
                    display: flex; align-items: center; gap: 2rem; padding: 2.5rem;
                    background: rgba(255,255,255,0.03);
                }
                .breath-circle-container { position: relative; width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .breath-circle { 
                    position: absolute; border: 2px solid var(--primary); border-radius: 50%; 
                    transition: all 1s ease-in-out;
                }
                .breath-circle.inhale { width: 100%; height: 100%; background: rgba(56, 189, 248, 0.2); transform: scale(1.1); }
                .breath-circle.hold { width: 100%; height: 100%; background: rgba(56, 189, 248, 0.1); transform: scale(1.1); }
                .breath-circle.exhale { width: 40%; height: 40%; background: transparent; transform: scale(1); }
                
                .breath-text { text-align: center; z-index: 10; }
                .breath-text h3 { font-size: 1.2rem; color: #fff; text-transform: uppercase; letter-spacing: 1px; }
                .breath-text span { font-size: 1.5rem; font-weight: 800; color: var(--primary); }

                .grounding-info h2 { font-size: 1.8rem; color: #fff; margin-bottom: 0.5rem; }
                .grounding-info p { color: #94a3b8; line-height: 1.6; }

                .resources-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
                .resource-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.8rem; height: 100%; }
                .resource-card h3 { color: #fff; font-size: 1.2rem; }
                .resource-card p { color: #94a3b8; font-size: 0.9rem; flex: 1; margin-bottom: 1rem; }
                
                .resource-tag { background: #ef4444; color: #fff; font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 4px; width: fit-content; text-transform: uppercase; }

                .call-btn, .text-btn, .alt-btn {
                    text-align: center; padding: 0.8rem; border-radius: 10px; font-weight: 700; text-decoration: none; transition: all 0.2s;
                }
                .call-btn { background: #ef4444; color: #fff; }
                .text-btn { background: var(--primary); color: #fff; }
                .alt-btn { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
                
                .call-btn:hover { background: #dc2626; box-shadow: 0 0 15px rgba(239, 68, 68, 0.4); }

                .btn-return { color: #64748b; text-decoration: none; font-weight: 500; font-size: 0.9rem; transition: color 0.2s; }
                .btn-return:hover { color: #fff; }
                .safety-footer { text-align: center; margin-top: 2rem; }

                @media (max-width: 600px) {
                    .grounding-pacer { flex-direction: column; text-align: center; padding: 1.5rem; }
                }
            `}</style>
        </main>
    );
}
