"use client";
import { useState } from 'react';
import Link from 'next/link';

const therapists = [
    { id: 1, name: "Dr. Sarah Chen", specialty: "CBT & Anxiety", exp: "12 Yrs", rate: "$120/hr", available: true, image: "👩‍⚕️" },
    { id: 2, name: "Mark Davis, LMFT", specialty: "Trauma & PTSD", exp: "8 Yrs", rate: "$100/hr", available: false, image: "👨‍⚕️" },
    { id: 3, name: "Dr. Emily R.", specialty: "Mindfulness", exp: "15 Yrs", rate: "$150/hr", available: true, image: "👩‍⚕️" },
    { id: 4, name: "James Wilson", specialty: "Depression", exp: "5 Yrs", rate: "$90/hr", available: true, image: "👨‍⚕️" },
];

export default function TherapistsPage() {
    const [search, setSearch] = useState("");

    const filtered = therapists.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.specialty.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="title">Find a Professional</h1>
                <p className="subtitle">Connect with licensed therapists who understand your journey.</p>
                <div style={{ maxWidth: '500px', margin: '2rem auto 0' }}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Search by name or specialty (e.g. Anxiety)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="therapist-grid">
                {filtered.map(doc => (
                    <div key={doc.id} className="glass-card therapist-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div className="avatar-med">{doc.image}</div>
                            {doc.available ?
                                <span className="status-badge available">Available</span> :
                                <span className="status-badge busy">Fully Booked</span>
                            }
                        </div>

                        <h3 style={{ color: '#fff', marginTop: '1rem', marginBottom: '0.2rem' }}>{doc.name}</h3>
                        <p style={{ color: '#38bdf8', fontSize: '0.9rem', marginBottom: '1rem' }}>{doc.specialty}</p>

                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                            <span>💼 {doc.exp} Experience</span>
                            <span>💵 {doc.rate}</span>
                        </div>

                        <button className="btn btn-outline" style={{ width: '100%' }}>View Profile</button>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .therapist-grid {
                    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 2rem;
                }
                .therapist-card {
                    transition: transform 0.2s;
                }
                .therapist-card:hover { transform: translateY(-5px); border-color: var(--primary); }
                
                .avatar-med {
                    width: 60px; height: 60px; background: rgba(255,255,255,0.05);
                    border-radius: 50%; display: flex; alignItems: center; justifyContent: center;
                    font-size: 2rem;
                }
                .status-badge {
                    font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 20px; font-weight: bold;
                }
                .status-badge.available { background: rgba(52, 211, 153, 0.2); color: #34d399; }
                .status-badge.busy { background: rgba(239, 68, 68, 0.2); color: #f87171; }
            `}</style>
        </main>
    );
}
