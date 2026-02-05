"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useUserProgress } from '../../hooks/useUserProgress';
import { JournalService, VitalsService } from '@/lib/services';
import PremiumBackground from '../../components/PremiumBackground';

export default function JournalTask() {
    const { addPoints } = useUserProgress();
    const [entry, setEntry] = useState("");
    const [prompts, setPrompts] = useState([
        "What is one thing that made you smile today?",
        "Describe a challenge you faced and how you handled it.",
        "What are you grateful for right now?",
        "Write yourself a letter of encouragement."
    ]);
    const [promptIdx, setPromptIdx] = useState(0);
    const [selectedMood, setSelectedMood] = useState(null);
    const [view, setView] = useState("compose"); // compose | success | saving

    const moods = [
        { label: "Happy", emoji: "😊", intensity: 8 },
        { label: "Calm", emoji: "😌", intensity: 7 },
        { label: "Anxious", emoji: "😟", intensity: 4 },
        { label: "Sad", emoji: "😢", intensity: 3 },
        { label: "Frustrated", emoji: "😤", intensity: 2 }
    ];

    useEffect(() => {
        // Load dynamic prompt via service
        JournalService.getPrompt().then(data => {
            if (data && data.prompt) {
                setPrompts(prev => [data.prompt, ...prev]);
            }
        }).catch(err => console.error("Failed to load prompt", err));
    }, []);

    const handleSave = async () => {
        setView("saving");
        try {
            // Save Journal Entry
            await JournalService.createEntry(entry, {
                mood: selectedMood,
                prompt: prompts[promptIdx]
            });

            // Log Mood as a vital if mood selected
            if (selectedMood) {
                const moodObj = moods.find(m => m.label === selectedMood);
                // We don't have a direct logMood on VitalsService but dashboard uses simple logic
                // Could enhance later. For now, journal service handles the mood storage per entry.
            }

            addPoints(50);
            setView("success");

            setTimeout(() => {
                setEntry("");
                setSelectedMood(null);
                setView("compose");
            }, 3000);
        } catch (error) {
            console.error("Failed to save entry:", error);
            setView("compose");
            // Optionally show error toast
        }
    };

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '80px', paddingBottom: '4rem' }}>
            <PremiumBackground />
            <Link href="/dashboard" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                &larr; Back to Dashboard
            </Link>

            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>

                {view === 'success' && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 10,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
                        <h2 style={{ fontSize: '2rem', color: '#fff' }}>Entry Saved!</h2>
                        <p style={{ color: '#94a3b8' }}>Great job reflecting today. (+50 XP)</p>
                    </div>
                )}

                {view === 'saving' && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 10,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Saving...</h2>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className="title" style={{ margin: 0 }}>Daily Reflection</h1>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{new Date().toLocaleDateString()}</div>
                </div>

                {/* Mood Selector */}
                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '600' }}>HOW ARE YOU FEELING?</p>
                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                        {moods.map((m) => (
                            <button
                                key={m.label}
                                onClick={() => setSelectedMood(m.label)}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '20px',
                                    border: `1px solid ${selectedMood === m.label ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                                    background: selectedMood === m.label ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <span style={{ marginRight: '0.5rem' }}>{m.emoji}</span>
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Prompt Area */}
                <div style={{ marginBottom: '1.5rem', background: 'rgba(56, 189, 248, 0.1)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>Writing Prompt</strong>
                        <span style={{ fontSize: '1.1rem', color: '#fff', fontStyle: 'italic' }}>"{prompts[promptIdx]}"</span>
                    </div>
                    <button
                        onClick={() => setPromptIdx((promptIdx + 1) % prompts.length)}
                        className="btn-icon"
                        title="Shuffle Prompt"
                    >
                        🔄
                    </button>
                </div>

                {/* Editor */}
                <textarea
                    className="input-field"
                    style={{
                        height: '350px',
                        resize: 'none',
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '1.5rem',
                        color: '#e2e8f0'
                    }}
                    placeholder="Start typing your thoughts here..."
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                ></textarea>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{entry.length} characters</p>
                    <button
                        onClick={handleSave}
                        className="btn btn-primary"
                        disabled={!entry.trim() || !selectedMood}
                        style={{ padding: '0.8rem 2.5rem', opacity: (!entry.trim() || !selectedMood) ? 0.5 : 1 }}
                    >
                        Save Entry
                    </button>
                </div>
            </div>

            <style jsx>{`
                .btn-icon {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: #fff;
                    width: 40px; height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex; alignItems: center; justifyContent: center;
                    transition: all 0.2s;
                    font-size: 1.2rem;
                }
                .btn-icon:hover { background: rgba(255,255,255,0.2); transform: rotate(180deg); }
            `}</style>
        </main>
    );
}
