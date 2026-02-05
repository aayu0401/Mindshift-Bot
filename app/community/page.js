"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PremiumBackground from '../components/PremiumBackground';
import { useUserProgress } from '../hooks/useUserProgress';
import { CommunityService, NotificationService } from '@/lib/services';

const initialPosts = [
    { id: 1, author: "ForestHiker", tag: "Anxiety", content: "Used the grounding tool today before my presentation. Actually helped a ton – pulse stayed stable. 😌", likes: 12, replies: 2, time: "2h ago", color: "#38bdf8", online: true },
    { id: 2, author: "RiverStone", tag: "Vent", content: "Feeling really overwhelmed by the new project. Just need to know I'm not alone in this boat.", likes: 24, replies: 5, time: "4h ago", color: "#a78bfa", online: false },
    { id: 3, author: "SunSeeker", tag: "Win", content: "Hit my 14-day streak! 🔥 The daily check-ins are becoming a part of me.", likes: 56, replies: 8, time: "6h ago", color: "#34d399", online: true },
    { id: 4, author: "NightOwl", tag: "Advice", content: "Anyone found good ways to manage late-night scrolling? My sleep data is looking rough.", likes: 18, replies: 12, time: "8h ago", color: "#fbbf24", online: false },
    { id: 5, author: "MindfulMaven", tag: "CBT", content: "Just completed my first thought record. Mind blown at how many cognitive distortions I had!", likes: 31, replies: 6, time: "10h ago", color: "#f472b6", online: true }
];

const trendingTopics = [
    { name: "#BreathingExercises", posts: 234 },
    { name: "#MorningRoutine", posts: 189 },
    { name: "#AnxietyTips", posts: 156 },
    { name: "#Gratitude", posts: 142 },
];

