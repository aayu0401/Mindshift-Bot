"use client";
import { useState, useEffect, useRef } from 'react';
import NextImage from 'next/image';

export default function VentMode() {
    const [isRecording, setIsRecording] = useState(false);
    const [time, setTime] = useState(0);
    const [transcript, setTranscript] = useState("");
    const [step, setStep] = useState(0); // 0: Intro, 1: Recording, 2: Summary
    const intervalRef = useRef(null);

    // Simulated "Audio Visualizer" bar heights
    const [bars, setBars] = useState(new Array(20).fill(10));

    useEffect(() => {
        if (isRecording) {
            intervalRef.current = setInterval(() => {
                setTime(prev => prev + 1);
                // Randomize bars for visualizer effect
                setBars(bars.map(() => Math.random() * 40 + 10));
            }, 100);
        } else {
            clearInterval(intervalRef.current);
            setBars(new Array(20).fill(10));
        }
        return () => clearInterval(intervalRef.current);
    }, [isRecording]);

    const toggleRecording = () => {
        if (isRecording) {
            // Stop
            setIsRecording(false);
            setStep(2);
            // Simulate processing
            setTimeout(() => {
                setTranscript("I've been feeling really overwhelmed lately with work and everything. It just feels like I can't catch a break...");
            }, 1000);
        } else {
            // Start
            setStep(1);
            setIsRecording(true);
        }
    };

    const formatTime = (s) => {
        const min = Math.floor(s / 60);
        const sec = Math.floor(s % 60); // Use Math.floor to get integer seconds
        // Since the interval is 100ms, 'time' is actually deciseconds used for visualization speed? 
        // Let's adjust logic: 
        // Actually, let's treat 'time' count as 'deciseconds' for simpler visual update, 
        // but for display, let's just approximate.
        const realSec = Math.floor(s / 10);
        const displayMin = Math.floor(realSec / 60);
        const displaySec = realSec % 60;
        return `${displayMin}:${displaySec < 10 ? '0' : ''}${displaySec}`;
    };

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '0', paddingBottom: '0', height: '100vh', position: 'relative', overflow: 'hidden' }}>

            {/* Immersive Background */}
            <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                <NextImage src="/vent-bg.png" alt="Vent Background" fill style={{ objectFit: 'cover' }} quality={90} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.7)' }}></div>
            </div>

            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', zIndex: 1, position: 'relative' }}>

                {step === 0 && (
                    <div className="glass-card animate-fade-in" style={{ padding: '3rem', maxWidth: '500px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Vent Mode</h1>
                        <p style={{ color: '#cbd5e1', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            Speak your mind freely. No judgment. Just you and a safe space to let it out.
                        </p>
                        <button onClick={toggleRecording} className="mic-btn">
                            🎙️ Tap to Speak
                        </button>
                    </div>
                )}

                {step === 1 && (
                    <div className="animate-fade-in" style={{ width: '100%' }}>
                        <h2 style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'normal', marginBottom: '2rem' }}>Listening...</h2>

                        {/* Audio Visualizer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '60px', marginBottom: '2rem' }}>
                            {bars.map((h, i) => (
                                <div key={i} style={{
                                    width: '6px',
                                    height: `${h}px`,
                                    background: '#a78bfa',
                                    borderRadius: '3px',
                                    transition: 'height 0.1s ease'
                                }}></div>
                            ))}
                        </div>

                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff', marginBottom: '3rem', fontFamily: 'monospace' }}>
                            {formatTime(time)}
                        </div>

                        <button onClick={toggleRecording} className="mic-btn active">
                            ⏹️ Stop
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="glass-card animate-fade-in" style={{ padding: '3rem', maxWidth: '600px', width: '90%' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Session Summary</h2>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', marginBottom: '2rem', color: '#e2e8f0', fontStyle: 'italic' }}>
                            {transcript || "Processing your thoughts..."}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button className="btn btn-primary" onClick={() => setStep(0)}>New Session</button>
                            <button className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444' }}>Delete Recording</button>
                        </div>
                    </div>
                )}

            </div>

            <style jsx>{`
                .mic-btn {
                    width: 80px; height: 80px; border-radius: 50%; border: none;
                    background: var(--primary); color: white; font-size: 2rem;
                    cursor: pointer; box-shadow: 0 0 20px rgba(56, 189, 248, 0.5);
                    transition: transform 0.2s, box-shadow 0.2s;
                    display: flex; alignItems: center; justifyContent: center; margin: 0 auto;
                }
                .mic-btn:hover { transform: scale(1.1); box-shadow: 0 0 30px rgba(56, 189, 248, 0.7); }
                
                .mic-btn.active {
                    background: #ef4444; box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); animation: pulse 1.5s infinite;
                }
                
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
            `}</style>
        </main>
    );
}
