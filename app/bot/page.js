"use client";

import { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import PremiumBackground from '../components/PremiumBackground';
import { UserProgressService, CrisisService, VitalsService, ChatService } from '@/lib/services';

/**
 * ============================================
 * MINDSHIFTR AI - ENHANCED COMPANION
 * Multi-modal therapeutic chatbot with:
 * - Multiple therapy modes (Advice, Vent, CBT, Mindfulness)
 * - Reinforcement Learning persona adaptation
 * - Crisis detection & escalation
 * - Tool suggestions based on conversation
 * ============================================
 */

const QUICK_REPLIES = {
  advice: [
    "I'm feeling anxious 😰",
    "I can't stop worrying 🔄",
    "I need motivation 🚀",
    "Just wanted to chat 👋",
    "I'm overwhelmed 🤯"
  ],
  cbt: [
    "Help me challenge a thought 🧠",
    "I'm catastrophizing again",
    "I feel like a failure",
    "Nothing ever goes right",
    "Everyone is judging me"
  ],
  mindfulness: [
    "Guide me through breathing 🌬️",
    "I need to ground myself",
    "My mind is racing",
    "Help me be present",
    "Body scan please"
  ],
  vent: [
    "Just need to let it out",
    "Today was rough",
    "Nobody understands",
    "I'm so frustrated"
  ]
};

const MODES = [
  { id: 'advice', label: '🧠 Advice', description: 'Get therapeutic guidance and support' },
  { id: 'cbt', label: '💭 CBT', description: 'Cognitive Behavioral Therapy exercises' },
  { id: 'mindfulness', label: '🧘 Mindfulness', description: 'Grounding and breathing exercises' },
  { id: 'vent', label: '👂 Vent', description: "I'll just listen, no advice" }
];

const VENT_RESPONSES = [
  "I'm listening.",
  "I hear you.",
  "That sounds heavy.",
  "Go on...",
  "I'm here.",
  "Take your time.",
  "That's valid.",
  "I understand.",
  "Let it out.",
  "I'm not going anywhere."
];

const CBT_EXERCISES = {
  thoughtChallenge: {
    intro: "Let's challenge that thought together. This is called cognitive restructuring.",
    steps: [
      "First, what's the automatic thought that came up?",
      "What emotion does this thought create? Rate it 1-10.",
      "What evidence supports this thought?",
      "What evidence goes AGAINST this thought?",
      "Now, what's a more balanced way to see this?"
    ]
  },
  behavioralExperiment: {
    intro: "Let's test that belief. We'll design a small experiment.",
    steps: [
      "What belief are we testing?",
      "What's a small, safe way to test it?",
      "What do you predict will happen?",
      "Try it and report back!"
    ]
  }
};

const MINDFULNESS_EXERCISES = {
  breathing_478: {
    name: "4-7-8 Breathing",
    script: [
      "Let's do 4-7-8 breathing. Find a comfortable position.",
      "Breathe IN through your nose for 4 seconds... 1... 2... 3... 4...",
      "HOLD your breath for 7 seconds... 1... 2... 3... 4... 5... 6... 7...",
      "Now breathe OUT slowly through your mouth for 8 seconds... 1... 2... 3... 4... 5... 6... 7... 8...",
      "Beautiful. Let's do that again. Breathe IN for 4...",
      "HOLD for 7...",
      "And OUT for 8...",
      "One more round. You're doing great.",
      "Notice how your body feels now. What do you observe?"
    ]
  },
  grounding_54321: {
    name: "5-4-3-2-1 Grounding",
    script: [
      "Let's do a grounding exercise. This will anchor you to the present moment.",
      "Name 5 things you can SEE around you right now.",
      "Good. Now, 4 things you can TOUCH or feel.",
      "3 things you can HEAR in this moment.",
      "2 things you can SMELL (or imagine smelling).",
      "And 1 thing you can TASTE.",
      "Take a deep breath. You are here. You are safe. You are grounded."
    ]
  },
  bodyScan: {
    name: "Body Scan",
    script: [
      "Let's do a quick body scan. Close your eyes if comfortable.",
      "Starting at the top of your head... notice any tension there. Let it go.",
      "Move down to your forehead, your eyes, your jaw. Soften them.",
      "Notice your shoulders. They often hold stress. Let them drop.",
      "Scan down your arms to your hands. Unclench if needed.",
      "Feel your chest and belly. Notice your breath moving there.",
      "Continue to your hips, your legs, your feet.",
      "Now feel your whole body as one. You are safe. You are present."
    ]
  }
};

export default function BotPage() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hello. I'm MindshiftR—your AI companion for mental wellness. I'm here to listen, support, and guide you. How are you feeling right now?",
      style: 'empathetic'
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState('advice');
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [suggestedTools, setSuggestedTools] = useState([]);
  const [exerciseStep, setExerciseStep] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);

  // Reinforcement Learning State
  const [weights, setWeights] = useState({ empathetic: 1.0, direct: 1.0, socratic: 1.0, mindfulness: 1.0 });
  const [lastUsedStyle, setLastUsedStyle] = useState(null);

  // Vitals & Session State
  const [userVitals, setUserVitals] = useState(null);
  const [userId] = useState(() => `user_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`);
  const [sessionInfo, setSessionInfo] = useState({ turnCount: 0, topics: [] });

  const messagesEndRef = useRef(null);

  // Load weights and vitals from localStorage on mount
  useEffect(() => {
    const progress = UserProgressService.getProgress();
    if (progress.weights) {
      setWeights(progress.weights);
    }

    // Load latest vitals if available
    const vitalsHistory = VitalsService.getVitalsHistory();
    if (vitalsHistory.length > 0) {
      const latestVitals = vitalsHistory[vitalsHistory.length - 1];
      setUserVitals(latestVitals);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle feedback for RL
  const handleFeedback = (isPositive) => {
    if (!lastUsedStyle) return;

    const delta = isPositive ? 0.2 : -0.2;
    const newWeights = UserProgressService.updateWeights(lastUsedStyle, delta);
    setWeights(newWeights);

    // Visual feedback
    const feedbackEl = document.getElementById('feedback-toast');
    if (feedbackEl) {
      feedbackEl.textContent = isPositive ? "Thanks! I'll remember that." : "I'll adjust my approach.";
      feedbackEl.classList.add('show');
      setTimeout(() => feedbackEl.classList.remove('show'), 2000);
    }
  };

  // Guided exercise handler
  const runGuidedExercise = async (exercise) => {
    setCurrentExercise(exercise);
    setExerciseStep(0);

    for (let i = 0; i < exercise.script.length; i++) {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMessages(prev => [...prev, {
        role: 'bot',
        content: exercise.script[i],
        isExercise: true
      }]);
      setIsTyping(false);
      setExerciseStep(i + 1);

      await new Promise(resolve => setTimeout(resolve, 4000)); // Pause between steps
    }

    setCurrentExercise(null);
    setExerciseStep(null);
  };

  const handleSend = async (e, textOverride = null) => {
    if (e && e.preventDefault) e.preventDefault();

    const text = textOverride || input;
    if (!text.trim() || isTyping) return;

    // Crisis check
    if (CrisisService.checkForCrisis(text)) {
      setMessages(prev => [...prev, { role: 'user', content: text }]);
      setInput("");
      setIsTyping(true);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: "I'm really concerned about what you've shared. You matter, and what you're feeling right now is temporary. Please reach out to a crisis helpline: call or text 988 (Suicide & Crisis Lifeline). You don't have to face this alone. Would you like me to show you more crisis resources?",
          isCrisis: true,
          style: 'empathetic'
        }]);
        setSuggestedTools(['/crisis']);
        setIsTyping(false);
      }, 1500);
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput("");
    setIsTyping(true);

    // Mode-specific handling
    if (mode === 'vent') {
      // Vent mode - just listen
      setTimeout(() => {
        const response = VENT_RESPONSES[Math.floor(Math.random() * VENT_RESPONSES.length)];
        setMessages(prev => [...prev, { role: 'bot', content: response, style: 'empathetic' }]);
        setIsTyping(false);
      }, 1500);

    } else if (mode === 'mindfulness') {
      // Mindfulness mode - check for exercise triggers
      const lowerText = text.toLowerCase();

      if (lowerText.includes('breathing') || lowerText.includes('breathe')) {
        setIsTyping(false);
        runGuidedExercise(MINDFULNESS_EXERCISES.breathing_478);
      } else if (lowerText.includes('ground') || lowerText.includes('5-4-3-2-1') || lowerText.includes('54321')) {
        setIsTyping(false);
        runGuidedExercise(MINDFULNESS_EXERCISES.grounding_54321);
      } else if (lowerText.includes('body scan') || lowerText.includes('body')) {
        setIsTyping(false);
        runGuidedExercise(MINDFULNESS_EXERCISES.bodyScan);
      } else {
        // Default mindfulness response
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'bot',
            content: "Let's bring awareness to the present moment. I can guide you through: 4-7-8 Breathing, the 5-4-3-2-1 Grounding exercise, or a Body Scan. Which feels right for you?",
            style: 'mindfulness'
          }]);
          setIsTyping(false);
        }, 1000);
      }

    } else if (mode === 'cbt') {
      // CBT mode - structured cognitive exercises
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            weights: { ...weights, socratic: weights.socratic + 0.5 }, // Bias toward Socratic for CBT
            mode: 'cbt'
          })
        });
        const data = await res.json();

        // Add CBT-specific framing
        let response = data.response;
        if (!response.includes("?")) {
          response += " What thoughts came up when that happened?";
        }

        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'bot',
            content: response,
            style: data.usedStyle || 'socratic',
            techniques: data.techniques,
            interventions: data.interventions,
            technique: 'CBT'
          }]);
          if (data.suggestedActions) setSuggestedTools(data.suggestedActions.map(t => t.tool || t.path || t));
          if (data.therapeuticStyle) setLastUsedStyle(data.therapeuticStyle);
          setIsTyping(false);
        }, 1500);

      } catch (err) {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          role: 'bot',
          content: "I'm having trouble connecting. Let's try a simpler approach: What thought is bothering you most right now?"
        }]);
      }

    } else {
      // Advice mode - full AI response with vitals awareness
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            weights,
            mode: 'advice',
            userId,
            vitals: userVitals // Pass vitals for context-aware responses
          })
        });
        const data = await res.json();

        if (data.therapeuticStyle) setLastUsedStyle(data.therapeuticStyle);
        if (data.suggestedActions?.length > 0) {
          setSuggestedTools(data.suggestedActions.map(t => t.tool || t.path || t));
        }
        if (data.sessionInfo) setSessionInfo(data.sessionInfo);

        const delay = Math.min(Math.max(data.response.length * 15, 1000), 3000);

        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'bot',
            content: data.response,
            sentiment: data.sentiment,
            emotions: data.emotions,
            style: data.therapeuticStyle,
            techniques: data.techniques,
            interventions: data.interventions,
            followUp: data.followUp,
            educationalContent: data.educationalContent,
            isCrisis: data.isCrisis || false
          }]);
          setIsTyping(false);
        }, delay);

      } catch (err) {
        console.error('Chat error:', err);
        setIsTyping(false);
        setMessages(prev => [...prev, {
          role: 'bot',
          content: "I'm having trouble connecting right now. Please try again in a moment."
        }]);
      }
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'advice': return '#38bdf8';
      case 'cbt': return '#a78bfa';
      case 'mindfulness': return '#34d399';
      case 'vent': return '#f472b6';
      default: return '#38bdf8';
    }
  };

  const currentQuickReplies = QUICK_REPLIES[mode] || QUICK_REPLIES.advice;

  return (
    <main className="chat-layout">
      <PremiumBackground />

      {/* Feedback Toast */}
      <div id="feedback-toast" className="feedback-toast"></div>

      {/* Header */}
      <div className="chat-header">
        <Link href="/dashboard" className="back-btn">
          <div className="icon-circle">←</div>
        </Link>
        <div className="bot-info">
          <h2 className="bot-title">MindshiftR AI</h2>
          <div className="status-row">
            <span className="status-dot" style={{ background: getModeColor(), boxShadow: `0 0 8px ${getModeColor()}` }}></span>
            <span className="status-text">{MODES.find(m => m.id === mode)?.description}</span>
          </div>
        </div>
        <button className="mode-toggle-btn" onClick={() => setShowModeSelector(!showModeSelector)}>
          ⚙️
        </button>
      </div>

      {/* Mode Selector */}
      {showModeSelector && (
        <div className="mode-selector-overlay" onClick={() => setShowModeSelector(false)}>
          <div className="mode-selector-panel" onClick={e => e.stopPropagation()}>
            <h3>Choose Therapy Mode</h3>
            <div className="mode-options">
              {MODES.map(m => (
                <button
                  key={m.id}
                  className={`mode-option ${mode === m.id ? 'active' : ''}`}
                  onClick={() => { setMode(m.id); setShowModeSelector(false); }}
                >
                  <span className="mode-label">{m.label}</span>
                  <span className="mode-desc">{m.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.role}`}>
            {msg.role === 'bot' && (
              <div className="avatar-small">
                <div className="avatar-inner" style={{ background: getModeColor() }}>M</div>
              </div>
            )}
            <div className={`message-bubble ${msg.role} ${msg.isCrisis ? 'crisis' : ''} ${msg.isExercise ? 'exercise' : ''}`}>
              {msg.content}
              {msg.technique && (
                <span className="technique-badge">{msg.technique}</span>
              )}
              {msg.techniques && msg.techniques.length > 0 && (
                <div className="techniques-list">
                  {msg.techniques.map((tech, i) => (
                    <span key={i} className="technique-chip">{tech}</span>
                  ))}
                </div>
              )}
              {msg.emotions && msg.emotions.length > 0 && (
                <div className="emotions-detected">
                  <span className="emotions-label">Detected: </span>
                  {msg.emotions.map((emotion, i) => (
                    <span key={i} className="emotion-chip">{emotion.emotion}</span>
                  ))}
                </div>
              )}
              {msg.educationalContent && (
                <div className="educational-content">
                  <div className="edu-title">{msg.educationalContent.title}</div>
                  <div className="edu-desc">{msg.educationalContent.content}</div>
                </div>
              )}
              {/* Feedback for last bot message in advice mode */}
              {msg.role === 'bot' && mode === 'advice' && idx === messages.length - 1 && !msg.isCrisis && (
                <div className="feedback-controls">
                  <button onClick={() => handleFeedback(true)} title="Helpful">👍</button>
                  <button onClick={() => handleFeedback(false)} title="Not Helpful">👎</button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-wrapper bot">
            <div className="avatar-small">
              <div className="avatar-inner" style={{ background: getModeColor() }}>M</div>
            </div>
            <div className="message-bubble bot typing-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Tools */}
      {suggestedTools.length > 0 && (
        <div className="suggested-tools">
          <span className="tools-label">Recommended:</span>
          {suggestedTools.map((tool, i) => (
            <Link key={i} href={tool} className="tool-chip">
              {tool.replace('/', '').replace('/tasks', '')}
            </Link>
          ))}
        </div>
      )}

      {/* Quick Replies */}
      {!isTyping && !currentExercise && (
        <div className="quick-replies">
          {currentQuickReplies.map((reply, i) => (
            <button key={i} onClick={() => handleSend(null, reply)} className="chip">
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="input-area">
        <form onSubmit={handleSend} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'vent' ? "Speak freely... I'm just listening." : "Message MindshiftR..."}
            className="chat-input"
            disabled={isTyping || currentExercise}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!input.trim() || isTyping}
            style={{ background: getModeColor() }}
          >
            ➤
          </button>
        </form>
      </div>

      <style jsx>{`
                .chat-layout {
                    height: 100vh;
                    padding-top: 0;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                }

                .chat-header {
                    z-index: 50;
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: rgba(15, 23, 42, 0.95);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    backdrop-filter: blur(20px);
                }

                .icon-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.2rem;
                    transition: all 0.2s;
                }
                .icon-circle:hover { background: rgba(255,255,255,0.2); }

                .bot-info { flex: 1; }
                .bot-title { font-size: 1.1rem; margin: 0; color: #fff; font-weight: 700; }
                .status-row { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.2rem; }
                .status-dot { width: 8px; height: 8px; border-radius: 50%; }
                .status-text { font-size: 0.75rem; color: #94a3b8; }

                .mode-toggle-btn {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    padding: 0.6rem;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 1.2rem;
                }

                .mode-selector-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }

                .mode-selector-panel {
                    background: rgba(15, 23, 42, 0.98);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px;
                    padding: 2rem;
                    max-width: 400px;
                    width: 100%;
                }

                .mode-selector-panel h3 {
                    color: #fff;
                    margin: 0 0 1.5rem;
                    text-align: center;
                }

                .mode-options {
                    display: grid;
                    gap: 0.8rem;
                }

                .mode-option {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.3rem;
                    padding: 1rem 1.2rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }

                .mode-option:hover {
                    background: rgba(255,255,255,0.1);
                    transform: translateX(4px);
                }

                .mode-option.active {
                    background: rgba(56, 189, 248, 0.2);
                    border-color: rgba(56, 189, 248, 0.5);
                }

                .mode-label { font-size: 1rem; font-weight: 600; color: #fff; }
                .mode-desc { font-size: 0.75rem; color: #94a3b8; }

                .messages-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    z-index: 5;
                }

                .message-wrapper {
                    display: flex;
                    gap: 10px;
                    max-width: 85%;
                }

                .message-wrapper.user {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }

                .avatar-small {
                    width: 32px;
                    height: 32px;
                    flex-shrink: 0;
                }

                .avatar-inner {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    color: #020617;
                    font-size: 0.8rem;
                }

                .message-bubble {
                    padding: 12px 18px;
                    border-radius: 18px;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    color: #e2e8f0;
                    position: relative;
                }

                .message-bubble.bot {
                    background: rgba(30, 41, 59, 0.9);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-top-left-radius: 4px;
                }

                .message-bubble.user {
                    background: var(--primary);
                    color: white;
                    border-bottom-right-radius: 4px;
                    box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
                }

                .message-bubble.crisis {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: rgba(239, 68, 68, 0.4);
                }

                .message-bubble.exercise {
                    background: rgba(52, 211, 153, 0.15);
                    border-color: rgba(52, 211, 153, 0.3);
                }

                .technique-badge {
                    display: inline-block;
                    font-size: 0.65rem;
                    background: rgba(255,255,255,0.1);
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                    margin-left: 0.5rem;
                    color: #94a3b8;
                    text-transform: uppercase;
                }

                .techniques-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.3rem;
                    margin-top: 0.5rem;
                }

                .technique-chip {
                    font-size: 0.6rem;
                    background: rgba(56, 189, 248, 0.2);
                    color: #7dd3fc;
                    padding: 0.2rem 0.4rem;
                    border-radius: 8px;
                    border: 1px solid rgba(56, 189, 248, 0.3);
                }

                .emotions-detected {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    margin-top: 0.5rem;
                    flex-wrap: wrap;
                }

                .emotions-label {
                    font-size: 0.65rem;
                    color: #94a3b8;
                }

                .emotion-chip {
                    font-size: 0.6rem;
                    background: rgba(167, 139, 250, 0.2);
                    color: #c4b5fd;
                    padding: 0.2rem 0.4rem;
                    border-radius: 8px;
                    border: 1px solid rgba(167, 139, 250, 0.3);
                }

                .educational-content {
                    margin-top: 0.8rem;
                    padding: 0.8rem;
                    background: rgba(52, 211, 153, 0.1);
                    border: 1px solid rgba(52, 211, 153, 0.2);
                    border-radius: 8px;
                }

                .edu-title {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #34d399;
                    margin-bottom: 0.3rem;
                }

                .edu-desc {
                    font-size: 0.7rem;
                    color: #94a3b8;
                    line-height: 1.4;
                }

                .feedback-controls {
                    display: flex;
                    gap: 8px;
                    margin-top: 10px;
                    justify-content: flex-end;
                    opacity: 0.6;
                    transition: opacity 0.2s;
                }

                .feedback-controls:hover { opacity: 1; }

                .feedback-controls button {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    padding: 4px 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }

                .feedback-controls button:hover {
                    background: rgba(255,255,255,0.2);
                    transform: scale(1.1);
                }

                .typing-bubble {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 15px 20px;
                }

                .dot {
                    width: 6px;
                    height: 6px;
                    background: #94a3b8;
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out both;
                }

                .dot:nth-child(1) { animation-delay: -0.32s; }
                .dot:nth-child(2) { animation-delay: -0.16s; }

                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }

                .suggested-tools {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    padding: 0.5rem 1.5rem;
                    z-index: 10;
                }

                .tools-label {
                    font-size: 0.75rem;
                    color: #64748b;
                }

                .tool-chip {
                    padding: 0.4rem 0.8rem;
                    background: rgba(56, 189, 248, 0.15);
                    border: 1px solid rgba(56, 189, 248, 0.3);
                    border-radius: 20px;
                    font-size: 0.75rem;
                    color: #7dd3fc;
                    text-decoration: none;
                    transition: all 0.2s;
                }

                .tool-chip:hover {
                    background: rgba(56, 189, 248, 0.25);
                }

                .quick-replies {
                    display: flex;
                    gap: 0.6rem;
                    padding: 0.5rem 1.5rem;
                    overflow-x: auto;
                    z-index: 10;
                    scrollbar-width: none;
                }

                .chip {
                    white-space: nowrap;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #cbd5e1;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.85rem;
                }

                .chip:hover {
                    background: rgba(56, 189, 248, 0.15);
                    border-color: rgba(56, 189, 248, 0.4);
                    color: white;
                }

                .input-area {
                    z-index: 10;
                    padding: 1rem 1.5rem 1.5rem;
                    background: rgba(15, 23, 42, 0.95);
                    backdrop-filter: blur(20px);
                }

                .input-form {
                    display: flex;
                    gap: 0.8rem;
                    background: rgba(30, 41, 59, 0.6);
                    padding: 6px;
                    padding-left: 20px;
                    border-radius: 30px;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .chat-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 1rem;
                }

                .chat-input:focus { outline: none; }
                .chat-input::placeholder { color: #64748b; }
                .chat-input:disabled { opacity: 0.5; }

                .send-btn {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    border: none;
                    color: #020617;
                    cursor: pointer;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    font-weight: bold;
                }

                .send-btn:hover:not(:disabled) { transform: scale(1.08); }
                .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

                .feedback-toast {
                    position: fixed;
                    bottom: 100px;
                    left: 50%;
                    transform: translateX(-50%) translateY(100px);
                    background: rgba(30, 41, 59, 0.95);
                    color: #e2e8f0;
                    padding: 0.8rem 1.5rem;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    opacity: 0;
                    transition: all 0.3s;
                    z-index: 200;
                }

                .feedback-toast.show {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            `}</style>
    </main>
  );
}
