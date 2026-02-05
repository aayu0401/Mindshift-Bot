"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import PremiumBackground from '../components/PremiumBackground';
import { useUserProgress } from '../hooks/useUserProgress';

export default function ProfilePage() {
    const { points, streak } = useUserProgress();
    const [name, setName] = useState("User");
    const [goal, setGoal] = useState("Reduce Anxiety");

    const [settings, setSettings] = useState({
        notifications: true,
        dataSharing: false,
        healthSync: false,
        theme: 'dark'
    });

    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        const savedName = localStorage.getItem('mindshiftr_name');
        if (savedName) setName(savedName);

        const savedGoal = localStorage.getItem('mindshiftr_goal');
        if (savedGoal) setGoal(savedGoal);
    }, []);

    const handleSave = () => {
        localStorage.setItem('mindshiftr_name', name);
        localStorage.setItem('mindshiftr_goal', goal);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000);
    };

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Calculate tier based on points
    const getTier = () => {
        if (points >= 5000) return { name: 'Diamond', color: '#a78bfa' };
        if (points >= 2500) return { name: 'Gold', color: '#fbbf24' };
        if (points >= 1000) return { name: 'Silver', color: '#94a3b8' };
        return { name: 'Bronze', color: '#cd7f32' };
    };

    const tier = getTier();

    return (
        <main className="profile-layout animate-fade-in">
            <PremiumBackground />

            <div className="profile-content">
                <header className="profile-header">
                    <div className="avatar-section">
                        <div className="avatar-gradient">
                            <span>{name[0]?.toUpperCase() || 'U'}</span>
                        </div>
                        <div className="avatar-info">
                            <h1 className="name-display">{name}</h1>
                            <div className="role-chip" style={{ color: tier.color }}>
                                Resilience Tier: {tier.name}
                            </div>
                        </div>
                    </div>
                    <div className="stat-pills">
                        <div className="p-pill">
                            <span className="p-val">{points.toLocaleString()}</span>
                            <span className="p-lab">Total XP</span>
                        </div>
                        <div className="p-pill">
                            <span className="p-val">{streak}</span>
                            <span className="p-lab">Day Streak</span>
                        </div>
                    </div>
                </header>

                <div className="profile-settings-grid">

                    {/* Identity Section */}
                    <section className="glass-card settings-panel">
                        <h3 className="section-title">Identity & Goals</h3>
                        <div className="input-group">
                            <label>Display Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="styled-input"
                                maxLength={20}
                            />
                        </div>
                        <div className="input-group">
                            <label>Primary Focus</label>
                            <select
                                value={goal}
                                onChange={e => setGoal(e.target.value)}
                                className="styled-input"
                            >
                                <option>Reduce Anxiety</option>
                                <option>Improve Sleep</option>
                                <option>Build Resilience</option>
                                <option>Manage Stress</option>
                                <option>Social Connection</option>
                                <option>Emotional Regulation</option>
                            </select>
                        </div>
                        <button
                            className={`btn ${saveStatus === 'saved' ? 'btn-success' : 'btn-primary'} w-full`}
                            onClick={handleSave}
                        >
                            {saveStatus === 'saved' ? '✨ Saved!' : 'Update Profile'}
                        </button>
                    </section>

                    {/* Permissions Section */}
                    <section className="glass-card settings-panel">
                        <h3 className="section-title">Privacy & Sync</h3>
                        <div className="toggle-list">
                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <span className="t-name">Smart Notifications</span>
                                    <span className="t-desc">AI-driven check-in reminders based on mood history.</span>
                                </div>
                                <button
                                    className={`switch ${settings.notifications ? 'active' : ''}`}
                                    onClick={() => toggleSetting('notifications')}
                                ></button>
                            </div>
                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <span className="t-name">HealthKit Integration</span>
                                    <span className="t-desc">Sync mindful minutes and HRV data automatically.</span>
                                </div>
                                <button
                                    className={`switch ${settings.healthSync ? 'active' : ''}`}
                                    onClick={() => toggleSetting('healthSync')}
                                ></button>
                            </div>
                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <span className="t-name">Secure Cloud Backup</span>
                                    <span className="t-desc">Encrypted backup of your journal and progress.</span>
                                </div>
                                <button
                                    className={`switch ${settings.dataSharing ? 'active' : ''}`}
                                    onClick={() => toggleSetting('dataSharing')}
                                ></button>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Progress Overview */}
                <section className="glass-card progress-section">
                    <h3 className="section-title">Your Progress</h3>
                    <div className="progress-stats">
                        <div className="prog-item">
                            <div className="prog-bar">
                                <div className="prog-fill" style={{ width: `${Math.min((points / 5000) * 100, 100)}%` }}></div>
                            </div>
                            <span className="prog-label">{points.toLocaleString()} / 5,000 XP to {tier.name === 'Diamond' ? 'Max Level' : 'Next Tier'}</span>
                        </div>
                    </div>
                    <div className="quick-links">
                        <Link href="/analytics" className="quick-link">📊 View Analytics</Link>
                        <Link href="/screening" className="quick-link">📋 Take Assessment</Link>
                        <Link href="/tasks/journal" className="quick-link">📓 Journal Entry</Link>
                    </div>
                </section>

                <div className="account-danger-zone">
                    <button className="btn-silent">Account Settings</button>
                    <button className="btn-silent danger" onClick={() => {
                        if (confirm('Are you sure? This will reset all your progress.')) {
                            localStorage.clear();
                            window.location.reload();
                        }
                    }}>Reset All Data</button>
                </div>
            </div>

            <style jsx>{`
                .profile-layout { min-height: 100vh; padding: 120px 2rem 4rem; position: relative; }
                .profile-content { max-width: 900px; margin: 0 auto; }
                
                .profile-header { 
                    display: flex; justify-content: space-between; align-items: flex-end;
                    margin-bottom: 3rem; background: rgba(255,255,255,0.02);
                    padding: 2rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05);
                }
                .avatar-section { display: flex; align-items: center; gap: 1.5rem; }
                .avatar-gradient { 
                    width: 90px; height: 90px; border-radius: 24px;
                    background: linear-gradient(135deg, #10b981, #3b82f6);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 2.5rem; font-weight: 800; color: #fff;
                    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2);
                }
                .name-display { font-size: 2.2rem; font-weight: 800; color: #fff; margin: 0; }
                .role-chip { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

                .stat-pills { display: flex; gap: 1rem; }
                .p-pill { 
                    background: rgba(255,255,255,0.05); padding: 0.8rem 1.5rem; 
                    border-radius: 16px; display: flex; flex-direction: column; align-items: center;
                }
                .p-val { font-size: 1.4rem; font-weight: 800; color: #fff; }
                .p-lab { font-size: 0.7rem; color: #64748b; text-transform: uppercase; }

                .profile-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
                .settings-panel { padding: 2rem; }
                .section-title { font-size: 1.1rem; color: #fff; margin-bottom: 2rem; font-weight: 700; }
                
                .input-group { margin-bottom: 1.5rem; }
                .input-group label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.5rem; }
                .styled-input { 
                    width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    padding: 0.8rem 1rem; border-radius: 12px; color: #fff; font-size: 1rem;
                    transition: border-color 0.2s;
                }
                .styled-input:focus { outline: none; border-color: var(--primary); }

                .toggle-list { display: grid; gap: 1.5rem; }
                .toggle-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
                .t-name { display: block; color: #fff; font-weight: 600; font-size: 0.95rem; }
                .t-desc { display: block; color: #64748b; font-size: 0.75rem; line-height: 1.4; margin-top: 0.2rem; }

                .switch {
                    width: 44px; height: 24px; border-radius: 12px; background: rgba(255,255,255,0.1);
                    cursor: pointer; border: none; position: relative; transition: all 0.3s; flex-shrink: 0;
                }
                .switch::after {
                    content: ''; position: absolute; left: 4px; top: 4px; width: 16px; height: 16px;
                    border-radius: 50%; background: #fff; transition: all 0.3s;
                }
                .switch.active { background: #10b981; }
                .switch.active::after { left: 24px; }

                .progress-section { padding: 2rem; }
                .progress-stats { margin-bottom: 1.5rem; }
                .prog-item { display: flex; flex-direction: column; gap: 0.5rem; }
                .prog-bar { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
                .prog-fill { height: 100%; background: linear-gradient(to right, #10b981, #38bdf8); border-radius: 4px; transition: width 0.5s; }
                .prog-label { font-size: 0.8rem; color: #64748b; }

                .quick-links { display: flex; gap: 1rem; flex-wrap: wrap; }
                .quick-link {
                    padding: 0.6rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px; color: #94a3b8; text-decoration: none; font-size: 0.85rem;
                    transition: all 0.2s;
                }
                .quick-link:hover { background: rgba(255,255,255,0.1); color: #fff; }

                .account-danger-zone { display: flex; gap: 1.5rem; justify-content: center; margin-top: 3rem; }
                .btn-silent { background: transparent; border: none; color: #64748b; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
                .btn-silent:hover { color: #94a3b8; }
                .btn-silent.danger:hover { color: #ef4444; }

                .btn-success { background: #10b981 !important; }
                .w-full { width: 100%; }

                @media (max-width: 800px) {
                    .profile-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
                    .profile-settings-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </main>
    );
}
