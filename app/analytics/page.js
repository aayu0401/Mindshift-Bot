"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PremiumBackground from '../components/PremiumBackground';
import { useUserProgress } from '../hooks/useUserProgress';
import { VitalsService } from '@/lib/services';

const initialHistoryData = [
    { date: '12 Jan', anxiety: 12, mood: 6, sleep: 5 },
    { date: '19 Jan', anxiety: 10, mood: 7, sleep: 6 },
    { date: '26 Jan', anxiety: 8, mood: 7, sleep: 7 },
    { date: '02 Feb', anxiety: 9, mood: 5, sleep: 5 },
    { date: '09 Feb', anxiety: 6, mood: 8, sleep: 8 },
    { date: '16 Feb', anxiety: 5, mood: 8, sleep: 7 },
    { date: '23 Feb', anxiety: 4, mood: 9, sleep: 8 },
];

const badges = [
    { id: 'first_checkin', name: 'First Check-in', emoji: '🌱', earned: true },
    { id: 'week_streak', name: '7-Day Streak', emoji: '🔥', earned: true },
    { id: 'breath_master', name: 'Breath Master', emoji: '🌬️', earned: true },
    { id: 'journal_starter', name: 'Journal Starter', emoji: '📓', earned: false },
    { id: 'community_member', name: 'Community Member', emoji: '🤝', earned: false },
    { id: 'resilience_tier', name: 'Resilience Tier', emoji: '💎', earned: false }
];

