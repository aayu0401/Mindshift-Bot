"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useUserProgress } from '../hooks/useUserProgress';

const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead or of hurting yourself in some way"
];

const options = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half" },
    { value: 3, label: "Nearly every day" }
];

export default function CBTScreening() {
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
            addPoints(40);
            setIsSubmitting(false);
        }, 1200);
    };

    const getAnalysis = (score) => {
        if (score <= 4) return { level: "Minimal", color: "#34d399", desc: "You're in a resilient state. Continue your wellness habits." };
        if (score <= 9) return { level: "Mild", color: "#818cf8", desc: "Mild depressive symptoms noted. Consider more 'Me-Time' and activity scheduling." };
        if (score <= 14) return { level: "Moderate", color: "#fbbf24", desc: "Noticeable symptoms. We recommend scheduling a talk with a professional." };
        return { level: "Severe", color: "#f43f5e", desc: "Urgent care recommended. Please reach out to our Crisis Support immediately." };
    };

    const isComplete = Object.keys(answers).length === phq9Questions.length;

    return (
        <main className="cbt-layout animate-fade-in">
            <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
                <NextImage src="/cbt-bg.png" alt="Clinic" fill style={{ objectFit: 'cover', opacity: 0.2 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #020617)' }}></div>
            </div>

            <div className="cbt-container">
                <header className="cbt-header">
                    <Link href="/dashboard" className="back-link">← Dashboard</Link>
                    <div className="clinical-badge">PHQ-9 Standardized Assessment</div>
                </header>

                {finalScore === null ? (
                    <div className="glass-card questionnaire">
                        <section className="intro">
                            <h1>CBT Behavioral Screening</h1>
                            <p>Over the last 2 weeks, how often have you been bothered by these problems?</p>
                        </section>

                        <div className="q-list">
                            {phq9Questions.map((q, idx) => (
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
                            {isSubmitting ? "Generating Clinical Profile..." : "Analyze Results"}
                        </button>
                    </div>
                ) : (
                    <div className="glass-card result-panel animate-slide-up">
                        <div className="result-header">
                            <span className="score-circle" style={{ borderColor: getAnalysis(finalScore).color }}>
                                {finalScore}
                            </span>
                            <div>
                                <h2 style={{ color: '#fff' }}>Clinical Baseline: {getAnalysis(finalScore).level}</h2>
                                <p style={{ color: '#94a3b8' }}>Total PHQ-9 Severity Score</p>
                            </div>
                        </div>

                        <div className="analysis-box" style={{ borderLeft: `4px solid ${getAnalysis(finalScore).color}` }}>
                            <p>{getAnalysis(finalScore).desc}</p>
                        </div>

                        <div className="next-steps">
                            <h3>Recommended Protocol</h3>
                            <div className="protocol-list">
                                <div className="p-item">✓ Behavioral Activation Scheduling</div>
                                <div className="p-item">✓ Thought Record Maintenance</div>
                                {finalScore > 10 && <div className="p-item urgent">⚠ Professional Consultation advised</div>}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button onClick={() => setFinalScore(null)} className="btn btn-outline">Retake</button>
                            <Link href="/dashboard" className="btn btn-primary">Return to Care Plan</Link>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .cbt-layout { min-height: 100vh; padding: 100px 2rem 5rem; }
                .cbt-container { max-width: 800px; margin: 0 auto; }
                
                .cbt-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .back-link { color: #94a3b8; text-decoration: none; font-weight: 500; }
                .clinical-badge { background: rgba(56, 189, 248, 0.1); color: #38bdf8; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; border: 1px solid rgba(56,189,248,0.2); }

                .questionnaire { padding: 3rem; }
                .intro h1 { font-size: 2.2rem; color: #fff; margin-bottom: 0.5rem; }
                .intro p { color: #94a3b8; margin-bottom: 3rem; }

                .q-list { display: flex; flex-direction: column; gap: 2rem; margin-bottom: 3rem; }
                .q-item { padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .q-text { color: #e2e8f0; font-size: 1.1rem; margin-bottom: 1rem; font-weight: 500; }
                
                .options-row { display: flex; gap: 0.8rem; flex-wrap: wrap; }
                .opt-btn { 
                    flex: 1; min-width: 100px; padding: 0.6rem; background: rgba(255,255,255,0.03); 
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #94a3b8;
                    cursor: pointer; transition: all 0.2s; font-size: 0.85rem;
                }
                .opt-btn.active { background: #38bdf8; color: #020617; border-color: #38bdf8; font-weight: 700; }

                .submit-btn { width: 100%; padding: 1rem; font-size: 1.1rem; }

                .result-panel { padding: 3rem; }
                .result-header { display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; }
                .score-circle { 
                    width: 100px; height: 100px; border-radius: 50%; border: 6px solid;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 2.5rem; font-weight: 800; color: #fff;
                }
                .analysis-box { background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; color: #cbd5e1; }
                
                .protocol-list { display: grid; gap: 0.8rem; margin-top: 1rem; }
                .p-item { padding: 0.8rem 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; color: #94a3b8; font-size: 0.95rem; }
                .p-item.urgent { background: rgba(244, 63, 94, 0.1); color: #f43f5e; border: 1px solid rgba(244,63,94,0.2); }

                @media (max-width: 600px) {
                    .options-row { flex-direction: column; }
                }
            `}</style>
        </main>
    );
}
