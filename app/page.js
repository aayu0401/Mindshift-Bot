"use client";
import Link from "next/link";
import PremiumBackground from "./components/PremiumBackground";

export default function Home() {
  return (
    <main style={{ position: 'relative', overflowX: 'hidden' }}>

      {/* Hero Section */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '2rem' }}>
        <PremiumBackground />

        <div className="container animate-fade-in" style={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '2rem'
        }}>

          <div className="float-slow" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 1.4rem',
            background: 'rgba(56, 189, 248, 0.08)',
            borderRadius: '50px',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            color: '#7dd3fc',
            marginBottom: '2.5rem',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '1.1rem' }}>✨</span>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px' }}>THE FUTURE OF RESILIENCE</span>
          </div>

          <h1 className="title" style={{
            fontSize: 'clamp(3.5rem, 9vw, 6.5rem)',
            lineHeight: 1.05,
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right bottom, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 40px rgba(56, 189, 248, 0.15))'
          }}>
            MindshiftR
          </h1>

          <p className="subtitle" style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            maxWidth: '700px',
            margin: '0 auto 3.5rem auto',
            color: '#cbd5e1',
            lineHeight: 1.6
          }}>
            A complete ecosystem for emotional intelligence. Combining clinical-grade screening, AI companionship, and bio-regulated care tasks.
          </p>

          <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="btn btn-primary" style={{
              padding: '1.1rem 2.8rem',
              fontSize: '1.1rem',
              borderRadius: '50px',
              boxShadow: '0 0 30px rgba(56, 189, 248, 0.3)'
            }}>
              Launch App
            </Link>
            <Link href="/screening" className="btn btn-outline" style={{
              padding: '1.1rem 2.8rem',
              fontSize: '1.1rem',
              borderRadius: '50px',
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.1)'
            }}>
              Take Assessment
            </Link>
          </div>

          {/* Social Proof / Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginTop: '5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem' }}>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>10k+</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Minds</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38bdf8' }}>1.M+</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Minutes Meditated</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#a78bfa' }}>4.9</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>App Rating</div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Features Grid */}
      <section className="container" style={{ padding: '8rem 1.5rem', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
            Tools for Every State of Mind
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Precision tools adapted to your real-time needs.</p>
        </div>

        <div className="grid-3">
          <Link href="/tasks/breathing" className="glass-card feature-card">
            <div className="feature-icon" style={{ background: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', borderColor: 'rgba(129, 140, 248, 0.3)' }}>🌬️</div>
            <h3>Resonance Breathing</h3>
            <p>Interactive bio-feedback tool to instantly lower cortisol levels and regulate HRV.</p>
            <div className="card-shine"></div>
          </Link>

          <Link href="/bot" className="glass-card feature-card">
            <div className="feature-icon" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}>🤖</div>
            <h3>AI Copilot</h3>
            <p>Adaptive emotional support engine. Choose between empathetic listening or socratic coaching.</p>
            <div className="card-shine"></div>
          </Link>

          <Link href="/tasks/grounding" className="glass-card feature-card">
            <div className="feature-icon" style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)' }}>🖐️</div>
            <h3>Sensory Grounding</h3>
            <p>Digital implementation of the 5-4-3-2-1 technique for immediate panic relief.</p>
            <div className="card-shine"></div>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '8rem 0', background: 'linear-gradient(to bottom, transparent, #0f172a)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '800' }}>Clinical-Grade Logic</h2>
            <p style={{ color: '#94a3b8' }}>Our approach blends cognitive psychology with advanced AI.</p>
          </div>

          <div className="grid-3">
            <div className="feature-item">
              <div className="icon-box">🧠</div>
              <h3>CBT Principles</h3>
              <p>Based on Cognitive Behavioral Therapy techniques to identify and reframe negative thought patterns.</p>
            </div>
            <div className="feature-item">
              <div className="icon-box">📊</div>
              <h3>Biometric Awareness</h3>
              <p>Uses resonance breathing to actively regulate your Heart Rate Variability (HRV).</p>
            </div>
            <div className="feature-item">
              <div className="icon-box">🤝</div>
              <h3>Privacy First</h3>
              <p>Your mental health data is encrypted and stored locally. No ads, no selling data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="faq-section" style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '8rem', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '800', textAlign: 'center', marginBottom: '3rem' }}>Everything You Need to Know</h2>

        <div className="faq-item">
          <details>
            <summary>Is this a replacement for a therapist?</summary>
            <p>No. MindshiftR is a self-care and resilience tool. While it uses therapeutic techniques, it is not a diagnosis or a replacement for professional clinical care.</p>
          </details>
        </div>
        <div className="faq-item">
          <details>
            <summary>How does the AI Copilot work?</summary>
            <p>Our AI is trained on supportive, non-judgmental datasets. It uses Retrieval Augmented Generation (RAG) to provide scientifically-backed coping strategies rather than generic advice.</p>
          </details>
        </div>
        <div className="faq-item">
          <details>
            <summary>Is my journal private?</summary>
            <p>Absolutely. Your journal entries are stored in your interactions and are not used to train global AI models without your explicit consent.</p>
          </details>
        </div>
        <div className="faq-item">
          <details>
            <summary>Does it connect to my smartwatch?</summary>
            <p>Yes! Check out our new <strong>Vitals Hub</strong> to sync your wearable data. We analyze your heart rate variability (HRV) and sleep patterns to give you personalized wellness insights.</p>
          </details>
        </div>
      </div>

      <style jsx>{`
            .feature-card {
                padding: 3rem 2rem;
                text-align: left;
                position: relative;
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                overflow: hidden;
            }
            .feature-card:hover { transform: translateY(-10px); }
            
            .feature-icon {
                font-size: 3rem; margin-bottom: 1.5rem;
                width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;
                border-radius: 20px; border: 1px solid;
            }

            .feature-card h3 { font-size: 1.5rem; margin-bottom: 1rem; color: #fff; }
            .feature-card p { font-size: 1rem; color: #94a3b8; line-height: 1.6; }

            .card-shine {
                position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: linear-gradient(125deg, transparent 40%, rgba(255,255,255,0.05) 45%, transparent 50%);
                transform: translateX(-100%); transition: transform 0.6s;
            }
            .feature-card:hover .card-shine { transform: translateX(100%); }
        `}</style>

    </main>
  );
}
