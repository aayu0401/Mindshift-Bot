'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Brain,
  Heart,
  Activity,
  Shield,
  Sparkles,
  Zap,
  Globe,
  Accessibility,
  Settings,
  Maximize2,
  Minimize2,
  AlertTriangle,
  TrendingUp,
  Clock,
  Star,
  Target,
  Lightbulb,
  Compass,
  Users,
  BookOpen,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SimpleChatClient() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [selectedMode, setSelectedMode] = useState('adaptive');
  const [sessionMetrics, setSessionMetrics] = useState({
    duration: 0,
    messageCount: 0,
    techniquesUsed: [],
    emotionalJourney: [],
    crisisInterventions: 0
  });
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    sentiment: 0,
    stress: 0,
    engagement: 0,
    progress: 0
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionStartTime = useRef(Date.now());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionMetrics(prev => ({
        ...prev,
        duration: Math.floor((Date.now() - sessionStartTime.current) / 1000)
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`
        },
        body: JSON.stringify({
          message: input,
          sessionId: 'enhanced-session',
          context: {
            userId: 'demo-user',
            userProfile: {
              preferences: {
                communicationStyle: selectedMode
              }
            }
          }
        })
      });

      const data = await response.json();

      if (data.isCrisis) {
        setSessionMetrics(prev => ({
          ...prev,
          crisisInterventions: prev.crisisInterventions + 1
        }));
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        metadata: {
          therapeuticStyle: data.therapeuticStyle,
          techniques: data.techniques || [],
          emotions: data.emotions || [],
          sentiment: data.sentiment,
          isCrisis: data.isCrisis,
          confidence: data.confidence,
          processingTime: data.processingTime
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update metrics
      setSessionMetrics(prev => ({
        ...prev,
        messageCount: prev.messageCount + 1,
        techniquesUsed: [...new Set([...prev.techniquesUsed, ...(data.techniques || [])])],
        emotionalJourney: [...prev.emotionalJourney, data.sentiment?.classification || 'neutral']
      }));

      setRealTimeMetrics(prev => ({
        ...prev,
        sentiment: data.sentiment?.score || prev.sentiment,
        engagement: data.techniques?.length > 0 ? prev.engagement + 0.2 : prev.engagement,
        progress: prev.messageCount > 0 ? prev.progress + 0.1 : prev.progress
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'I apologize, but I\'m having trouble processing your message right now. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.3) return 'text-green-500';
    if (sentiment < -0.3) return 'text-red-500';
    return 'text-yellow-500';
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-lg border-r border-white/20 p-6 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            MindshiftR AI
          </h2>
          <p className="text-sm text-gray-600">Enhanced Mental Health Companion</p>
        </div>

        {/* Session Metrics */}
        <div className="mb-8 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Session Metrics
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{formatTime(sessionMetrics.duration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Messages:</span>
              <span className="font-medium">{sessionMetrics.messageCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Techniques:</span>
              <span className="font-medium">{sessionMetrics.techniquesUsed.length}</span>
            </div>
            {sessionMetrics.crisisInterventions > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Crisis Interventions:</span>
                <span className="font-medium">{sessionMetrics.crisisInterventions}</span>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="mb-8 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Real-time Analysis
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Sentiment</span>
                <span className={`font-medium ${getSentimentColor(realTimeMetrics.sentiment)}`}>
                  {realTimeMetrics.sentiment > 0.3 ? 'Positive' : realTimeMetrics.sentiment < -0.3 ? 'Negative' : 'Neutral'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    realTimeMetrics.sentiment > 0.3 ? 'bg-green-500' : 
                    realTimeMetrics.sentiment < -0.3 ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.abs(realTimeMetrics.sentiment) * 100}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Engagement</span>
                <span className="font-medium text-blue-600">
                  {Math.round(realTimeMetrics.engagement * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${realTimeMetrics.engagement * 100}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-purple-600">
                  {Math.round(realTimeMetrics.progress * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${realTimeMetrics.progress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Therapeutic Mode Selection */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            Therapeutic Mode
          </h3>
          <div className="space-y-2">
            {[
              { id: 'adaptive', name: 'Adaptive', icon: Brain, description: 'AI adapts to your needs' },
              { id: 'empathetic', name: 'Empathetic', icon: Heart, description: 'Warm and supportive' },
              { id: 'direct', name: 'Direct', icon: Target, description: 'Clear and focused' },
              { id: 'mindfulness', name: 'Mindfulness', icon: Sparkles, description: 'Present-focused' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  selectedMode === mode.id 
                    ? 'bg-purple-100 border-2 border-purple-300' 
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <mode.icon className="w-4 h-4 mr-2 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-800">{mode.name}</div>
                    <div className="text-xs text-gray-600">{mode.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            AI Capabilities
          </h3>
          <div className="space-y-2">
            {[
              { key: 'crisisDetection', label: 'Crisis Detection', enabled: true },
              { key: 'emotionAnalysis', label: 'Emotion Analysis', enabled: true },
              { key: 'techniqueRecommendation', label: 'Technique Recommendation', enabled: true },
              { key: 'realTimeProcessing', label: 'Real-time Processing', enabled: true }
            ].map(capability => (
              <div key={capability.key} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{capability.label}</span>
                <div className={`w-2 h-2 rounded-full ${capability.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <MessageCircle className="w-6 h-6 text-purple-600 mr-2" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Enhanced Chat</h1>
                  <p className="text-sm text-gray-600">AI-Powered Mental Health Support</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-2 rounded-lg transition-all ${
                  isVoiceEnabled ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                }`}
                title={isVoiceEnabled ? 'Disable Voice' : 'Enable Voice'}
              >
                {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-2 rounded-lg transition-all ${
                  isFullscreen ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-2xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : message.type === 'error'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg'
                  }`}
                >
                  <p className={`${message.type === 'user' ? 'text-white' : 'text-gray-800'} mb-2`}>
                    {message.content}
                  </p>
                  
                  {/* Enhanced AI Response Features */}
                  {message.type === 'ai' && message.metadata && (
                    <div className="mt-3 space-y-2">
                      {/* Therapeutic Style & Techniques */}
                      {(message.metadata.therapeuticStyle || (message.metadata.techniques && message.metadata.techniques.length > 0)) && (
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Brain className="w-3 h-3" />
                          <span className="capitalize">{message.metadata.therapeuticStyle}</span>
                          {message.metadata.techniques && (
                            <span>• {message.metadata.techniques.length} techniques</span>
                          )}
                        </div>
                      )}
                      
                      {/* Emotions Detected */}
                      {message.metadata.emotions && message.metadata.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {message.metadata.emotions.map((emotion, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                            >
                              {emotion.emotion} ({Math.round(emotion.intensity * 100)}%)
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Crisis Alert */}
                      {message.metadata.isCrisis && (
                        <div className="p-3 bg-red-100 border border-red-300 rounded-lg flex items-center">
                          <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                          <div>
                            <div className="font-medium text-red-800">🚨 Crisis Intervention Active</div>
                            <div className="text-sm text-red-600">
                              Support resources have been provided
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Confidence Score */}
                      {message.metadata.confidence && (
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Confidence</span>
                          <div className="flex items-center">
                            <div className="w-20 bg-gray-200 rounded-full h-1.5 mr-2">
                              <div 
                                className="bg-green-500 h-1.5 rounded-full"
                                style={{ width: `${message.metadata.confidence * 100}%` }}
                              />
                            </div>
                            <span>{Math.round(message.metadata.confidence * 100)}%</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Processing Time */}
                      {message.metadata.processingTime && (
                        <div className="text-xs text-gray-500">
                          Processing time: {message.metadata.processingTime}ms
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-lg border-t border-white/20 p-4">
          <div className="flex items-center space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Share what's on your mind..."
              className="flex-1 px-4 py-3 bg-white/50 border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isTyping}
            />
            
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send Message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors">
                Breathing Exercise
              </button>
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors">
                Grounding
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors">
                Journal
              </button>
            </div>
            
            <div className="text-xs text-gray-500">
              {sessionMetrics.messageCount} messages • {formatTime(sessionMetrics.duration)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
