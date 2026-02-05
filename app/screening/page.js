"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PremiumBackground from '../components/PremiumBackground';
import { useUserProgress } from '../hooks/useUserProgress';
import { ScreeningService } from '@/lib/services';

export default function ScreeningPage() {
    const router = useRouter();
    const { addPoints } = useUserProgress();

    const [screenings, setScreenings] = useState([]);
    const [selectedScreening, setSelectedScreening] = useState(null);
    const [instrument, setInstrument] = useState(null);
    const [responses, setResponses] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState('select'); // 'select' | 'questionnaire' | 'result'

    useEffect(() => {
        loadScreenings();
    }, []);

    const loadScreenings = async () => {
        try {
            const data = await ScreeningService.getAvailableScreenings();
            setScreenings(data.availableScreenings || []);
        } catch (err) {
            console.error('Failed to load screenings:', err);
            // Fallback screenings if API fails
            setScreenings([
                { type: 'phq9', name: 'PHQ-9', description: 'Depression screening', questionCount: 9, estimatedTime: '5 minutes' },
                { type: 'gad7', name: 'GAD-7', description: 'Anxiety screening', questionCount: 7, estimatedTime: '4 minutes' },
                { type: 'pss10', name: 'PSS-10', description: 'Stress assessment', questionCount: 10, estimatedTime: '5 minutes' },
                { type: 'burnout', name: 'Burnout Assessment', description: 'Work exhaustion screening', questionCount: 8, estimatedTime: '4 minutes' }
            ]);
        }
    };

    const startScreening = async (type) => {
        setIsLoading(true);
        try {
            const data = await ScreeningService.getScreening(type);
            setInstrument(data.instrument);
            setSelectedScreening(type);
            setResponses(new Array(data.instrument.questions.length).fill(null));
            setCurrentStep(0);
            setResult(null);
            setStep('questionnaire');
        } catch (err) {
            console.error('Failed to load screening:', err);
            alert('Failed to load screening. Please try again.');
        }
        setIsLoading(false);
    };

    const handleAnswer = (value) => {
        const newResponses = [...responses];
        newResponses[currentStep] = value;
        setResponses(newResponses);
    };

    const nextQuestion = () => {
        if (currentStep < instrument.questions.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevQuestion = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const submitScreening = async () => {
        if (responses.some(r => r === null)) {
            alert('Please answer all questions before submitting.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await ScreeningService.submitScreening(selectedScreening, responses);
            setResult(data);
            setStep('result');
            addPoints(50);
        } catch (err) {
            console.error('Failed to submit screening:', err);
            alert('Failed to submit. Please try again.');
        }
        setIsLoading(false);
    };

    const reset = () => {
        setSelectedScreening(null);
        setInstrument(null);
        setResponses([]);
        setCurrentStep(0);
        setResult(null);
        setStep('select');
    };

    const getSeverityColor = (severity) => {
        if (!severity) return '#10b981';
        if (severity.includes('severe')) return '#ef4444';
        if (severity.includes('moderate')) return '#f59e0b';
        if (severity.includes('mild')) return '#fbbf24';
        return '#10b981';
    };

    const screeningIcons = {
        phq9: '🧠',
        gad7: '😟',
        pss10: '📊',
        burnout: '🔥'
    };

    // RESULT VIEW
    if (step === 'result' && result) {
        return (
            <main className="screening-layout animate-fade-in">
                <PremiumBackground />
                <div className="screening-content">
                    <div className="glass-card result-card">
                        <div className="result-header">
                            <h2>Screening Complete</h2>
                            <p className="instrument-name">{result.instrumentName}</p>
                        </div>

                        <div className="score-display">
                            <div
                                className="score-ring"
                                style={{
                                    '--percent': result.percentage,
                                    '--color': getSeverityColor(result.severity)
                                }}
                            >
                                <span className="score-number">{result.score}</span>
                                <span className="score-max">/ {result.maxScore}</span>
                            </div>
                            <div className="severity-badge" style={{ background: `${getSeverityColor(result.severity)}20`, color: getSeverityColor(result.severity) }}>
                                {result.severity?.toUpperCase() || 'COMPLETE'}
                            </div>
                        </div>

                        <div className="recommendation-box">
                            <h3>Clinical Recommendation</h3>
                            <p>{result.clinicalRecommendation}</p>
                        </div>

                        <div className="personalized-section">
                            <h3>Next Steps</h3>
                            <div className="recommendations-list">
                                {result.personalizedRecommendations?.slice(0, 4).map((rec, i) => (
                                    <Link key={i} href={rec.tool || '/dashboard'} className="rec-item">
                                        <span className="rec-title">{rec.title}</span>
                                        <span className="rec-desc">{rec.description}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <p className="disclaimer">{result.disclaimer}</p>

                        <div className="result-actions">
                            <button className="btn btn-primary" onClick={reset}>
                                Take Another Assessment
                            </button>
                            <button className="btn btn-outline" onClick={() => router.push('/dashboard')}>
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .screening-layout { min-height: 100vh; padding: 120px 2rem 4rem; position: relative; }
                    .screening-content { max-width: 700px; margin: 0 auto; }
                    
                    .result-card { padding: 3rem; text-align: center; }
                    .result-header h2 { color: #fff; font-size: 1.8rem; margin: 0 0 0.5rem; }
                    .instrument-name { color: #64748b; font-size: 0.9rem; margin: 0; }

                    .score-display { margin: 2.5rem 0; }
                    .score-ring {
                        width: 150px; height: 150px; margin: 0 auto 1.5rem;
                        border-radius: 50%; background: conic-gradient(var(--color) calc(var(--percent) * 1%), rgba(255,255,255,0.1) 0);
                        display: flex; flex-direction: column; align-items: center; justify-content: center;
                        position: relative;
                    }
                    .score-ring::before {
                        content: ''; position: absolute; inset: 12px;
                        background: #0f172a; border-radius: 50%;
                    }
                    .score-number { position: relative; font-size: 2.5rem; font-weight: 800; color: #fff; z-index: 1; }
                    .score-max { position: relative; font-size: 0.9rem; color: #64748b; z-index: 1; }
                    .severity-badge {
                        display: inline-block; padding: 0.5rem 1.5rem; border-radius: 20px;
                        font-size: 0.85rem; font-weight: 700; letter-spacing: 1px;
                    }

                    .recommendation-box {
                        background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 16px;
                        margin: 2rem 0; text-align: left;
                    }
                    .recommendation-box h3 { color: #fff; margin: 0 0 0.5rem; font-size: 1rem; }
                    .recommendation-box p { color: #94a3b8; margin: 0; line-height: 1.6; }

                    .personalized-section { text-align: left; margin: 2rem 0; }
                    .personalized-section h3 { color: #fff; margin: 0 0 1rem; font-size: 1rem; }
                    .recommendations-list { display: grid; gap: 0.8rem; }
                    .rec-item {
                        display: flex; flex-direction: column; padding: 1rem;
                        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
                        border-radius: 12px; text-decoration: none; transition: all 0.2s;
                    }
                    .rec-item:hover { background: rgba(255,255,255,0.08); transform: translateX(4px); }
                    .rec-title { color: #fff; font-weight: 600; font-size: 0.95rem; }
                    .rec-desc { color: #64748b; font-size: 0.8rem; margin-top: 0.3rem; }

                    .disclaimer { font-size: 0.75rem; color: #475569; margin: 2rem 0; line-height: 1.5; }
                    
                    .result-actions { display: flex; gap: 1rem; justify-content: center; }
                `}</style>
            </main>
        );
    }

    // QUESTIONNAIRE VIEW
    if (step === 'questionnaire' && instrument) {
        const progress = ((currentStep + 1) / instrument.questions.length) * 100;

        return (
            <main className="screening-layout animate-fade-in">
                <PremiumBackground />
                <div className="screening-content">
                    <div className="glass-card questionnaire-card">
                        <div className="q-header">
                            <button className="back-btn" onClick={reset}>← Back</button>
                            <span className="q-progress-text">Question {currentStep + 1} of {instrument.questions.length}</span>
                        </div>

                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>

                        <div className="question-area">
                            <p className="q-label">Over the last 2 weeks, how often have you been bothered by:</p>
                            <h2 className="question-text">{instrument.questions[currentStep]}</h2>
                        </div>

                        <div className="options-list">
                            {instrument.options.map((opt, i) => (
                                <button
                                    key={i}
                                    className={`option-btn ${responses[currentStep] === opt.value ? 'selected' : ''}`}
                                    onClick={() => handleAnswer(opt.value)}
                                >
                                    <span className="opt-value">{opt.value}</span>
                                    <span className="opt-label">{opt.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="nav-buttons">
                            <button
                                className="btn btn-outline"
                                onClick={prevQuestion}
                                disabled={currentStep === 0}
                            >
                                Previous
                            </button>

                            {currentStep < instrument.questions.length - 1 ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={nextQuestion}
                                    disabled={responses[currentStep] === null}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={submitScreening}
                                    disabled={responses[currentStep] === null || isLoading}
                                >
                                    {isLoading ? 'Processing...' : 'Submit'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .screening-layout { min-height: 100vh; padding: 120px 2rem 4rem; position: relative; }
                    .screening-content { max-width: 600px; margin: 0 auto; }

                    .questionnaire-card { padding: 2rem; }
                    .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                    .back-btn { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 0.9rem; }
                    .back-btn:hover { color: #fff; }
                    .q-progress-text { color: #64748b; font-size: 0.85rem; }

                    .progress-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin-bottom: 2rem; }
                    .progress-fill { height: 100%; background: linear-gradient(to right, #38bdf8, #a78bfa); transition: width 0.3s; }

                    .question-area { margin-bottom: 2rem; }
                    .q-label { color: #64748b; font-size: 0.85rem; margin: 0 0 0.5rem; }
                    .question-text { color: #fff; font-size: 1.3rem; line-height: 1.4; margin: 0; }

                    .options-list { display: grid; gap: 0.8rem; margin-bottom: 2rem; }
                    .option-btn {
                        display: flex; align-items: center; gap: 1rem; padding: 1rem 1.2rem;
                        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
                        border-radius: 12px; cursor: pointer; transition: all 0.2s; text-align: left;
                    }
                    .option-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
                    .option-btn.selected { background: rgba(56, 189, 248, 0.15); border-color: #38bdf8; }
                    .opt-value {
                        width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.1);
                        display: flex; align-items: center; justify-content: center;
                        font-weight: 700; color: #fff; font-size: 0.9rem; flex-shrink: 0;
                    }
                    .option-btn.selected .opt-value { background: #38bdf8; color: #020617; }
                    .opt-label { color: #e2e8f0; font-size: 0.95rem; }

                    .nav-buttons { display: flex; justify-content: space-between; gap: 1rem; }
                    .nav-buttons .btn { flex: 1; }
                `}</style>
            </main>
        );
    }

    // SELECTION VIEW (Default)
    return (
        <main className="screening-layout animate-fade-in">
            <PremiumBackground />
            <div className="screening-content">
                <header className="page-header">
                    <h1 className="title" style={{ fontSize: '2.5rem', margin: 0 }}>Mental Health Screenings</h1>
                    <p className="subtitle" style={{ margin: '0.5rem 0 0' }}>
                        Take a validated assessment to understand your current state.
                    </p>
                </header>

                <div className="screenings-grid">
                    {screenings.map((screening) => (
                        <button
                            key={screening.type}
                            className="glass-card screening-card"
                            onClick={() => startScreening(screening.type)}
                            disabled={isLoading}
                        >
                            <div className="s-icon">{screeningIcons[screening.type] || '📋'}</div>
                            <h3>{screening.name}</h3>
                            <p>{screening.description}</p>
                            <div className="s-meta">
                                <span>{screening.questionCount} questions</span>
                                <span>•</span>
                                <span>{screening.estimatedTime}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="info-box glass-card">
                    <h3>📋 About These Screenings</h3>
                    <p>
                        These are evidence-based self-assessment tools used in clinical practice.
                        They help identify symptoms but are <strong>not diagnostic</strong>.
                        For a formal diagnosis, please consult a licensed mental health professional.
                    </p>
                </div>

                <div className="quick-checkin glass-card">
                    <h3>Quick Check-in</h3>
                    <p>Don't have time for a full assessment? Take a quick 3-question check-in instead.</p>
                    <button
                        className="btn btn-outline"
                        onClick={() => router.push('/screening/quick')}
                    >
                        Quick Check-in (1 min)
                    </button>
                </div>
            </div>

            <style jsx>{`
                .screening-layout { min-height: 100vh; padding: 120px 2rem 4rem; position: relative; }
                .screening-content { max-width: 800px; margin: 0 auto; }

                .page-header { margin-bottom: 2.5rem; }

                .screenings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2rem; }

                .screening-card {
                    padding: 2rem; text-align: left; cursor: pointer;
                    transition: all 0.3s; border: 1px solid rgba(255,255,255,0.05);
                }
                .screening-card:hover { transform: translateY(-4px); border-color: rgba(56, 189, 248, 0.3); }
                .screening-card:disabled { opacity: 0.5; cursor: wait; }

                .s-icon { font-size: 2.5rem; margin-bottom: 1rem; }
                .screening-card h3 { color: #fff; font-size: 1.1rem; margin: 0 0 0.5rem; }
                .screening-card p { color: #64748b; font-size: 0.9rem; margin: 0 0 1rem; line-height: 1.4; }
                .s-meta { display: flex; gap: 0.5rem; font-size: 0.75rem; color: #475569; }

                .info-box, .quick-checkin { padding: 1.5rem; margin-bottom: 1.5rem; }
                .info-box h3, .quick-checkin h3 { color: #fff; margin: 0 0 0.8rem; font-size: 1rem; }
                .info-box p, .quick-checkin p { color: #94a3b8; margin: 0; line-height: 1.6; font-size: 0.9rem; }
                .info-box strong { color: #f59e0b; }
                .quick-checkin { display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; }

                @media (max-width: 600px) {
                    .screenings-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </main>
    );
}
