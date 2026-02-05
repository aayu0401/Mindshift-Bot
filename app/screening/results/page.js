"use client";

import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { Suspense, useEffect, useState } from 'react';
import { useUserProgress } from '../../hooks/useUserProgress';

function ResultsContent() {
    const searchParams = useSearchParams();
    const score = parseInt(searchParams.get('score') || '0');
    const { addPoints } = useUserProgress();
    const [pointsAdded, setPointsAdded] = useState(false);

    useEffect(() => {
        if (!pointsAdded) {
            // Give points for viewing results / completing reflection
            // Assuming points for screening were given at 'finishAssessment' in previous page
            // But we can add a 'Reflection Bonus' later
            setPointsAdded(true);
        }
    }, []);

    // Clinical Logic Mapping (PHQ/GAD/Resilience Hybrid Scale)
    // 9 Questions * 3 Max = 27 Max Score
    // 0-4: Minimal (Stable)
    // 5-9: Mild (Stress)
    // 10-14: Moderate (Anxiety/Low Mood)
    // 15+: Severe (High Risk)

    let status = "";
    let description = "";
    let color = "";
    let badge = "";
    let recommendedTasks = [];

    if (score <= 4) {
        status = "Emotional Stability";
        badge = "🌱 Thriving";
        description = "Your responses suggest you are coping well. Focus on maintenance and building resilience for the future.";
        color = "#34d399"; // Green
        recommendedTasks = ["journal", "breathing"]; // Maintenance
    } else if (score <= 9) {
        status = "Mild Stress";
        badge = "⚠️ Elevated Stress";
        description = "You are showing signs of mild stress or fatigue. Proactive self-care and rest are recommended.";
        color = "#fbbf24"; // Amber
        recommendedTasks = ["breathing", "journal", "grounding"];
    } else if (score <= 14) {
        status = "Moderate Distress";
        badge = "🛡️ Needs Attention";
        description = "Your emotional baseline is currently strained. We recommend using our coping tools daily and monitoring your sleep.";
        color = "#f97316"; // Orange
        recommendedTasks = ["grounding", "breathing", "bot"];
    } else {
        status = "Significant Strain";
        badge = "🚨 High Priority";
        description = "You seem to be carrying a heavy load. Please consider speaking with a professional. Our AI Companion is here to listen in the meantime.";
        color = "#ef4444"; // Red
        recommendedTasks = ["bot", "grounding", "crisis"];
    }

    const allTasks = {
        "breathing": { title: "Relaxation Breathing", icon: "🌬️", desc: "Regulate nervous system (4-7-8)", href: "/tasks/breathing" },
        "grounding": { title: "Sensory Grounding", icon: "🖐️", desc: "Stop anxiety spirals instantly", href: "/tasks/grounding" },
        "journal": { title: "Reflection Journal", icon: "📝", desc: "Process thoughts safely", href: "/tasks/journal" },
        "bot": { title: "Talk to MindshiftR", icon: "🤖", desc: "Vent Mode / Advice Mode", href: "/bot" },
        "crisis": { title: "Crisis Resources", icon: "🆘", desc: "Immediate professional help", href: "#crisis" } // Placeholder link
    };

    return (
        <div className="glass-card animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', borderTop: `4px solid ${color}` }}>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                    display: 'inline-block',
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    background: `${color}20`,
                    color: color,
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    border: `1px solid ${color}40`
                }}>
                    {badge}
                </div>
                <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Analysis Complete</h1>
                <p style={{ color: '#94a3b8' }}>Based on your responses, here is your personalized wellness snapshot.</p>
            </div>

            <div className="report-grid">
                <div className="status-box" style={{ borderColor: color }}>
                    <h3 style={{ color: '#fff', opacity: 0.8 }}>Primary Insight</h3>
                    <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.5rem 0', color: color }}>{status}</div>
                    <p>{description}</p>
                </div>

                <div className="ai-note">
                    <h3>🤖 Non-Diagnostic Interpretation</h3>
                    <p>
                        "I've noticed patterns associated with {score > 9 ? 'heightened vigilance' : 'balanced regulation'}.
                        Your focus should be on {score > 9 ? 'nervous system de-escalation' : 'habit reinforcement'}."
                    </p>
                </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📅</span> Your Immediate Care Plan
                </h2>
                <div className="task-grid">
                    {recommendedTasks.map(taskId => {
                        const t = allTasks[taskId];
                        return (
                            <Link key={taskId} href={t.href} className="task-card">
                                <span style={{ fontSize: '2.5rem' }}>{t.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>{t.title}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{t.desc}</div>
                                </div>
                                <div className="arrow">&rarr;</div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                <Link href="/dashboard" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Save to Dashboard</Link>
                <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                    Results are private and stored locally. Not a medical diagnosis.
                </div>
            </div>

            <style jsx>{`
                .report-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
                }
                .status-box {
                    background: rgba(255,255,255,0.03);
                    padding: 2rem; border-radius: 16px;
                    border: 1px solid;
                }
                .ai-note {
                    background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(129, 140, 248, 0.1));
                    padding: 2rem; border-radius: 16px;
                    border: 1px solid rgba(129, 140, 248, 0.2);
                }
                .ai-note h3 { font-size: 1rem; color: #818cf8; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; }
                .ai-note p { font-style: italic; color: #cbd5e1; }

                .task-grid {
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;
                }
                .task-card {
                    display: flex; align-items: center; gap: 1rem;
                    padding: 1.5rem;
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    transition: all 0.2s;
                    text-decoration: none;
                }
                .task-card:hover {
                    background: rgba(30, 41, 59, 0.9);
                    transform: translateY(-3px);
                    border-color: rgba(56, 189, 248, 0.5);
                }
                .arrow { margin-left: auto; color: var(--primary); font-size: 1.2rem; }

                @media (max-width: 768px) {
                    .report-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <Suspense fallback={<div style={{ textAlign: 'center', color: '#fff' }}>Generating Analysis...</div>}>
                <ResultsContent />
            </Suspense>
        </main>
    );
}
