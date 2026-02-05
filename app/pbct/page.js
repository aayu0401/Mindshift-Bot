"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useUserProgress } from '../hooks/useUserProgress';

const pbctQuestions = [
    "I adapt easily to changes in my life.",
    "I can handle stressful situations without feeling overwhelmed.",
    "I have close relationships that provide support.",
    "I tend to bounce back quickly after hard times.",
    "I have a positive outlook on my future.",
    "I can identify my emotions clearly.",
    "I have healthy ways to relax and unwind.",
    "I feel in control of my life decisions.",
    "I am satisfied with my work/life balance.",
    "I practice self-care regularly."
];

const options = [
    { value: 1, label: "Rarely" },
    { value: 2, label: "Sometimes" },
    { value: 3, label: "Frequently" },
    { value: 4, label: "Always" }
];

export default function PBCTAssessment() {
    const { addPoints } = useUserProgress();
    const [answers, setAnswers] = useState({});
    const [finalScore, setFinalScore] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAnswer = (qIdx, value) => {
        setAnswers(prev => ({ ...prev, [qIdx]: value }));
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        const score = Object.values(answers).reduce((a, b) => a + b, 0);
        setTimeout(() => {
            setFinalScore(score);
            addPoints(50);
            setIsSubmitting(false);
        }, 1200);
    };

    const getAnalysis = (score) => {
        if (score <= 15) return { level: "Establishing", color: "#f43f5e", desc: "You're in the early stages of building resilience. We recommend focused grounding daily." };
        if (score <= 30) return { level: "Scaling", color: "#fbbf24", desc: "You have a solid foundation but may feel strained under pressure. Try social bonding tasks." };
        return { level: "Harmonious", color: "#10b981", desc: "You show high psychological balance. Maintain these habits to serve as a community beacon." };
    };

    const isComplete = Object.keys(answers).length === pbctQuestions.length;

    return (
        <main className="pbct-layout animate-fade-in">
            <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
                <NextImage src="/pbct-bg.png" alt="Zen" fill style={{ objectFit: 'cover', opacity: 0.2 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #020617)' }}></div>
            </div>

            <div className="pbct-container">
                <header className="pbct-header">
                    <Link href="/dashboard" className="back-link">← Dashboard</Link>
                    <div className="balance-badge">PBCT Psychological Balance Index</div>
                </header>

                {finalScore === null ? (
                    <div className="glass-card questionnaire">
                        <section className="intro">
                            <h1>Balance & Coping Scan</h1>
                            <p>Map your internal resilience and emotional equilibrium.</p>
                        </section>

                        <div className="q-list">
                            {pbctQuestions.map((q, idx) => (
                                <div key={idx} className="q-item">
                                    <p className="q-text">{idx + 1}. {q}</p>
                                    <div className="options-row">
                                        {options.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => handleAnswer(idx, opt.value)}
                                                className={`opt-btn ${answers[idx] === opt.value ? 'active' : ''}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="btn btn-primary submit-btn"
                            disabled={!isComplete || isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? "Calculating Balance Index..." : "Review My Profile"}
                        </button>
                    </div>
                ) : (
                    <div className="glass-card result-panel animate-slide-up">
                        <div className="result-header">
                            <div className="index-display" style={{ color: getAnalysis(finalScore).color }}>
                                <span className="val">{finalScore}</span>
                                <span className="max">/ 40</span>
                            </div>
                            <div>
                                <h2 style={{ color: '#fff' }}>Resilience Tier: {getAnalysis(finalScore).level}</h2>
                                <p style={{ color: '#94a3b8' }}>Psychological Balance Rating</p>
                            </div>
                        </div>

                        <div className="analysis-box">
                            <p>{getAnalysis(finalScore).desc}</p>
                        </div>

                        <div className="roadmap">
                            <h3>Growth Roadmap</h3>
                            <div className="roadmap-grid">
                                <div className="r-card">
                                    <span className="r-icon">🛡️</span>
                                    <h4>Shield</h4>
                                    <p>Daily boundary setting exercises.</p>
                                </div>
                                <div className="r-card">
                                    <span className="r-icon">🌊</span>
                                    <h4>Flow</h4>
                                    <p>Advanced HRV breathing techniques.</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                            <button onClick={() => setFinalScore(null)} className="btn btn-outline">Retake</button>
                            <Link href="/dashboard" className="btn btn-primary">Sync with Care Plan</Link>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .pbct-layout { min-height: 100vh; padding: 100px 2rem 5rem; }
                .pbct-container { max-width: 800px; margin: 0 auto; }
                
                .pbct-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .back-link { color: #94a3b8; text-decoration: none; font-weight: 500; }
                .balance-badge { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; border: 1px solid rgba(16,185,129,0.2); }

                .questionnaire { padding: 3rem; }
                .intro h1 { font-size: 2.2rem; color: #fff; margin-bottom: 0.5rem; }
                .intro p { color: #94a3b8; margin-bottom: 3rem; }

                .q-list { display: flex; flex-direction: column; gap: 2.5rem; margin-bottom: 3.5rem; }
                .q-item { padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .q-text { color: #e2e8f0; font-size: 1.2rem; margin-bottom: 1.2rem; font-weight: 500; }
                
                .options-row { display: flex; gap: 1rem; }
                .opt-btn { 
                    flex: 1; padding: 0.8rem; background: rgba(255,255,255,0.03); 
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #94a3b8;
                    cursor: pointer; transition: all 0.2s; font-size: 0.9rem; font-weight: 600;
                }
                .opt-btn.active { background: #10b981; color: #020617; border-color: #10b981; transform: scale(1.05); }

                .submit-btn { width: 100%; padding: 1.2rem; font-size: 1.1rem; }

                .result-panel { padding: 3rem; }
                .result-header { display: flex; align-items: center; gap: 2.5rem; margin-bottom: 2.5rem; }
                .index-display { text-align: center; line-height: 1; }
                .idx-display .val { font-size: 4rem; font-weight: 900; display: block; }
                .index-display .val { font-size: 4rem; font-weight: 900; }
                .index-display .max { font-size: 1.2rem; opacity: 0.5; margin-left: 0.5rem; }
                
                .analysis-box { background: rgba(255,255,255,0.03); padding: 2rem; border-radius: 16px; margin-bottom: 2.5rem; color: #cbd5e1; font-size: 1.1rem; border-left: 4px solid #10b981; }
                
                .roadmap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.5rem; }
                .r-card { padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
                .r-icon { font-size: 2rem; display: block; margin-bottom: 1rem; }
                .r-card h4 { color: #fff; margin-bottom: 0.5rem; }
                .r-card p { color: #94a3b8; font-size: 0.85rem; }

                @media (max-width: 600px) {
                    .options-row { flex-direction: column; }
                    .roadmap-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </main>
    );
}
