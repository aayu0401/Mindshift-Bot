"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PremiumBackground from '../../components/PremiumBackground';
import { useUserProgress } from '../../hooks/useUserProgress';
import { AnalyticsService } from '@/lib/services';

export default function ActivityTask() {
    const { addPoints } = useUserProgress();
    const [duration, setDuration] = useState(600); // 10 minutes default
    const [timeLeft, setTimeLeft] = useState(600);
    const [isActive, setIsActive] = useState(false);
    const [activityType, setActivityType] = useState('walking');
    const [view, setView] = useState('setup'); // setup | active | complete

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            completeActivity();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const completeActivity = async () => {
        await AnalyticsService.logSession('activity', duration, 50);
        addPoints(50);
        setView('complete');
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const activities = [
        { id: 'walking', label: 'Brisk Walk', icon: '🚶' },
        { id: 'stretching', label: 'Stretching', icon: '🧘' },
        { id: 'yoga', label: 'Yoga Flow', icon: '🤸' },
        { id: 'dancing', label: 'Dancing', icon: '💃' }
    ];

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '80px', paddingBottom: '4rem' }}>
            <PremiumBackground />
            <Link href="/dashboard" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                &larr; Back to Dashboard
            </Link>

            <div className="glass-card activity-card">

                {view === 'setup' && (
                    <div className="setup-view animate-fade-in">
                        <div className="icon-header">👟</div>
                        <h1 className="title">Movement Break</h1>
                        <p className="subtitle">Physical activity is one of the fastest ways to shift your mood and physiology.</p>

                        <div className="activity-selector">
                            {activities.map(act => (
                                <button
                                    key={act.id}
                                    className={`act-btn ${activityType === act.id ? 'active' : ''}`}
                                    onClick={() => setActivityType(act.id)}
                                >
                                    <span className="act-icon">{act.icon}</span>
                                    {act.label}
                                </button>
                            ))}
                        </div>

                        <div className="duration-selector">
                            <label>Duration</label>
                            <div className="time-options">
                                <button className={`time-btn ${duration === 300 ? 'active' : ''}`} onClick={() => { setDuration(300); setTimeLeft(300); }}>5 min</button>
                                <button className={`time-btn ${duration === 600 ? 'active' : ''}`} onClick={() => { setDuration(600); setTimeLeft(600); }}>10 min</button>
                                <button className={`time-btn ${duration === 1200 ? 'active' : ''}`} onClick={() => { setDuration(1200); setTimeLeft(1200); }}>20 min</button>
                            </div>
                        </div>

                        <button className="btn btn-primary start-btn" onClick={() => setView('active')}>
                            Start Session
                        </button>
                    </div>
                )}

                {view === 'active' && (
                    <div className="active-view animate-fade-in">
                        <div className="timer-ring">
                            <svg viewBox="0 0 100 100" className="progress-ring">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                                <circle
                                    cx="50" cy="50" r="45"
                                    fill="none"
                                    stroke="var(--primary)"
                                    strokeWidth="4"
                                    strokeDasharray="283"
                                    strokeDashoffset={283 - (283 * timeLeft / duration)}
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <div className="timer-text">
                                <span className="time">{formatTime(timeLeft)}</span>
                                <span className="label">Remaining</span>
                            </div>
                        </div>

                        <h2 className="activity-status">
                            {isActive ? "Keep moving!" : "Paused"}
                        </h2>
                        <p className="activity-type-label">Current: <strong>{activities.find(a => a.id === activityType)?.label}</strong></p>

                        <div className="controls">
                            <button className="btn btn-outline" onClick={toggleTimer}>
                                {isActive ? "Pause" : "Resume"}
                            </button>
                            <button className="btn btn-red" onClick={() => setView('setup')}>End</button>
                        </div>
                    </div>
                )}

                {view === 'complete' && (
                    <div className="complete-view animate-fade-in">
                        <div className="celebration-icon">🎉</div>
                        <h2>Session Complete!</h2>
                        <p>You've invested {Math.floor(duration / 60)} minutes in your physical and mental health.</p>
                        <div className="xp-badge">+50 XP Earned</div>
                        <div className="actions">
                            <Link href="/dashboard" className="btn btn-primary">Return Home</Link>
                            <button className="btn btn-outline" onClick={() => setView('setup')}>Do Another</button>
                        </div>
                    </div>
                )}

            </div>

            <style jsx>{`
                .activity-card {
                    max-width: 600px;
                    margin: 0 auto;
                    min-height: 500px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    text-align: center;
                }
                .icon-header {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                .subtitle {
                    color: #94a3b8;
                    margin-bottom: 2rem;
                }
                .activity-selector {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .act-btn {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 1rem;
                    border-radius: 12px;
                    color: #fff;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }
                .act-btn:hover { background: rgba(255,255,255,0.1); }
                .act-btn.active {
                    background: rgba(56, 189, 248, 0.2);
                    border-color: var(--primary);
                    color: var(--primary);
                }
                .act-icon { font-size: 1.5rem; }
                
                .duration-selector { margin-bottom: 2rem; }
                .duration-selector label { display: block; color: #94a3b8; margin-bottom: 0.5rem; font-size: 0.9rem; }
                .time-options { display: flex; gap: 0.5rem; justify-content: center; }
                .time-btn {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.2);
                    color: #fff;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    cursor: pointer;
                }
                .time-btn.active { background: #fff; color: #000; border-color: #fff; }

                .start-btn { width: 100%; padding: 1rem; font-size: 1.1rem; }

                .timer-ring {
                    width: 250px; height: 250px;
                    margin: 0 auto 2rem;
                    position: relative;
                }
                .progress-ring { width: 100%; height: 100%; }
                .timer-text {
                    position: absolute; inset: 0;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                }
                .time { font-size: 3.5rem; font-weight: 700; color: #fff; font-variant-numeric: tabular-nums; }
                .label { color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }

                .controls { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
                .btn-red { 
                    background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4);
                    padding: 0.6rem 1.5rem; border-radius: 20px; cursor: pointer; font-weight: 600;
                }
                .btn-red:hover { background: rgba(239, 68, 68, 0.3); }

                .complete-view { text-align: center; }
                .celebration-icon { font-size: 4rem; margin-bottom: 1rem; animation: bounce 1s infinite; }
                .xp-badge {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white; padding: 0.5rem 1.5rem; border-radius: 20px;
                    font-weight: 700; display: inline-block; margin: 1.5rem 0;
                    box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
                }
                .actions { display: flex; gap: 1rem; justify-content: center; }

                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            `}</style>
        </main>
    );
}
