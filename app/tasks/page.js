"use client";
import Link from "next/link";
import PremiumBackground from "../components/PremiumBackground";

const tools = [
    {
        id: 'breathing',
        title: 'Resonance Breathing',
        desc: 'Sync your breath to regulation frequency (0.1Hz) to lower cortisol.',
        icon: '🌬️',
        duration: '5 min',
        difficulty: 'Easy',
        color: '#818cf8',
        link: '/tasks/breathing'
    },
    {
        id: 'grounding',
        title: '5-4-3-2-1 Grounding',
        desc: 'A sensory engagement technique to stop panic attacks instantly.',
        icon: '🖐️',
        duration: '3 min',
        difficulty: 'Easy',
        color: '#34d399',
        link: '/tasks/grounding'
    },
    {
        id: 'journal',
        title: 'Daily Reflection',
        desc: 'Process emotions and identify patterns with guided prompts.',
        icon: '✍️',
        duration: '10 min',
        difficulty: 'Medium',
        color: '#fbbf24',
        link: '/tasks/journal'
    },
    {
        id: 'activity',
        title: 'Movement Break',
        desc: 'Shift your physiology with quick, guided physical activity.',
        icon: '👟',
        duration: '10 min',
        difficulty: 'Medium',
        color: '#f472b6',
        link: '/tasks/activity'
    },
    {
        id: 'bot',
        title: 'AI Companion',
        desc: 'Chat with MindshiftR for advice, venting, or CBT coaching.',
        icon: '🤖',
        duration: 'Unlimited',
        difficulty: 'Adaptive',
        color: '#38bdf8',
        link: '/bot'
    }
];

export default function ToolboxPage() {
    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <PremiumBackground />

            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="title">Wellness Toolbox</h1>
                <p className="subtitle" style={{ margin: '0 auto' }}>
                    A collection of evidence-based tools to regulate your nervous system and build resilience.
                </p>
            </div>

            <div className="toolbox-grid">
                {tools.map((tool, index) => (
                    <Link href={tool.link} key={tool.id} className="glass-card tool-item animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="tool-icon-wrapper" style={{ borderColor: tool.color, color: tool.color, background: `${tool.color}15` }}>
                            {tool.icon}
                        </div>
                        <div className="tool-content">
                            <h3>{tool.title}</h3>
                            <p>{tool.desc}</p>
                            <div className="meta-tags">
                                <span className="tag">⏱️ {tool.duration}</span>
                                <span className="tag">⚡ {tool.difficulty}</span>
                            </div>
                        </div>
                        <div className="arrow-icon">→</div>
                    </Link>
                ))}
            </div>

            <style jsx>{`
                .toolbox-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 2rem;
                }
                .tool-item {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    text-decoration: none;
                    transition: all 0.3s;
                }
                .tool-item:hover {
                    transform: translateY(-5px);
                    background: rgba(30, 41, 59, 0.8);
                    border-color: rgba(255, 255, 255, 0.2);
                }
                .tool-icon-wrapper {
                    width: 60px; height: 60px;
                    border-radius: 16px;
                    border: 1px solid;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 2rem;
                    flex-shrink: 0;
                }
                .tool-content { flex: 1; }
                .tool-content h3 { color: #fff; margin-bottom: 0.5rem; font-size: 1.2rem; }
                .tool-content p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.5; }
                
                .meta-tags { display: flex; gap: 0.8rem; }
                .tag {
                    font-size: 0.75rem; color: #cbd5e1;
                    background: rgba(255,255,255,0.05); padding: 0.3rem 0.6rem;
                    border-radius: 12px;
                }

                .arrow-icon {
                    color: #fff; font-size: 1.5rem; opacity: 0; transition: all 0.3s;
                    transform: translateX(-10px);
                }
                .tool-item:hover .arrow-icon { opacity: 1; transform: translateX(0); }

                @media (max-width: 600px) {
                    .toolbox-grid { grid-template-columns: 1fr; }
                    .tool-item { flex-direction: column; text-align: center; padding: 2.5rem; }
                    .tool-content { margin-top: 1rem; }
                    .meta-tags { justify-content: center; }
                    .arrow-icon { display: none; }
                }
            `}</style>
        </main>
    );
}
