'use client';

import { useState } from 'react';

const BotSettings = ({ 
  mode, 
  setMode, 
  weights, 
  setWeights, 
  onClose, 
  isVisible 
}) => {
  const [localWeights, setLocalWeights] = useState({ ...weights });

  const modes = [
    { id: 'advice', label: '🧠 Advice', description: 'Get therapeutic guidance and support', color: '#38bdf8' },
    { id: 'cbt', label: '💭 CBT', description: 'Cognitive Behavioral Therapy exercises', color: '#a78bfa' },
    { id: 'mindfulness', label: '🧘 Mindfulness', description: 'Grounding and breathing exercises', color: '#34d399' },
    { id: 'vent', label: '👂 Vent', description: "I'll just listen, no advice", color: '#f472b6' }
  ];

  const handleModeChange = (newMode) => {
    setMode(newMode);
    onClose();
  };

  const handleWeightChange = (style, value) => {
    const newWeights = { ...localWeights, [style]: parseFloat(value) };
    setLocalWeights(newWeights);
  };

  const saveWeights = () => {
    setWeights(localWeights);
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('mindshiftr_progress') || '{}');
      progress.weights = localWeights;
      localStorage.setItem('mindshiftr_progress', JSON.stringify(progress));
    }
    onClose();
  };

  const resetWeights = () => {
    const defaultWeights = { empathetic: 1.0, direct: 1.0, socratic: 1.0, mindfulness: 1.0 };
    setLocalWeights(defaultWeights);
  };

  if (!isVisible) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h3>⚙️ Bot Settings</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-section">
          <h4>🎯 Therapy Mode</h4>
          <div className="mode-grid">
            {modes.map(m => (
              <button
                key={m.id}
                className={`mode-card ${mode === m.id ? 'active' : ''}`}
                onClick={() => handleModeChange(m.id)}
                style={{ borderColor: mode === m.id ? m.color : 'transparent' }}
              >
                <div className="mode-icon">{m.label}</div>
                <div className="mode-info">
                  <div className="mode-name">{m.id}</div>
                  <div className="mode-desc">{m.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <h4>🧠 AI Personality Weights</h4>
          <div className="weights-grid">
            {Object.entries(localWeights).map(([style, weight]) => (
              <div key={style} className="weight-item">
                <label className="weight-label">
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={weight}
                  onChange={(e) => handleWeightChange(style, e.target.value)}
                  className="weight-slider"
                />
                <span className="weight-value">{weight.toFixed(1)}</span>
              </div>
            ))}
          </div>
          <div className="weight-actions">
            <button className="btn-secondary" onClick={resetWeights}>
              Reset to Default
            </button>
            <button className="btn-primary" onClick={saveWeights}>
              Save Weights
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h4>ℹ️ About</h4>
          <div className="about-text">
            <p>MindshiftR AI adapts to your preferences based on feedback. The weights above control how the AI responds in different therapeutic styles.</p>
            <p>Higher weights make that style more likely to be used in responses.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .settings-panel {
          background: rgba(15, 23, 42, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .settings-header h3 {
          color: #fff;
          margin: 0;
          font-size: 1.5rem;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #fff;
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .settings-section {
          margin-bottom: 2rem;
        }

        .settings-section h4 {
          color: #fff;
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
        }

        .mode-grid {
          display: grid;
          gap: 1rem;
        }

        .mode-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }

        .mode-card.active {
          background: rgba(56, 189, 248, 0.1);
        }

        .mode-icon {
          font-size: 1.5rem;
        }

        .mode-info {
          flex: 1;
          text-align: left;
        }

        .mode-name {
          color: #fff;
          font-weight: 600;
          margin-bottom: 0.2rem;
        }

        .mode-desc {
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .weights-grid {
          display: grid;
          gap: 1rem;
        }

        .weight-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .weight-label {
          color: #fff;
          font-size: 0.9rem;
          min-width: 100px;
        }

        .weight-slider {
          flex: 1;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          cursor: pointer;
        }

        .weight-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #38bdf8;
          cursor: pointer;
        }

        .weight-value {
          color: #38bdf8;
          font-weight: 600;
          min-width: 40px;
          text-align: right;
        }

        .weight-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .btn-primary, .btn-secondary {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #38bdf8;
          color: #020617;
        }

        .btn-primary:hover {
          background: #0ea5e9;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .about-text {
          color: #94a3b8;
          line-height: 1.6;
        }

        .about-text p {
          margin: 0 0 1rem 0;
        }
      `}</style>
    </div>
  );
};

export default BotSettings;