export default function AnalyticsPage() {
    const { points, streak } = useUserProgress();
    const [view, setView] = useState('Anxiety');
    const [history, setHistory] = useState(initialHistoryData);
    const [animatedStats, setAnimatedStats] = useState({ points: 0, streak: 0 });

    // Animate stats and load data on mount
    useEffect(() => {
        // Animation
        const duration = 1500;
        const steps = 30;
        const interval = duration / steps;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            setAnimatedStats({
                points: Math.round((points / steps) * step),
                streak: Math.round((streak / steps) * step)
            });
            if (step >= steps) clearInterval(timer);
        }, interval);

        // Load real history from VitalsService
        const vitalsHistory = VitalsService.getVitalsHistory();
        if (vitalsHistory.length > 0) {
            // Transform vitals history to chart format (mock transformation for now as fields might differ)
            // We map vitals fields to Anxiety/Mood/Sleep proxy values for visualization
            const mappedHistory = vitalsHistory.map(v => ({
                date: new Date(v.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                anxiety: Math.max(0, 10 - Math.round(v.metrics.hrv / 10)), // Proxy: Low HRV -> High Anxiety
                mood: Math.min(10, Math.round(v.metrics.recoveryScore / 10)), // Proxy: Recovery -> Mood
                sleep: Math.min(10, Math.round(v.metrics.sleep / 60)) // Sleep hours
            })).slice(-7); // Last 7 entries

            if (mappedHistory.length > 2) {
                setHistory(mappedHistory);
            }
        }

        return () => clearInterval(timer);
    }, [points, streak]);

    const getBarHeight = (val, type) => {
        if (!val) return 0;
        if (type === 'Anxiety') return (val / 15) * 100;
        return (val / 10) * 100;
    };

    const getColor = (type) => {
        if (type === 'Anxiety') return '#f43f5e';
        if (type === 'Mood') return '#34d399';
        return '#818cf8';
    };

    // Calculate wellness score
    const latestData = history[history.length - 1];
    const wellnessScore = Math.round(
        ((10 - latestData.anxiety + latestData.mood + latestData.sleep) / 20) * 100
    );

    return (
        <main className="analytics-layout animate-fade-in">
            <PremiumBackground />

            <div className="analytics-content">
                <header className="page-header">
                    <div>
                        <h1 className="title" style={{ fontSize: '2.5rem', margin: 0 }}>Progress Pulse</h1>
                        <p className="subtitle" style={{ margin: 0 }}>Visualizing your path to resilience.</p>
                    </div>
                    <Link href="/screening" className="btn btn-primary">Take Assessment +</Link>
                </header>

                {/* Wellness Score Card */}
                <div className="wellness-score-card glass-card">
                    <div className="score-circle">
                        <svg viewBox="0 0 100 100">
                            <circle className="score-bg" cx="50" cy="50" r="45" />
                            <circle
                                className="score-fill"
                                cx="50"
                                cy="50"
                                r="45"
                                style={{
                                    strokeDasharray: `${wellnessScore * 2.83} 283`,
                                    stroke: wellnessScore > 70 ? '#34d399' : wellnessScore > 40 ? '#fbbf24' : '#f43f5e'
                                }}
                            />
                        </svg>
                        <div className="score-value">{wellnessScore}</div>
                    </div>
                    <div className="score-info">
                        <h3>Wellness Score</h3>
                        <p>Based on your latest anxiety, mood, and sleep data</p>
                        <div className="score-breakdown">
                            <span>Anxiety: {latestData.anxiety}/10</span>
                            <span>Mood: {latestData.mood}/10</span>
                            <span>Sleep: {latestData.sleep}/10</span>
                        </div>
                    </div>
                </div>

                <div className="main-analytics-grid">

                    {/* Primary Chart Container */}
                    <div className="glass-card chart-container" style={{ gridColumn: 'span 2' }}>
                        <div className="chart-header">
                            <div>
                                <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Historical Baseline: {view}</h3>
                                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Last 30 days aggregated data</p>
                            </div>
                            <div className="view-switcher">
                                {['Anxiety', 'Mood', 'Sleep'].map(Type => (
                                    <button
                                        key={Type}
                                        onClick={() => setView(Type)}
                                        className={view === Type ? 'active' : ''}
                                        style={{ '--accent': getColor(Type) }}
                                    >
                                        {Type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bars-area">
                            {history.map((data, i) => (
                                <div key={i} className="bar-group">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            height: `${getBarHeight(data[view.toLowerCase()], view)}%`,
                                            background: getColor(view)
                                        }}
                                    >
                                        <div className="bar-tooltip">{data[view.toLowerCase()]}</div>
                                    </div>
                                    <span className="bar-label">{data.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Milestones Card */}
                    <div className="glass-card milestone-card">
                        <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Badges Earned</h3>
                        <div className="badges-grid">
                            {badges.map(badge => (
                                <div
                                    key={badge.id}
                                    className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}
                                >
                                    <span className="badge-emoji">{badge.earned ? badge.emoji : '🔒'}</span>
                                    <span className="badge-name">{badge.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats Banner */}
                    <div className="stats-banner glass-card" style={{ gridColumn: 'span 3' }}>
                        <div className="b-stat">
                            <span className="b-label">Total Care Points</span>
                            <span className="b-val">{animatedStats.points.toLocaleString()} <span style={{ fontSize: '0.9rem', opacity: 0.5 }}>XP</span></span>
                        </div>
                        <div className="b-divider"></div>
                        <div className="b-stat">
                            <span className="b-label">Current Streak</span>
                            <span className="b-val">{animatedStats.streak} <span style={{ fontSize: '0.9rem', opacity: 0.5 }}>Days</span></span>
                        </div>
                        <div className="b-divider"></div>
                        <div className="b-stat">
                            <span className="b-label">Percentile Rank</span>
                            <span className="b-val">Top 4%</span>
                        </div>
                        <div className="b-divider"></div>
                        <div className="b-stat">
                            <span className="b-label">Sessions Completed</span>
                            <span className="b-val">47</span>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                .analytics-layout { min-height: 100vh; padding: 120px 2rem 4rem; position: relative; }
                .analytics-content { max-width: 1200px; margin: 0 auto; }
                
                .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }

                .wellness-score-card {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    padding: 2rem;
                    margin-bottom: 1.5rem;
                }

                .score-circle {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    flex-shrink: 0;
                }

                .score-circle svg {
                    transform: rotate(-90deg);
                    width: 100%;
                    height: 100%;
                }

                .score-bg {
                    fill: none;
                    stroke: rgba(255,255,255,0.1);
                    stroke-width: 8;
                }

                .score-fill {
                    fill: none;
                    stroke-width: 8;
                    stroke-linecap: round;
                    transition: stroke-dasharray 1s ease;
                }

                .score-value {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: 800;
                    color: #fff;
                }

                .score-info h3 {
                    color: #fff;
                    font-size: 1.3rem;
                    margin: 0 0 0.5rem;
                }

                .score-info p {
                    color: #64748b;
                    font-size: 0.9rem;
                    margin: 0 0 1rem;
                }

                .score-breakdown {
                    display: flex;
                    gap: 1.5rem;
                }

                .score-breakdown span {
                    font-size: 0.8rem;
                    color: #94a3b8;
                    padding: 0.3rem 0.6rem;
                    background: rgba(255,255,255,0.05);
                    border-radius: 6px;
                }
                
                .main-analytics-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; }
                
                .chart-container { padding: 2rem; min-height: 400px; display: flex; flex-direction: column; }
                .chart-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                
                .view-switcher { display: flex; background: rgba(255,255,255,0.05); padding: 4px; border-radius: 20px; }
                .view-switcher button { 
                    border: none; background: transparent; color: #64748b; padding: 0.6rem 1.2rem; 
                    border-radius: 16px; cursor: pointer; transition: all 0.3s; font-weight: 600;
                }
                .view-switcher button.active { background: rgba(255,255,255,0.1); color: var(--accent); }

                .bars-area { flex: 1; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 1rem; gap: 1rem; }
                .bar-group { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.8rem; height: 250px; justify-content: flex-end; }
                .bar-fill { 
                    width: 100%; max-width: 40px; border-radius: 8px 8px 4px 4px; position: relative;
                    transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    min-height: 10px;
                }
                .bar-tooltip {
                    position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
                    background: #fff; color: #020617; padding: 0.3rem 0.6rem; border-radius: 6px;
                    font-size: 0.75rem; font-weight: 800; opacity: 0; transition: opacity 0.3s;
                    white-space: nowrap;
                }
                .bar-group:hover .bar-tooltip { opacity: 1; }
                .bar-label { font-size: 0.7rem; color: #64748b; font-weight: 500; }

                .milestone-card { padding: 2rem; }
                .badges-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.8rem; }
                .badge-item {
                    display: flex; align-items: center; gap: 0.6rem; padding: 0.8rem;
                    background: rgba(255,255,255,0.03); border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .badge-item.locked { opacity: 0.5; }
                .badge-emoji { font-size: 1.2rem; }
                .badge-name { font-size: 0.75rem; color: #94a3b8; }
                .badge-item.earned .badge-name { color: #fff; }

                .stats-banner { display: flex; align-items: center; justify-content: space-around; padding: 2rem; }
                .b-stat { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; }
                .b-label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
                .b-val { font-size: 1.8rem; font-weight: 800; color: #fff; }
                .b-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }

                @media (max-width: 1000px) {
                    .main-analytics-grid { grid-template-columns: 1fr; }
                    .chart-container, .stats-banner { grid-column: span 1 !important; }
                    .stats-banner { flex-wrap: wrap; gap: 1.5rem; }
                    .b-divider { display: none; }
                    .wellness-score-card { flex-direction: column; text-align: center; }
                    .score-breakdown { justify-content: center; }
                }
            `}</style>
        </main>
    );
}