export default function CommunityPage() {
    const { addPoints } = useUserProgress();
    const [posts, setPosts] = useState(initialPosts);
    const [newPost, setNewPost] = useState("");
    const [filter, setFilter] = useState("All");
    const [isPosting, setIsPosting] = useState(false);
    const [activity, setActivity] = useState("Gathering community pulse...");
    const [activeUsers, setActiveUsers] = useState(1240);

    // Simulated "Real-time" Activity
    useEffect(() => {
        const interval = setInterval(() => {
            const nextActivity = CommunityService.generateActivity();
            setActivity(nextActivity);
            setActiveUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));

            // Randomly like a post
            if (Math.random() > 0.7) {
                setPosts(current => {
                    const idx = Math.floor(Math.random() * current.length);
                    const updated = [...current];
                    updated[idx] = { ...updated[idx], likes: updated[idx].likes + 1 };
                    return updated;
                });
            }

            // Randomly add a new anonymous post every 60 seconds
            if (Math.random() > 0.95) {
                const anonPosts = [
                    "Just finished my evening grounding. Feeling much better.",
                    "The AI Copilot just gave me a great tip for burnout.",
                    "Remember to breathe today. You are doing enough.",
                    "Day 4 without panic. Progress isn't linear but it's happening."
                ];
                const newAnon = {
                    id: Date.now(),
                    author: "Anonymous",
                    tag: "Support",
                    content: anonPosts[Math.floor(Math.random() * anonPosts.length)],
                    likes: 0,
                    replies: 0,
                    time: "Just now",
                    color: "#94a3b8",
                    online: true
                };
                setPosts(prev => [newAnon, ...prev.slice(0, 19)]);
                NotificationService.sendToast("New Community Post", "A new shared experience was posted.", "info");
            }

        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handlePost = (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        setIsPosting(true);
        setTimeout(() => {
            const post = {
                id: Date.now(),
                author: "You",
                tag: "Support",
                content: newPost,
                likes: 0,
                replies: 0,
                time: "Just now",
                color: "#f472b6",
                online: true
            };

            const updated = [post, ...posts];
            setPosts(updated);
            CommunityService.savePost(post);
            setNewPost("");
            setIsPosting(false);
            addPoints(15);
        }, 800);
    };

    const handleLike = (id) => {
        setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    };

    const filteredPosts = filter === "All"
        ? posts
        : posts.filter(p => p.tag === filter);

    return (
        <main className="container animate-fade-in" style={{ padding: 0, minHeight: '100vh', position: 'relative' }}>
            <PremiumBackground />

            <div className="content-wrapper">

                {/* Real-time Global Pulse Bar */}
                <div className="pulse-bar glass-card">
                    <div className="pulse-dot"></div>
                    <span className="activity-text">{activity}</span>
                    <div className="active-count">
                        <span className="count">{activeUsers.toLocaleString()}</span> minds online
                    </div>
                </div>

                <div className="community-layout">

                    {/* Sidebar Left: Mood Map & Navigation */}
                    <aside className="sidebar-left">
                        <div className="glass-card mood-map-widget">
                            <h3>Global Emotional Resonance</h3>
                            <div className="mood-bars">
                                <div className="mood-bar"><div className="fill calmness" style={{ width: '65%' }}></div><span>Calm</span></div>
                                <div className="mood-bar"><div className="fill focus" style={{ width: '42%' }}></div><span>Focus</span></div>
                                <div className="mood-bar"><div className="fill energy" style={{ width: '58%' }}></div><span>Energy</span></div>
                            </div>
                        </div>

                        <div className="glass-card nav-widget">
                            <button className={`nav-btn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>🌐 All Feeds</button>
                            <button className={`nav-btn ${filter === 'Win' ? 'active' : ''}`} onClick={() => setFilter('Win')}>🏆 Wins & Streaks</button>
                            <button className={`nav-btn ${filter === 'Advice' ? 'active' : ''}`} onClick={() => setFilter('Advice')}>💡 Recovery Advise</button>
                            <button className={`nav-btn ${filter === 'Vent' ? 'active' : ''}`} onClick={() => setFilter('Vent')}>📣 The Vent Vault</button>
                        </div>
                    </aside>

                    {/* Center: Feed */}
                    <div className="feed-area">
                        <div className="glass-card composer">
                            <form onSubmit={handlePost}>
                                <textarea
                                    placeholder="Shift your mindset. Share a win or ask for support..."
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                />
                                <div className="composer-actions">
                                    <div className="tags">
                                        <span className="tag-sel">#Anxiety</span>
                                        <span className="tag-sel">#GoalHit</span>
                                    </div>
                                    <button className="btn btn-primary" disabled={!newPost.trim() || isPosting}>
                                        {isPosting ? 'Sending...' : 'Post Shift'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="feed-list">
                            {filteredPosts.map((post, idx) => (
                                <article key={post.id} className="post-card glass-card animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="post-header">
                                        <div className="user-blob" style={{ background: post.color }}>{post.author[0]}</div>
                                        <div className="user-meta">
                                            <span className="name">{post.author}</span>
                                            <span className="time">{post.time}</span>
                                        </div>
                                        <span className="topic-badge" style={{ background: `${post.color}20`, color: post.color }}>{post.tag}</span>
                                    </div>
                                    <p className="post-body">{post.content}</p>
                                    <div className="post-footer">
                                        <button className="post-btn" onClick={() => handleLike(post.id)}>❤️ {post.likes}</button>
                                        <button className="post-btn">💬 {post.replies}</button>
                                        <button className="post-btn share">🚀 Share</button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Right: Trending & Pro */}
                    <aside className="sidebar-right">
                        <div className="glass-card trending-widget">
                            <h3>Trending Shifts</h3>
                            {trendingTopics.map(t => (
                                <div key={t.name} className="trend-item">
                                    <span className="t-name">{t.name}</span>
                                    <span className="t-stat">{t.posts} seekers</span>
                                </div>
                            ))}
                        </div>

                        <div className="glass-card ai-ad">
                            <div className="ai-icon">🤖</div>
                            <h4>Need Private Support?</h4>
                            <p>Our AI Copilot is available 24/7 for deeper, 1-on-1 conversations.</p>
                            <Link href="/bot" className="btn btn-outline" style={{ width: '100%' }}>Launch Chat</Link>
                        </div>
                    </aside>

                </div>
            </div>

            <style jsx>{`
                .content-wrapper { padding: 100px 2rem 5rem; max-width: 1300px; margin: 0 auto; }
                
                .pulse-bar {
                    margin-bottom: 2rem; padding: 1rem 2rem;
                    display: flex; align-items: center; gap: 1rem;
                    background: rgba(14, 165, 233, 0.1);
                    border-color: rgba(14, 165, 233, 0.2);
                }
                .pulse-dot {
                    width: 10px; height: 10px; background: #38bdf8; border-radius: 50%;
                    box-shadow: 0 0 10px #38bdf8; animation: pulse 2s infinite;
                }
                .activity-text { flex: 1; font-size: 0.95rem; color: #fff; font-weight: 500; }
                .active-count { font-size: 0.85rem; color: #94a3b8; }
                .active-count .count { color: #38bdf8; font-weight: 700; }

                .community-layout { display: grid; grid-template-columns: 260px 1fr 260px; gap: 2rem; }
                
                .sidebar-left, .sidebar-right { display: flex; flex-direction: column; gap: 1.5rem; }
                
                .mood-map-widget h3, .trending-widget h3 { font-size: 0.9rem; text-transform: uppercase; color: #64748b; margin-bottom: 1.2rem; letter-spacing: 1px; }
                
                .mood-bars { display: flex; flex-direction: column; gap: 1rem; }
                .mood-bar { font-size: 0.8rem; color: #94a3b8; }
                .fill { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1); margin-bottom: 4px; position: relative; overflow: hidden; }
                .fill::after { content: ''; position: absolute; inset: 0; transition: width 1s ease; }
                .calmness { background: #34d399; }
                .focus { background: #38bdf8; }
                .energy { background: #fbbf24; }

                .nav-widget { padding: 0.5rem; }
                .nav-btn {
                    width: 100%; text-align: left; padding: 0.8rem 1rem; border: none; background: transparent;
                    color: #94a3b8; border-radius: 12px; cursor: pointer; transition: all 0.2s; font-weight: 500;
                }
                .nav-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }
                .nav-btn.active { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }

                .composer { padding: 1.5rem; margin-bottom: 1.5rem; }
                .composer textarea {
                    width: 100%; height: 100px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 16px; padding: 1rem; color: #fff; resize: none; margin-bottom: 1rem;
                }
                .composer-actions { display: flex; justify-content: space-between; align-items: center; }
                .tag-sel { font-size: 0.8rem; color: #64748b; margin-right: 0.8rem; cursor: pointer; }

                .feed-list { display: flex; flex-direction: column; gap: 1rem; }
                .post-card { padding: 1.5rem; }
                .post-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
                .user-blob { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #020617; }
                .user-meta { flex: 1; display: flex; flex-direction: column; }
                .name { color: #fff; font-weight: 600; }
                .time { color: #64748b; font-size: 0.8rem; }
                .topic-badge { font-size: 0.7rem; font-weight: 700; padding: 0.3rem 0.6rem; border-radius: 8px; }
                .post-body { color: #cbd5e1; line-height: 1.6; margin-bottom: 1.5rem; }
                
                .post-footer { display: flex; gap: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); pt: 1rem; }
                .post-btn { background: transparent; border: none; color: #94a3b8; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem; border-radius: 8px; }
                .post-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }
                .share { margin-left: auto; }

                .trend-item { display: flex; flex-direction: column; margin-bottom: 1rem; }
                .t-name { color: #38bdf8; font-weight: 600; font-size: 0.9rem; }
                .t-stat { font-size: 0.75rem; color: #64748b; }

                .ai-ad { text-align: center; padding: 2rem; background: linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(167, 139, 250, 0.05)); }
                .ai-icon { font-size: 2.5rem; margin-bottom: 1rem; }
                .ai-ad h4 { color: #fff; margin-bottom: 0.5rem; }
                .ai-ad p { font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.5rem; }

                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }

                @media (max-width: 1100px) {
                    .community-layout { grid-template-columns: 1fr; }
                    .sidebar-left, .sidebar-right { display: none; }
                }
            `}</style>
        </main>
    );
}
