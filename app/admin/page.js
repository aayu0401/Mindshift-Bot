"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        activeUsers: 452,
        avgStressLevel: 62,
        wellnessROI: '14%',
        criticalCases: 3
    });

    const departments = [
        { name: 'Engineering', stress: 78, trend: 'up' },
        { name: 'Design', stress: 45, trend: 'down' },
        { name: 'Operations', stress: 82, trend: 'up' },
        { name: 'Marketing', stress: 55, trend: 'stable' }
    ];

    return (
        <main className="admin-layout animate-fade-in">
            {/* Background */}
            <div className="admin-bg-container">
                <NextImage src="/admin-bg.png" alt="Admin" fill style={{ objectFit: 'cover', opacity: 0.15 }} />
                <div className="admin-overlay"></div>
            </div>

            <div className="admin-content">
                <header className="admin-header">
                    <div>
                        <h1 className="admin-title">Enterprise Wellness Hub</h1>
                        <p className="admin-subtitle">Real-time organizational psychological safety & resilience analytics.</p>
                    </div>
                    <div className="admin-user-pill">
                        <div className="status-indicator"></div>
                        <span>Chief Mental Health Officer</span>
                    </div>
                </header>

                {/* Key Metrics */}
                <div className="metrics-grid">
                    <div className="metric-card glass-panel">
                        <span className="metric-label">Collective Wellness Index</span>
                        <div className="metric-value">74.2 <span className="trend positive">↑ 2.4%</span></div>
                        <p className="metric-subtext">Optimized from mood-tracking & screening data.</p>
                    </div>
                    <div className="metric-card glass-panel">
                        <span className="metric-label">Burnout Alert Probability</span>
                        <div className="metric-value" style={{ color: '#fbbf24' }}>18%</div>
                        <p className="metric-subtext">3 departments showing high velocity stress.</p>
                    </div>
                    <div className="metric-card glass-panel">
                        <span className="metric-label">Estimated Loss Productivity</span>
                        <div className="metric-value">$12.4k <span className="trend negative">↓ -$2k</span></div>
                        <p className="metric-subtext">Savings due to proactive intervetions.</p>
                    </div>
                </div>

                {/* Second Row: Detailed Insights */}
                <div className="insights-row">
                    {/* Stress Heatmap */}
                    <div className="glass-panel department-panel">
                        <h3 className="panel-title">Department Stress Variance</h3>
                        <div className="dept-list">
                            {departments.map((dept, i) => (
                                <div key={i} className="dept-item">
                                    <div className="dept-info">
                                        <span className="dept-name">{dept.name}</span>
                                        <span className="dept-val">{dept.stress}% Stress</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${dept.stress}%`,
                                                background: dept.stress > 70 ? '#ef4444' : dept.stress > 50 ? '#fbbf24' : '#34d399'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Predictions */}
                    <div className="glass-panel predictive-panel">
                        <h3 className="panel-title">Predictive AI Insights</h3>
                        <div className="ai-insight-box">
                            <div className="ai-icon">✨</div>
                            <div className="ai-text">
                                <strong>High Burnout Risk:</strong> "Operations" shows a 24% increase in negative sentiment over weekend vent-log data. Recommend <strong>No-Meeting Friday</strong> for Q3.
                            </div>
                        </div>
                        <div className="ai-insight-box">
                            <div className="ai-icon">📈</div>
                            <div className="ai-text">
                                <strong>Resilience Win:</strong> Recent "Breathing Workshop" engagement correlates with an 8% lift in PHQ-9 baseline scores in Engineering.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="admin-actions">
                    <button className="admin-btn-primary">Generate Quarterly Health Report</button>
                    <button className="admin-btn-outline">Deploy Silent Survey to 'Operations'</button>
                </div>
            </div>

            <style jsx>{`
                .admin-layout {
                    min-height: 100vh; position: relative; color: #fff;
                    padding: 100px 2rem 4rem;
                }
                .admin-bg-container {
                    position: fixed; inset: 0; z-index: -1; background: #020617;
                }
                .admin-overlay {
                    position: absolute; inset: 0; 
                    background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent),
                                radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.05), transparent);
                }
                .admin-content { max-width: 1200px; margin: 0 auto; }
                
                .admin-header { 
                    display: flex; justify-content: space-between; align-items: flex-end;
                    margin-bottom: 3rem;
                }
                .admin-title { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.03em; }
                .admin-subtitle { color: #94a3b8; font-size: 1.1rem; margin-top: 0.5rem; }
                
                .admin-user-pill {
                    background: rgba(255,255,255,0.05); padding: 0.6rem 1.2rem;
                    border-radius: 30px; border: 1px solid rgba(255,255,255,0.1);
                    display: flex; align-items: center; gap: 0.8rem; font-weight: 600;
                }
                .status-indicator { width: 10px; height: 10px; border-radius: 50%; background: #34d399; box-shadow: 0 0 10px #34d399; }

                .metrics-grid {
                    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem;
                }
                .metric-card { padding: 1.5rem; }
                .metric-label { font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
                .metric-value { font-size: 2.2rem; font-weight: 800; margin: 0.5rem 0; }
                .trend { font-size: 0.9rem; font-weight: 600; padding-left: 0.5rem; }
                .trend.positive { color: #34d399; }
                .trend.negative { color: #ef4444; }
                .metric-subtext { color: #64748b; font-size: 0.8rem; }

                .insights-row { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
                .panel-title { font-size: 1.1rem; margin-bottom: 1.5rem; color: #cbd5e1; }
                
                .dept-list { display: grid; gap: 1.2rem; }
                .dept-info { display: flex; justify-content: space-between; margin-bottom: 0.4rem; }
                .dept-name { font-weight: 600; }
                .dept-val { color: #94a3b8; font-size: 0.9rem; }
                .progress-bar-bg { height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
                .progress-bar-fill { height: 100%; transition: width 1s ease; }

                .ai-insight-box {
                    background: rgba(56, 189, 248, 0.05); border: 1px dashed rgba(56, 189, 248, 0.2);
                    padding: 1.2rem; border-radius: 12px; display: flex; gap: 1rem; margin-bottom: 1rem;
                }
                .ai-icon { font-size: 1.5rem; }
                .ai-text { font-size: 0.9rem; color: #e2e8f0; line-height: 1.5; }

                .admin-actions { display: flex; gap: 1rem; }
                .admin-btn-primary {
                    background: var(--primary); color: white; border: none; padding: 1rem 2rem;
                    border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;
                }
                .admin-btn-primary:hover { filter: brightness(1.1); transform: translateY(-2px); }
                .admin-btn-outline {
                    background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #fff;
                    padding: 1rem 2rem; border-radius: 12px; font-weight: 600; cursor: pointer;
                }
                .admin-btn-outline:hover { background: rgba(255,255,255,0.05); }

                @media (max-width: 900px) {
                    .metrics-grid { grid-template-columns: 1fr; }
                    .insights-row { grid-template-columns: 1fr; }
                }
            `}</style>
        </main>
    );
}
