'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Phone,
  Video,
  MoreVertical,
  Check,
  AlertTriangle,
  TrendingUp,
  Clock,
  Star,
  Award,
  Target,
  Lightbulb,
  Compass,
  Users,
  BookOpen,
  Music,
  Palette,
  Eye,
  EyeOff
} from 'lucide-react';

export default function EnhancedChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedMode, setSelectedMode] = useState('adaptive');
  const [culturalContext, setCulturalContext] = useState('western');
  const [language, setLanguage] = useState('en');
  const [accessibilityMode, setAccessibilityMode] = useState('standard');
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
  const [aiCapabilities, setAiCapabilities] = useState({
    multiModal: true,
    culturalAdaptation: true,
    voiceIntegration: true,
    realTimeAnalysis: true,
    predictiveInsights: true,
    crisisDetection: true
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionStartTime = useRef(Date.now());
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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

  useEffect(() => {
    if (isVoiceEnabled && typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'es' ? 'es-ES' : 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isVoiceEnabled, language]);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
      metadata: {
        mode: selectedMode,
        culturalContext,
        language,
        accessibilityMode
      }
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
          message: messageText,
          sessionId: 'enhanced-session',
          context: {
            userId: 'demo-user',
            userProfile: {
              preferences: {
                communicationStyle: selectedMode,
                culturalContext,
                language,
                accessibilityMode
              }
            },
            realTimeMetrics,
            sessionMetrics,
            capabilities: aiCapabilities
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
          tone: data.tone,
          techniques: data.techniques || [],
          interventions: data.interventions || [],
          emotions: data.emotions || [],
          sentiment: data.sentiment,
          severity: data.severity,
          educationalContent: data.educationalContent,
          suggestedActions: data.suggestedActions || [],
          isCrisis: data.isCrisis,
          confidence: data.confidence,
          processingTime: data.processingTime,
          voice: data.voice,
          visual: data.visual,
          interactive: data.interactive,
          adaptive: data.adaptive,
          cultural: data.cultural,
          accessibility: data.accessibility,
          conversationFlow: data.conversationFlow,
          emotionalPatterns: data.emotionalPatterns,
          clinicalValidation: data.clinicalValidation
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update session metrics
      setSessionMetrics(prev => ({
        ...prev,
        messageCount: prev.messageCount + 1,
        techniquesUsed: [...new Set([...prev.techniquesUsed, ...(data.techniques || [])])],
        emotionalJourney: [...prev.emotionalJourney, data.sentiment?.classification || 'neutral']
      }));

      // Update real-time metrics
      setRealTimeMetrics(prev => ({
        ...prev,
        sentiment: data.sentiment?.score || prev.sentiment,
        stress: calculateStressLevel(data.emotions || []),
        engagement: calculateEngagement(data),
        progress: calculateProgress(data, sessionMetrics)
      }));

      // Voice response if enabled
      if (isVoiceEnabled && data.voice?.enabled) {
        speakResponse(data.response);
      }

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

  const handleVoiceToggle = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const calculateStressLevel = (emotions) => {
    const stressEmotions = emotions.filter(e => 
      ['anxiety', 'fear', 'anger', 'overwhelm'].includes(e.emotion)
    );
    return stressEmotions.length > 0 ? 
      stressEmotions.reduce((sum, e) => sum + e.intensity, 0) / stressEmotions.length : 0;
  };

  const calculateEngagement = (response) => {
    let score = 0.5;
    if (response.techniques?.length > 0) score += 0.2;
    if (response.interactive?.enabled) score += 0.2;
    if (response.educationalContent) score += 0.1;
    return Math.min(score, 1.0);
  };

  const calculateProgress = (response, metrics) => {
    const baseProgress = metrics.messageCount > 0 ? 0.3 : 0;
    const techniqueProgress = metrics.techniquesUsed.length > 0 ? 0.3 : 0;
    const emotionalProgress = metrics.emotionalJourney.length > 1 ? 0.2 : 0;
    const insightProgress = response.educationalContent ? 0.2 : 0;
    return Math.min(baseProgress + techniqueProgress + emotionalProgress + insightProgress, 1.0);
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

  const getSeverityColor = (severity) => {
    if (severity > 7) return 'bg-red-500';
    if (severity > 5) return 'bg-orange-500';
    if (severity > 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const therapeuticModes = [
    { id: 'adaptive', name: 'Adaptive', icon: Brain, description: 'AI adapts to your needs' },
    { id: 'empathetic', name: 'Empathetic', icon: Heart, description: 'Warm and supportive' },
    { id: 'direct', name: 'Direct', icon: Target, description: 'Clear and focused' },
    { id: 'mindfulness', name: 'Mindfulness', icon: Sparkles, description: 'Present-focused' },
    { id: 'socratic', name: 'Socratic', icon: Lightbulb, description: 'Question-based' }
  ];

  const culturalContexts = [
    { id: 'western', name: 'Western', icon: Globe },
    { id: 'eastern', name: 'Eastern', icon: Compass },
    { id: 'latino', name: 'Latino', icon: Users },
    { id: 'african', name: 'African', icon: Activity }
  ];

  const languages = [
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'fr', name: 'Français', flag: '🇫🇷' },
    { id: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const accessibilityModes = [
    { id: 'standard', name: 'Standard', icon: Eye },
    { id: 'high-contrast', name: 'High Contrast', icon: EyeOff },
    { id: 'large-text', name: 'Large Text', icon: Maximize2 },
    { id: 'screen-reader', name: 'Screen Reader', icon: Volume2 }
  ];

  return (
    <div className={`flex h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-lg border-r border-white/20 p-6 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            MindshiftR AI
          </h2>
          <p className="text-sm text-gray-600">Advanced Mental Health Companion</p>
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
                <span className="text-gray-600">Stress Level</span>
                <span className="font-medium text-orange-600">
                  {Math.round(realTimeMetrics.stress * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${realTimeMetrics.stress * 100}%` }}
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
            {therapeuticModes.map(mode => (
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

        {/* Cultural Context */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Cultural Context
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {culturalContexts.map(context => (
              <button
                key={context.id}
                onClick={() => setCulturalContext(context.id)}
                className={`p-2 rounded-lg text-sm transition-all ${
                  culturalContext === context.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <context.icon className="w-4 h-4 mx-auto mb-1" />
                {context.name}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Language
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {languages.map(lang => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`p-2 rounded-lg text-sm transition-all ${
                  language === lang.id 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg mr-1">{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility Options */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Accessibility className="w-4 h-4 mr-2" />
            Accessibility
          </h3>
          <div className="space-y-2">
            {accessibilityModes.map(mode => (
              <button
                key={mode.id}
                onClick={() => setAccessibilityMode(mode.id)}
                className={`w-full p-2 rounded-lg text-sm transition-all ${
                  accessibilityMode === mode.id 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <mode.icon className="w-4 h-4 inline mr-2" />
                {mode.name}
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
            {Object.entries(aiCapabilities).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
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
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`p-2 rounded-lg transition-all ${
                  showAdvanced ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}
                title="Toggle Advanced Features"
              >
                <Settings className="w-5 h-5" />
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
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
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
                        {/* Therapeutic Style & Tone */}
                        {(message.metadata.therapeuticStyle || message.metadata.tone) && (
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <Brain className="w-3 h-3" />
                            <span className="capitalize">{message.metadata.therapeuticStyle}</span>
                            {message.metadata.tone && (
                              <span>• {message.metadata.tone}</span>
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
                        
                        {/* Techniques Used */}
                        {message.metadata.techniques && message.metadata.techniques.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {message.metadata.techniques.map((technique, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                              >
                                {technique.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Interventions */}
                        {message.metadata.interventions && message.metadata.interventions.length > 0 && (
                          <div className="space-y-1">
                            {message.metadata.interventions.map((intervention, idx) => (
                              <div key={idx} className="p-2 bg-green-50 border border-green-200 rounded-lg">
                                <div className="text-sm font-medium text-green-800">
                                  {intervention.title}
                                </div>
                                {intervention.content && (
                                  <div className="text-xs text-green-600 mt-1">
                                    {intervention.content}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Educational Content */}
                        {message.metadata.educationalContent && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center mb-2">
                              <BookOpen className="w-4 h-4 text-yellow-600 mr-2" />
                              <span className="font-medium text-yellow-800">
                                {message.metadata.educationalContent.title}
                              </span>
                            </div>
                            <p className="text-sm text-yellow-700">
                              {message.metadata.educationalContent.content}
                            </p>
                          </div>
                        )}
                        
                        {/* Suggested Actions */}
                        {message.metadata.suggestedActions && message.metadata.suggestedActions.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {message.metadata.suggestedActions.map((action, idx) => (
                              <button
                                key={idx}
                                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs hover:bg-indigo-200 transition-colors"
                              >
                                {action.tool.replace('/', '')}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {/* Crisis Alert */}
                        {message.metadata.isCrisis && (
                          <div className="p-3 bg-red-100 border border-red-300 rounded-lg flex items-center">
                            <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                            <div>
                              <div className="font-medium text-red-800">Crisis Intervention Active</div>
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
                        
                        {/* Multi-modal Indicators */}
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          {message.metadata.voice?.enabled && (
                            <div className="flex items-center">
                              <Volume2 className="w-3 h-3 mr-1" />
                              Voice
                            </div>
                          )}
                          {message.metadata.visual?.enabled && (
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              Visual
                            </div>
                          )}
                          {message.metadata.interactive?.enabled && (
                            <div className="flex items-center">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Interactive
                            </div>
                          )}
                          {message.metadata.adaptive?.enabled && (
                            <div className="flex items-center">
                              <Brain className="w-3 h-3 mr-1" />
                              Adaptive
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-lg border-t border-white/20 p-4">
          <div className="flex items-center space-x-3">
            {isVoiceEnabled && (
              <button
                onClick={handleVoiceToggle}
                className={`p-3 rounded-full transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
                title={isRecording ? 'Stop Recording' : 'Start Voice Input'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
            
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
              <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs hover:bg-yellow-200 transition-colors">
                Resources
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
