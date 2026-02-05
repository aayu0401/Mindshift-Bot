"use client";

import { useState } from 'react';
import Link from "next/link";
import { useUserProgress } from '../../hooks/useUserProgress';

const steps = [
    { count: 5, text: "Things you can SEE", hint: "Look around you. Notice the details.", color: "#38bdf8", icon: "👁️" },
    { count: 4, text: "Things you can FEEL", hint: "Touch your clothes, the table, or your own hands.", color: "#818cf8", icon: "✋" },
    { count: 3, text: "Things you can HEAR", hint: "Listen carefully. Birds? Traffic? Silence?", color: "#a78bfa", icon: "👂" },
    { count: 2, text: "Things you can SMELL", hint: "Is there a scent in the air? Or recall a favorite smell.", color: "#c084fc", icon: "👃" },
    { count: 1, text: "Thing you can TASTE", hint: "Take a sip of water, or notice the taste in your mouth.", color: "#e879f9", icon: "👅" }
];

export default function GroundingTask() {
    const { addPoints } = useUserProgress();
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Completed
            addPoints(40); // Gamification
            setCurrentStep(steps.length);
        }
    };

    if (currentStep === steps.length) {
        return (
            <main className="container animate-fade-in" style={{ textAlign: 'center', paddingTop: '15vh' }}>
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
                <h1 className="title">Grounding Complete</h1>
                <p className="subtitle">You have successfully anchored yourself in the present.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem' }}>
                    <button onClick={() => setCurrentStep(0)} className="btn btn-outline" style={{ padding: '0.8rem 2rem' }}>Repeat Exercise</button>
                    <Link href="/dashboard" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Return to Dashboard</Link>
                </div>
            </main>
        );
    }

    const step = steps[currentStep];

    return (
        <main className="container animate-fade-in" style={{ height: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Link href="/dashboard" className="btn btn-outline" style={{ position: 'absolute', top: '2rem', left: '2rem' }}>&larr; Exit</Link>

            <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}>
                <div style={{ marginBottom: '2rem', display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                    Anxiety Relief Technique
                </div>

                <div
                    key={currentStep}
                    className="glass-card animate-fade-in"
                    style={{
                        padding: '4rem 2rem',
                        border: `1px solid ${step.color}50`,
                        boxShadow: `0 0 50px ${step.color}20`,
                        background: `linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, ${step.color}10 100%)`,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Background number */}
                    <div style={{
                        position: 'absolute', top: '-1rem', right: '-1rem',
                        fontSize: '15rem', opacity: 0.05, fontWeight: '900', color: step.color,
                        lineHeight: 1, pointerEvents: 'none'
                    }}>
                        {currentStep + 1}
                    </div>

                    <div style={{ fontSize: '4rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}>
                        {step.icon}
                    </div>

                    <div style={{ fontSize: '4rem', fontWeight: '800', color: step.color, lineHeight: 1, marginBottom: '0.5rem' }}>{step.count}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '300', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2rem' }}>{step.text}</div>

                    <p style={{ fontSize: '1.2rem', color: '#cbd5e1', marginBottom: '3rem', fontStyle: 'italic', minHeight: '3.6rem' }}>
                        "{step.hint}"
                    </p>

                    <button
                        onClick={handleNext}
                        className="btn"
                        style={{
                            width: '100%', padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold',
                            background: step.color, color: '#0f172a', border: 'none',
                            borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s'
                        }}
                    >
                        I've Found Them &rarr;
                    </button>
                </div>

                {/* Progress Dots */}
                <div style={{ marginTop: '3rem', display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                    {steps.map((s, i) => (
                        <div
                            key={i}
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: i === currentStep ? s.color : (i < currentStep ? '#fff' : 'rgba(255,255,255,0.1)'),
                                transform: i === currentStep ? 'scale(1.3)' : 'scale(1)',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
