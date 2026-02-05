"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import PremiumBackground from "../components/PremiumBackground";
import { useUserProgress } from "../hooks/useUserProgress";
import { VitalsService, CommunityService, NotificationService, JournalService } from "@/lib/services";

// --- Custom Components ---

const GlobalPulseWidget = () => {
    const [activity, setActivity] = useState("");
    useEffect(() => {
        const update = () => setActivity(CommunityService.generateActivity());
        update();
        const interval = setInterval(update, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="global-pulse-compact animate-fade-in">
            <span className="dot"></span>
            <span className="text">{activity}</span>
        </div>
    );
};

const ResilienceGoal = ({ points }) => {
    const target = 150;
    const progress = Math.min(100, (points % target / target) * 100);
    const level = Math.floor(points / target) + 1;

    return (
        <div className="resilience-goal glass-card">
            <div className="goal-info">
                <span>Daily Resilience Goal</span>
                <span className="level">Lvl {level}</span>
            </div>
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}>
                    <div className="glow"></div>
                </div>
            </div>
            <p className="goal-msg">{150 - (points % 150)} XP to next milestone</p>
        </div>
    );
};

const MindGarden = ({ points, streak }) => {
    let stage = "seed";
    let icon = "🌱";
    let message = "Planting seeds of change.";
    let glowColor = "rgba(16, 185, 129, 0.4)";

    if (points > 50) { stage = "sprout"; icon = "🌿"; message = "Growing resilience."; }
    if (points > 200) { stage = "tree"; icon = "🌳"; message = "Standing strong."; }
    if (points > 500) { stage = "forest"; icon = "🌲✨"; message = "A thriving mind."; glowColor = "rgba(14, 165, 233, 0.6)"; }

    return (
        <div className="glass-card mind-garden">
            <div className="garden-visual">
                <div className="glow-aura" style={{ background: glowColor }}></div>
                <div className="plant-icon">{icon}</div>
            </div>
            <div className="garden-stats">
                <h3>My Mind Garden</h3>
                <p className="garden-msg">{message}</p>
                <div className="stats-row">
                    <div className="stat"><span className="label">Streak</span><span className="val fire">{streak}d</span></div>
                    <div className="stat"><span className="label">Points</span><span className="val xp">{points}</span></div>
                </div>
            </div>
        </div>
    );
};

const VitalsSummary = ({ vitals, wellnessScore }) => {
    if (!vitals) return (
        <Link href="/vitals" className="glass-card vitals-widget empty">
            <div className="vitals-empty"><span>⌚</span><div><h4>Vitals Hub</h4><p>Connect watch for insights</p></div></div>
        </Link>
    );

    const getScoreColor = (s) => (s >= 70 ? '#34d399' : s >= 50 ? '#fbbf24' : '#f43f5e');
    return (
        <Link href="/vitals" className="glass-card vitals-widget">
            <div className="vitals-header">
                💓 <div><h4>Biometric Health</h4><p style={{ color: getScoreColor(wellnessScore) }}>Score: {wellnessScore}%</p></div>
            </div>
            <div className="vitals-metrics">
                <div className="v-metric"><span className="v-val">{vitals.hrv}</span><span className="v-label">HRV</span></div>
                <div className="v-metric"><span className="v-val">{vitals.restingHR}</span><span className="v-label">RHR</span></div>
                <div className="v-metric"><span className="v-val">{vitals.sleepHours}</span><span className="v-label">Sleep</span></div>
            </div>
        </Link>
    );
};

export default function Dashboard() {
    const { points, streak, addPoints } = useUserProgress();
    const [userName, setUserName] = useState("Seeker");
    const [userVitals, setUserVitals] = useState(null);
    const [wellnessScore, setWellnessScore] = useState(null);
    const [dailyTask, setDailyTask] = useState(null);

    useEffect(() => {
        const savedName = localStorage.getItem('mindshiftr_name');
        if (savedName) setUserName(savedName);

        const vHistory = VitalsService.getVitalsHistory();
        if (vHistory.length > 0) {
            const latest = vHistory[vHistory.length - 1];
            setUserVitals(latest);
            VitalsService.analyzeVitals(latest, { history: vHistory }).then(d => setWellnessScore(d.wellnessScore));
        }

        const tasks = [
            { id: 'j', title: "Reflective Journaling", desc: "Process your morning emotions.", link: "/tasks/journal", xp: 50, icon: '✍️' },
            { id: 'b', title: "Resonance Breathing", desc: "Regulate your HRV for 5 mins.", link: "/tasks/breathing", xp: 30, icon: '🌬️' },
            { id: 'g', title: "Grounding Session", desc: "Quick relief from overthinking.", link: "/tasks/grounding", xp: 40, icon: '🖐️' }
        ];
        setDailyTask(tasks[Math.floor(Math.random() * tasks.length)]);
    }, []);

    const handleMood = (m) => {
        NotificationService.sendToast("Mood Logged", `Feeling ${m}? Taking note of your emotional state.`, "success");
        addPoints(10);
    };

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <PremiumBackground />

            <header className="dash-header">
                <div>
                    <GlobalPulseWidget />
                    <h1 className="title">Welcome, {userName}</h1>
                </div>
                <ResilienceGoal points={points} />
            </header>

            <div className="dashboard-grid">

                {/* Main Content Area */}
                <div className="main-col">
                    <div className="dual-widget-row">
                        <MindGarden points={points} streak={streak} />
                        <VitalsSummary vitals={userVitals} wellnessScore={wellnessScore} />
                    </div>

                    {/* Guided Action Card */}
                    {dailyTask && (
                        <div className="glass-card action-card">
                            <div className="action-content">
                                <span className="action-tag">Next Step on your Path</span>
                                <h2>{dailyTask.title}</h2>
                                <p>{dailyTask.desc}</p>
                                <Link href={dailyTask.link} className="btn btn-primary">Start Exercise (+{dailyTask.xp} XP)</Link>
                            </div>
                            <div className="action-icon">{dailyTask.icon}</div>
                        </div>
                    )}

                    {/* Quick Tools Grid */}
                    <div className="tools-section">
                        <h3>Wellness Toolbox</h3>
                        <div className="tools-grid">
                            <Link href="/bot" className="tool-card glass-card special">🤖 <div><h4>AI Copilot</h4><p>Contextual Chat</p></div></Link>
                            <Link href="/community" className="tool-card glass-card">👥 <div><h4>Community</h4><p>Live Feed</p></div></Link>
                            <Link href="/analytics" className="tool-card glass-card">📊 <div><h4>Analytics</h4><p>Trends & Data</p></div></Link>
                            <Link href="/tasks/breathing" className="tool-card glass-card">🌬️ <div><h4>Breathing</h4><p>Calm physiology</p></div></Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar Right */}
                <aside className="sidebar-col">
                    <div className="glass-card mood-check-widget">
                        <h3>Pulse Check</h3>
                        <div className="mood-btns">
                            {['😊', '😐', '😔', '😫'].map(m => (
                                <button key={m} onClick={() => handleMood(m)}>{m}</button>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card community-highlights">
                        <h3>Shared Wins</h3>
                        <div className="highlights-list">
                            <div className="h-item">"Hit my 14-day streak! 🔥"</div>
                            <div className="h-item">"Grounding tool worked wonders."</div>
                            <div className="h-item">"My HRV is up 10ms today. 💪"</div>
                        </div>
                        <Link href="/community" className="more-link">See dynamic feed &rarr;</Link>
                    </div>

                    <div className="glass-card notification-ad">
                        <h3>Alerts</h3>
                        <p>No critical biometric alerts for past 24h. You are stable.</p>
                    </div>
                </aside>

            </div>

            <style jsx>{`
                .dash-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; gap: 2rem; }
                .global-pulse-compact { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; }
                .global-pulse-compact .dot { width: 8px; height: 8px; background: #38bdf8; border-radius: 50%; box-shadow: 0 0 8px #38bdf8; animation: blink 2s infinite; }
                .global-pulse-compact .text { font-size: 0.8rem; color: #94a3b8; font-weight: 500; }

                .resilience-goal { min-width: 250px; padding: 1.2rem; background: rgba(56, 189, 248, 0.05); }
                .goal-info { display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.8rem; font-weight: 600; color: #fff; }
                .level { background: #38bdf8; color: #000; padding: 0.1rem 0.5rem; border-radius: 4px; }
                .progress-container { height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
                .progress-bar { height: 100%; background: linear-gradient(90deg, #0ea5e9, #6366f1); position: relative; transition: width 1s ease-in-out; }
                .progress-bar .glow { position: absolute; right: 0; top: 0; bottom: 0; width: 20px; background: #fff; filter: blur(10px); opacity: 0.5; }
                .goal-msg { font-size: 0.75rem; color: #64748b; }

                .dashboard-grid { display: grid; grid-template-columns: 1fr 280px; gap: 2rem; }
                .main-col { display: flex; flex-direction: column; gap: 2rem; }
                .dual-widget-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

                .mind-garden { display: flex; align-items: center; gap: 1.5rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0,0,0,0.1)); border-color: rgba(16, 185, 129, 0.2); }
                .garden-visual { width: 80px; height: 80px; position: relative; display: flex; align-items: center; justify-content: center; }
                .glow-aura { position: absolute; width: 100%; height: 100%; border-radius: 50%; filter: blur(15px); opacity: 0.3; }
                .plant-icon { font-size: 3rem; position: relative; }
                .garden-stats h3 { font-size: 1.1rem; color: #fff; margin-bottom: 0.2rem; }
                .garden-msg { font-size: 0.85rem; color: #34d399; font-style: italic; margin-bottom: 0.8rem; }
                .stats-row { display: flex; gap: 1rem; }
                .stat { display: flex; flex-direction: column; }
                .stat .label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; }
                .stat .val { font-size: 0.95rem; font-weight: 700; color: #fff; }
                .val.fire { color: #fbbf24; }

                .vitals-widget { display: flex; flex-direction: column; gap: 0.8rem; background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.15); text-decoration: none; }
                .vitals-header { display: flex; align-items: center; gap: 0.8rem; font-size: 1.5rem; }
                .vitals-header h4 { font-size: 1rem; color: #fff; margin: 0; }
                .vitals-header p { font-size: 0.85rem; margin: 0; font-weight: 700; }
                .vitals-metrics { display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
                .v-metric { display: flex; flex-direction: column; align-items: center; }
                .v-val { font-size: 1.1rem; font-weight: 800; color: #fff; }
                .v-label { font-size: 0.65rem; color: #64748b; letter-spacing: 1px; }

                .action-card { display: flex; justify-content: space-between; align-items: center; padding: 2.5rem; background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(99, 102, 241, 0.15)); border: 1px solid rgba(14, 165, 233, 0.3); }
                .action-tag { background: #0ea5e920; color: #0ea5e9; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; margin-bottom: 1rem; display: inline-block; }
                .action-card h2 { font-size: 2rem; color: #fff; margin-bottom: 0.5rem; }
                .action-card p { color: #94a3b8; margin-bottom: 2rem; max-width: 500px; }
                .action-icon { font-size: 5rem; opacity: 0.2; }

                .tools-section h3 { font-size: 1.1rem; color: #fff; margin-bottom: 1.2rem; }
                .tools-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
                .tool-card { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; text-decoration: none; transition: all 0.3s; }
                .tool-card:hover { transform: translateY(-5px); border-color: #38bdf8; background: rgba(14, 165, 233, 0.1); }
                .tool-card.special { border-color: #38bdf8; box-shadow: 0 0 20px rgba(14, 165, 233, 0.1); }
                .tool-card h4 { font-size: 0.95rem; color: #fff; margin: 0; }
                .tool-card p { font-size: 0.75rem; color: #94a3b8; margin: 0; }

                .sidebar-col { display: flex; flex-direction: column; gap: 1.5rem; }
                .mood-check-widget h3, .community-highlights h3, .notification-ad h3 { font-size: 0.8rem; text-transform: uppercase; color: #64748b; margin-bottom: 1.2rem; letter-spacing: 1px; }
                .mood-btns { display: flex; justify-content: space-between; }
                .mood-btns button { font-size: 1.8rem; background: transparent; border: none; cursor: pointer; transition: transform 0.2s; }
                .mood-btns button:hover { transform: scale(1.3); }
                
                .highlights-list { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1rem; }
                .h-item { font-size: 0.85rem; color: #cbd5e1; border-left: 2px solid #38bdf8; padding-left: 0.8rem; }
                .more-link { font-size: 0.8rem; color: #38bdf8; text-decoration: none; font-weight: 600; }
                .notification-ad p { font-size: 0.85rem; color: #94a3b8; line-height: 1.4; }

                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
                @media (max-width: 900px) {
                    .dashboard-grid { grid-template-columns: 1fr; }
                    .sidebar-col { order: -1; margin-bottom: 1rem; }
                    .dual-widget-row { grid-template-columns: 1fr; }
                }
            `}</style>
        </main>
    );
}
