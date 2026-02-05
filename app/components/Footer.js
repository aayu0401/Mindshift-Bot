"use client";

import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail("");
  };

  return (
    <footer className="glass-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3 className="footer-title">MindshiftR</h3>
            <p className="footer-text">
              Empowering mental resilience through AI and interactive CBT tools.
              Building a future where mental wellness is accessible to everyone.
            </p>
            <div className="social-icons">
              <span>🐦</span>
              <span>📸</span>
              <span>💼</span>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Platform</h4>
            <div className="footer-links">
              <a href="/screening">Clinical Screening</a>
              <a href="/bot">AI Companion</a>
              <a href="/dashboard">Daily Care</a>
              <a href="/crisis">Crisis Support</a>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Examples</h4>
            <div className="footer-links">
              <a href="/tasks/breathing">Breathing Tool</a>
              <a href="/tasks/grounding">Grounding Tool</a>
              <a href="/tasks/journal">Journaling</a>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Stay Connected</h4>
            <p className="footer-text" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Get weekly wellness tips and updates.
            </p>
            {subscribed ? (
              <div style={{ color: '#34d399', fontWeight: 'bold' }}>Success! Welcome aboard. 🌱</div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">&rarr;</button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1rem' }}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie settings</a>
          </div>
          &copy; {new Date().getFullYear()} MindshiftR. Not a replacement for professional medical advice.
        </div>
      </div>

      <style jsx>{`
        .glass-footer {
          background: #020617;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 5rem 0 3rem 0;
          margin-top: auto;
          position: relative;
        }
        .footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem; margin-bottom: 4rem;
        }
        .footer-title {
          font-size: 1.5rem; color: #fff; margin-bottom: 1rem;
          background: linear-gradient(to right, #e2e8f0, #94a3b8);
          -webkit-background-clip: text; color: transparent;
        }
        .footer-text {
          color: #94a3b8; max-width: 300px; line-height: 1.6; margin-bottom: 1.5rem;
        }
        .social-icons {
             display: flex; gap: 1rem; opacity: 0.6; cursor: pointer;
        }
        .social-icons span:hover { opacity: 1; transform: scale(1.1); transition: all 0.2s; }

        .footer-heading {
          color: #fff; margin-bottom: 1.2rem; font-size: 1rem; font-weight: 700;
        }
        .footer-links { display: flex; flex-direction: column; gap: 0.8rem; }
        .footer-links a {
          color: #64748b; font-size: 0.95rem; transition: color 0.2s;
        }
        .footer-links a:hover { color: #38bdf8; padding-left: 5px; }
        
        .newsletter-form {
            display: flex; background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px; padding: 0.3rem;
        }
        .newsletter-form input {
            background: transparent; border: none; color: white;
            padding: 0.5rem; flex: 1; font-size: 0.9rem;
        }
        .newsletter-form input:focus { outline: none; }
        .newsletter-form button {
            background: var(--primary); color: white; border: none;
            width: 30px; height: 30px; border-radius: 6px;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .newsletter-form button:hover { background: #0284c7; }

        .footer-bottom {
          text-align: center; color: #475569; font-size: 0.85rem;
          padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05);
        }
        .footer-bottom a { color: #64748b; transition: color 0.2s; }
        .footer-bottom a:hover { color: #94a3b8; }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
