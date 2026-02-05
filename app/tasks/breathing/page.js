"use client";
import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import PremiumBackground from '../../components/PremiumBackground';
import { useUserProgress } from '../../hooks/useUserProgress';
import { NotificationService, AnalyticsService, VitalsService } from '@/lib/services';

export default function BreathingTask() {
    const { addPoints } = useUserProgress();
    const [phase, setPhase] = useState('Prepare'); // Prepare, Inhale, Hold, Exhale
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [cycles, setCycles] = useState(0);
    const [sessionComplete, setSessionComplete] = useState(false);
    const audioRef = useRef(null);

    // Dynamic timing based on vitals (if available)
    const [timing, setTiming] = useState({ inhale: 4, hold: 4, exhale: 4 });

    useEffect(() => {
        const vHistory = VitalsService.getVitalsHistory();
        if (vHistory.length > 0) {
            const latest = vHistory[vHistory.length - 1];
            if (latest.restingHR > 85) {
                // High stress: Slower, deeper breaths
                setTiming({ inhale: 5, hold: 2, exhale: 7 });
            }
        }
    }, []);

    useEffect(() => {
        let interval = null;
        if (isActive && !sessionComplete) {
            interval = setInterval(() => {
                setTimer(t => {
                    if (t === 1) {
                        return transitionPhase();
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, phase, sessionComplete]);

    const transitionPhase = () => {
        if (phase === 'Prepare' || phase === 'Exhale') {
            if (phase === 'Exhale') {
                setCycles(c => {
                    const next = c + 1;
                    if (next >= 5) endSession();
                    return next;
                });
            }
            setPhase('Inhale');
            return timing.inhale;
        } else if (phase === 'Inhale') {
            setPhase('Hold');
            return timing.hold;
        } else {
            setPhase('Exhale');
            return timing.exhale;
        }
    };

    const startSession = () => {
        setIsActive(true);
        setPhase('Inhale');
        setTimer(timing.inhale);
        setSessionComplete(false);
    };

    const endSession = () => {
        setIsActive(false);
        setSessionComplete(true);
        addPoints(50);
        AnalyticsService.logSession('breathing', 300, 50);
        NotificationService.sendToast("Session Complete", "Your physiology has reached resonance.", "success");
    };

    const getCircleScale = () => {
        if (!isActive) return 1;
        if (phase === 'Inhale') return 1 + (timing.inhale - timer) / timing.inhale;
        if (phase === 'Hold') return 2;
        if (phase === 'Exhale') return 2 - (timing.exhale - timer) / timing.exhale;
        return 1;
    };

    return (
        <main className="breathing-task container animate-fade-in">
            <PremiumBackground />

            <Link href="/dashboard" className="exit-btn btn btn-outline">&larr; Back to Dashboard</Link>

            {!sessionComplete ? (
                <div className="resilience-flow glass-card animate-slide-up">
                    <div className="flow-header">
                        <span className="badge">HRV Resilience Flow</span>
                        <h1>Resonance Breathing</h1>
                        <p className="subtitle">Focus on your breath. Align your heartbeat.</p>
                    </div>

                    <div className="visualizer-area">
                        {/* Decorative Rings */}
                        <div className={`ring ring-1 ${isActive ? phase.toLowerCase() : ''}`}></div>
                        <div className={`ring ring-2 ${isActive ? phase.toLowerCase() : ''}`}></div>

                        <div className="main-orb" style={{ transform: `scale(${getCircleScale()})` }}>
                            <div className="orb-content">
                                {isActive ? (
                                    <>
                                        <span className="orb-timer">{timer}</span>
                                        <span className="orb-phase">{phase}</span>
                                    </>
                                ) : (
                                    <button className="start-trigger" onClick={startSession}>START</button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flow-footer">
                        <div className="status-item">
                            <span className="s-label">Progress</span>
                            <span className="s-val">{cycles} / 5 Cycles</span>
                        </div>
                        <div className="status-item">
                            <span className="s-label">Pace</span>
                            <span className="s-val">{timing.inhale}-{timing.hold}-{timing.exhale}s</span>
                        </div>
                    </div>

                    {isActive && <div className="instruction-toast">{phase === 'Inhale' ? 'Fill your lungs deeply' : phase === 'Hold' ? 'Hold the calm' : 'Let go of tension'}</div>}
                </div>
            ) : (
                <div className="completion-card glass-card animate-slide-up">
                    <div className="confetti-icon">🎉</div>
                    <h2>Resilience Reached</h2>
                    <p>Your heart rate variability has stabilized. You've earned 50 XP toward your next mind garden stage.</p>
                    <div className="completion-stats">
                        <div className="c-stat"><span>5</span><span>Cycles</span></div>
                        <div className="c-stat"><span>180s</span><span>Focus</span></div>
                        <div className="c-stat"><span>+50</span><span>Care Points</span></div>
                    </div>
                    <div className="actions">
                        <Link href="/dashboard" className="btn btn-primary">Return Home</Link>
                        <button className="btn btn-outline" onClick={startSession}>Go Again</button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .breathing-task { height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; }
                .exit-btn { position: absolute; top: 2rem; left: 2rem; z-index: 10; padding: 0.5rem 1rem; font-size: 0.8rem; }
                
                .resilience-flow { width: 100%; maxWidth: 700px; padding: 3rem; text-align: center; display: flex; flex-direction: column; gap: 3rem; position: relative; overflow: hidden; }
                .flow-header { z-index: 2; }
                .badge { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; margin-bottom: 1rem; display: inline-block; border: 1px solid rgba(14, 165, 233, 0.2); }
                .flow-header h1 { font-size: 2.2rem; color: #fff; margin-bottom: 0.5rem; }
                
                .visualizer-area { height: 350px; display: flex; align-items: center; justify-content: center; position: relative; }
                .main-orb { width: 150px; height: 150px; background: linear-gradient(135deg, #0ea5e9, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 1s linear; z-index: 5; box-shadow: 0 0 50px rgba(14, 165, 233, 0.4); }
                .orb-content { display: flex; flex-direction: column; align-items: center; color: #fff; }
                .orb-timer { font-size: 3rem; font-weight: 800; line-height: 1; }
                .orb-phase { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; opacity: 0.8; }
                .start-trigger { background: transparent; border: none; color: #fff; font-size: 1.5rem; font-weight: 900; cursor: pointer; letter-spacing: 2px; }

                .ring { position: absolute; width: 150px; height: 150px; border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; opacity: 0; }
                .ring-1 { animation: pulse-ring 4s infinite linear; }
                .ring-2 { animation: pulse-ring 4s infinite linear 2s; }
                
                @keyframes pulse-ring {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(3); opacity: 0; }
                }

                .flow-footer { display: flex; justify-content: center; gap: 4rem; z-index: 2; }
                .status-item { display: flex; flex-direction: column; align-items: center; }
                .s-label { font-size: 0.7rem; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
                .s-val { font-size: 1.1rem; color: #fff; font-weight: 700; }

                .instruction-toast { position: absolute; bottom: 8rem; left: 50%; transform: translateX(-50%); color: #fff; font-size: 1.2rem; font-weight: 300; animation: fadeUp 0.5s ease-out; }
                
                .completion-card { padding: 4rem; text-align: center; max-width: 500px; }
                .confetti-icon { font-size: 4rem; margin-bottom: 1rem; animation: bounce 1s infinite; }
                .completion-card h2 { font-size: 2.5rem; color: #fff; margin-bottom: 1rem; }
                .completion-stats { display: flex; gap: 1rem; margin: 2rem 0; justify-content: center; }
                .c-stat { background: rgba(255,255,255,0.03); padding: 1rem 1.5rem; border-radius: 16px; display: flex; flex-direction: column; }
                .c-stat span:first-child { font-size: 1.5rem; font-weight: 800; color: #0ea5e9; }
                .c-stat span:last-child { font-size: 0.75rem; color: #64748b; text-transform: uppercase; }
                .actions { display: flex; gap: 1rem; justify-content: center; }

                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                @keyframes fadeUp { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
            `}</style>
        </main>
    );
}
