"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PremiumBackground from '../components/PremiumBackground';
import { VitalsService } from '@/lib/services';

export default function VitalsPage() {
    const [vitals, setVitals] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Load stored history
        const storedHistory = VitalsService.getVitalsHistory();
        setHistory(storedHistory);

        if (storedHistory.length > 0) {
            const latest = storedHistory[storedHistory.length - 1];
            setVitals(latest);
            // Auto-analyze latest
            analyzeVitals(latest, storedHistory);
        }
    }, []);

    const connectWearable = async () => {
        setIsLoading(true);
        // Simulate wearable connection
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsConnected(true);
        await syncVitals();
        setIsLoading(false);
    };

    const syncVitals = async () => {
        setIsLoading(true);

        // Simulate fetching from wearable (in production: Apple HealthKit, Google Fit, etc.)
        const newVitals = VitalsService.simulateWearableData();
        setVitals(newVitals);

        // Store for history
        const updatedHistory = VitalsService.storeVitals(newVitals);
        setHistory(updatedHistory);

        // Analyze
        await analyzeVitals(newVitals, updatedHistory);
        setIsLoading(false);
    };

    const analyzeVitals = async (currentVitals, currentHistory) => {
        try {
            const result = await VitalsService.analyzeVitals(currentVitals, {
                history: currentHistory
            });
            setAnalysis(result);
        } catch (err) {
            console.error('Analysis failed:', err);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#fbbf24';
        if (score >= 40) return '#f97316';
        return '#ef4444';
    };

    const getPatternIcon = (pattern) => {
        const icons = {
            anxiety: '😰',
            depression: '😔',
            burnout: '🔥',
            stress: '⚡',
            recovery: '✨'
        };
        return icons[pattern] || '📊';
    };

    return (
        <main className="vitals-layout animate-fade-in">
            <PremiumBackground />

            <div className="vitals-content">
                <header className="page-header">
                    <div>
                        <h1 className="title" style={{ fontSize: '2.5rem', margin: 0 }}>Health Vitals</h1>
                        <p className="subtitle" style={{ margin: '0.5rem 0 0' }}>
                            Mental wellness insights from your biometric data
                        </p>
                    </div>
                    {isConnected ? (
                        <button
                            className="btn btn-primary"
                            onClick={syncVitals}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Syncing...' : '🔄 Sync Now'}
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={connectWearable}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Connecting...' : '⌚ Connect Wearable'}
                        </button>
                    )}
                </header>

                {!vitals && !isLoading && (
                    <div className="glass-card empty-state">
                        <div className="empty-icon">⌚</div>
                        <h2>Connect Your Wearable</h2>
                        <p>Link your smartwatch or fitness tracker to unlock mental health insights from your biometric data.</p>
                        <div className="supported-devices">
                            <span>Supported: Apple Watch • Fitbit • Garmin • Samsung Galaxy Watch • Oura Ring</span>
                        </div>
                        <button className="btn btn-primary" onClick={connectWearable} disabled={isLoading}>
                            Get Started
                        </button>
                    </div>
                )}

                {vitals && (
                    <>
                        {/* Wellness Score Card */}
                        {analysis && (
                            <div className="glass-card wellness-score-card">
                                <div className="score-visual">
                                    <svg viewBox="0 0 120 120" className="score-ring">
                                        <circle
                                            cx="60" cy="60" r="54"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth="12"
                                        />
                                        <circle
                                            cx="60" cy="60" r="54"
                                            fill="none"
                                            stroke={getScoreColor(analysis.wellnessScore)}
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                            strokeDasharray={`${(analysis.wellnessScore / 100) * 339} 339`}
                                            transform="rotate(-90 60 60)"
                                        />
                                    </svg>
                                    <div className="score-value">
                                        <span className="score-number">{analysis.wellnessScore}</span>
                                        <span className="score-label">Wellness</span>
                                    </div>
                                </div>
                                <div className="score-details">
                                    <h2>Your Wellness Score</h2>
                                    <p className="score-insight">
                                        {analysis.insights?.[0]?.message || 'Analyzing your biometric patterns...'}
                                    </p>
                                    <div className="score-breakdown">
                                        {analysis.scoreBreakdown && Object.entries(analysis.scoreBreakdown).map(([key, value]) => (
                                            <div key={key} className="breakdown-item">
                                                <span className="breakdown-label">{key}</span>
                                                <div className="breakdown-bar">
                                                    <div
                                                        className="breakdown-fill"
                                                        style={{
                                                            width: `${value}%`,
                                                            background: getScoreColor(value)
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="breakdown-value">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Current Vitals Grid */}
                        <div className="vitals-grid">
                            <div className="glass-card vital-card">
                                <div className="vital-icon">💓</div>
                                <div className="vital-info">
                                    <span className="vital-value">{vitals.hrv} <small>ms</small></span>
                                    <span className="vital-label">HRV</span>
                                </div>
                                <div className={`vital-status ${vitals.hrv > 50 ? 'good' : vitals.hrv > 30 ? 'moderate' : 'low'}`}>
                                    {vitals.hrv > 50 ? 'Excellent' : vitals.hrv > 30 ? 'Normal' : 'Low'}
                                </div>
                            </div>

                            <div className="glass-card vital-card">
                                <div className="vital-icon">❤️</div>
                                <div className="vital-info">
                                    <span className="vital-value">{vitals.restingHR} <small>bpm</small></span>
                                    <span className="vital-label">Resting HR</span>
                                </div>
                                <div className={`vital-status ${vitals.restingHR < 70 ? 'good' : vitals.restingHR < 85 ? 'moderate' : 'elevated'}`}>
                                    {vitals.restingHR < 70 ? 'Optimal' : vitals.restingHR < 85 ? 'Normal' : 'Elevated'}
                                </div>
                            </div>

                            <div className="glass-card vital-card">
                                <div className="vital-icon">😴</div>
                                <div className="vital-info">
                                    <span className="vital-value">{vitals.sleepHours} <small>hrs</small></span>
                                    <span className="vital-label">Sleep</span>
                                </div>
                                <div className={`vital-status ${vitals.sleepHours >= 7 ? 'good' : vitals.sleepHours >= 6 ? 'moderate' : 'low'}`}>
                                    {vitals.sleepHours >= 7 ? 'Good' : vitals.sleepHours >= 6 ? 'Fair' : 'Poor'}
                                </div>
                            </div>

                            <div className="glass-card vital-card">
                                <div className="vital-icon">🚶</div>
                                <div className="vital-info">
                                    <span className="vital-value">{(vitals.steps / 1000).toFixed(1)} <small>k</small></span>
                                    <span className="vital-label">Steps</span>
                                </div>
                                <div className={`vital-status ${vitals.steps >= 10000 ? 'good' : vitals.steps >= 5000 ? 'moderate' : 'low'}`}>
                                    {vitals.steps >= 10000 ? 'Active' : vitals.steps >= 5000 ? 'Moderate' : 'Low'}
                                </div>
                            </div>
                        </div>

                        {/* Detected Patterns */}
                        {analysis?.detectedPatterns?.length > 0 && (
                            <div className="glass-card patterns-card">
                                <h3>Detected Patterns</h3>
                                <div className="patterns-list">
                                    {analysis.detectedPatterns.map((pattern, i) => (
                                        <div key={i} className="pattern-item">
                                            <div className="pattern-header">
                                                <span className="pattern-icon">{getPatternIcon(pattern.pattern)}</span>
                                                <div className="pattern-info">
                                                    <span className="pattern-name">{pattern.description}</span>
                                                    <span className="pattern-confidence">
                                                        {pattern.confidence}% confidence
                                                    </span>
                                                </div>
                                            </div>
                                            <ul className="pattern-indicators">
                                                {pattern.indicators?.map((ind, j) => (
                                                    <li key={j}>{ind}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Alerts */}
                        {analysis?.alerts?.length > 0 && (
                            <div className="alerts-section">
                                {analysis.alerts.map((alert, i) => (
                                    <div key={i} className={`glass-card alert-card ${alert.urgency}`}>
                                        <span className="alert-icon">⚠️</span>
                                        <p>{alert.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Recommendations */}
                        {analysis?.recommendations?.length > 0 && (
                            <div className="glass-card recommendations-card">
                                <h3>Personalized Recommendations</h3>
                                <div className="recommendations-grid">
                                    {analysis.recommendations.map((rec, i) => (
                                        <Link key={i} href={rec.path} className="recommendation-item">
                                            <span className={`rec-priority ${rec.priority}`}>{rec.priority}</span>
                                            <h4>{rec.task}</h4>
                                            <p>{rec.reason}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <Link href="/bot" className="btn btn-primary">
                                💬 Talk to AI About This
                            </Link>
                            <Link href="/screening" className="btn btn-outline">
                                📋 Take Assessment
                            </Link>
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .vitals-layout {
                    min-height: 100vh;
                    padding: 120px 2rem 4rem;
                    position: relative;
                }

                .vitals-content {
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 2rem;
                }

                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                }

                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: 1.5rem;
                }

                .empty-state h2 {
                    color: #fff;
                    font-size: 1.8rem;
                    margin-bottom: 1rem;
                }

                .empty-state p {
                    color: #94a3b8;
                    margin-bottom: 1.5rem;
                    max-width: 500px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .supported-devices {
                    font-size: 0.8rem;
                    color: #64748b;
                    margin-bottom: 2rem;
                }

                .wellness-score-card {
                    display: flex;
                    gap: 2.5rem;
                    padding: 2.5rem;
                    margin-bottom: 1.5rem;
                }

                .score-visual {
                    position: relative;
                    width: 160px;
                    height: 160px;
                    flex-shrink: 0;
                }

                .score-ring {
                    width: 100%;
                    height: 100%;
                }

                .score-value {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .score-number {
                    font-size: 3rem;
                    font-weight: 800;
                    color: #fff;
                }

                .score-label {
                    font-size: 0.8rem;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .score-details {
                    flex: 1;
                }

                .score-details h2 {
                    color: #fff;
                    font-size: 1.3rem;
                    margin: 0 0 0.5rem;
                }

                .score-insight {
                    color: #94a3b8;
                    margin: 0 0 1.5rem;
                    line-height: 1.6;
                }

                .score-breakdown {
                    display: grid;
                    gap: 0.8rem;
                }

                .breakdown-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .breakdown-label {
                    width: 100px;
                    font-size: 0.75rem;
                    color: #94a3b8;
                    text-transform: capitalize;
                }

                .breakdown-bar {
                    flex: 1;
                    height: 6px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 3px;
                    overflow: hidden;
                }

                .breakdown-fill {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 0.5s;
                }

                .breakdown-value {
                    width: 30px;
                    text-align: right;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #fff;
                }

                .vitals-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .vital-card {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .vital-icon {
                    font-size: 2rem;
                    margin-bottom: 0.8rem;
                }

                .vital-value {
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: #fff;
                }

                .vital-value small {
                    font-size: 0.7rem;
                    font-weight: 400;
                    color: #64748b;
                }

                .vital-label {
                    font-size: 0.75rem;
                    color: #64748b;
                    margin-top: 0.3rem;
                }

                .vital-status {
                    margin-top: 0.8rem;
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .vital-status.good {
                    background: rgba(16, 185, 129, 0.15);
                    color: #10b981;
                }

                .vital-status.moderate {
                    background: rgba(251, 191, 36, 0.15);
                    color: #fbbf24;
                }

                .vital-status.low, .vital-status.elevated {
                    background: rgba(239, 68, 68, 0.15);
                    color: #ef4444;
                }

                .patterns-card, .recommendations-card {
                    padding: 2rem;
                    margin-bottom: 1.5rem;
                }

                .patterns-card h3, .recommendations-card h3 {
                    color: #fff;
                    font-size: 1.1rem;
                    margin: 0 0 1.5rem;
                }

                .patterns-list {
                    display: grid;
                    gap: 1.5rem;
                }

                .pattern-item {
                    padding: 1.5rem;
                    background: rgba(255,255,255,0.03);
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.05);
                }

                .pattern-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .pattern-icon {
                    font-size: 2rem;
                }

                .pattern-name {
                    display: block;
                    color: #fff;
                    font-weight: 600;
                }

                .pattern-confidence {
                    font-size: 0.8rem;
                    color: #64748b;
                }

                .pattern-indicators {
                    margin: 0;
                    padding-left: 1.5rem;
                }

                .pattern-indicators li {
                    color: #94a3b8;
                    font-size: 0.85rem;
                    margin-bottom: 0.3rem;
                }

                .alerts-section {
                    margin-bottom: 1.5rem;
                }

                .alert-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.5rem;
                    margin-bottom: 0.5rem;
                }

                .alert-card.high {
                    border-left: 4px solid #ef4444;
                }

                .alert-card.medium {
                    border-left: 4px solid #f59e0b;
                }

                .alert-card p {
                    color: #e2e8f0;
                    margin: 0;
                    font-size: 0.9rem;
                }

                .recommendations-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }

                .recommendation-item {
                    display: block;
                    padding: 1.5rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    text-decoration: none;
                    transition: all 0.2s;
                }

                .recommendation-item:hover {
                    background: rgba(255,255,255,0.08);
                    transform: translateY(-2px);
                }

                .rec-priority {
                    display: inline-block;
                    padding: 0.2rem 0.6rem;
                    border-radius: 4px;
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-bottom: 0.8rem;
                }

                .rec-priority.high {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                }

                .rec-priority.medium {
                    background: rgba(251, 191, 36, 0.2);
                    color: #fbbf24;
                }

                .rec-priority.low {
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                }

                .recommendation-item h4 {
                    color: #fff;
                    margin: 0 0 0.5rem;
                    font-size: 0.95rem;
                }

                .recommendation-item p {
                    color: #64748b;
                    margin: 0;
                    font-size: 0.8rem;
                    line-height: 1.4;
                }

                .quick-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-top: 2rem;
                }

                @media (max-width: 800px) {
                    .wellness-score-card {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .vitals-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .quick-actions {
                        flex-direction: column;
                    }
                }
            `}</style>
        </main>
    );
}
