/**
 * ============================================
 * MINDSHIFTR - CLIENT SERVICES LAYER
 * Unified API interface for all services
 * ============================================
 */

const API_BASE = '/api';

// ============================================
// CHAT SERVICE
// ============================================
export const ChatService = {
    async sendMessage(message, options = {}) {
        const { weights, mode = 'advice', conversationHistory = [], userId = 'anonymous', vitals = null } = options;

        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                weights,
                mode,
                conversationHistory,
                userId,
                vitals
            })
        });

        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
    },

    async getStatus() {
        const response = await fetch(`${API_BASE}/chat`);
        return response.json();
    }
};

// ============================================
// ANALYTICS SERVICE
// ============================================
export const AnalyticsService = {
    async logEvent(eventType, data, userId = 'anonymous') {
        try {
            const response = await fetch(`${API_BASE}/analytics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventType, data, userId })
            });
            return response.json();
        } catch (e) {
            console.error("Analytics log failed", e);
            return { error: true };
        }
    },

    async logMood(mood, intensity = 1, context = null) {
        return this.logEvent('mood_log', { mood, intensity, context });
    },

    async logSession(sessionType, duration, pointsEarned) {
        return this.logEvent('session_complete', { sessionType, duration, pointsEarned });
    },

    async updateStreak(streak) {
        return this.logEvent('streak_update', { streak });
    },

    async getSummary(period = '7d', userId = 'anonymous') {
        const response = await fetch(`${API_BASE}/analytics?period=${period}&userId=${userId}`);
        return response.json();
    }
};

// ============================================
// SCREENING SERVICE
// ============================================
export const ScreeningService = {
    async getAvailableScreenings() {
        const response = await fetch(`${API_BASE}/screening`);
        return response.json();
    },

    async getScreening(type) {
        const response = await fetch(`${API_BASE}/screening?type=${type}`);
        return response.json();
    },

    async submitScreening(type, responses, userId = 'anonymous') {
        const response = await fetch(`${API_BASE}/screening`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, responses, userId })
        });
        return response.json();
    }
};

// ============================================
// JOURNAL SERVICE
// ============================================
export const JournalService = {
    async getPrompt(category = null) {
        const url = category ? `${API_BASE}/journal?action=prompt&category=${category}` : `${API_BASE}/journal?action=prompt`;
        const response = await fetch(url);
        return response.json();
    },

    async getEntries(userId = 'anonymous', limit = 20) {
        const response = await fetch(`${API_BASE}/journal?userId=${userId}&limit=${limit}`);
        return response.json();
    },

    async createEntry(content, options = {}) {
        const { userId = 'anonymous', category, prompt, mood, tags = [] } = options;
        const response = await fetch(`${API_BASE}/journal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, userId, category, prompt, mood, tags })
        });
        return response.json();
    }
};

// ============================================
// USER PROGRESS SERVICE (Local Storage)
// ============================================
export const UserProgressService = {
    STORAGE_KEY: 'mindshiftr_progress',

    getProgress() {
        if (typeof window === 'undefined') return this.getDefaultProgress();
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) return this.getDefaultProgress();
        try {
            return { ...this.getDefaultProgress(), ...JSON.parse(stored) };
        } catch {
            return this.getDefaultProgress();
        }
    },

    getDefaultProgress() {
        return {
            points: 0,
            streak: 0,
            level: 1,
            lastActive: null,
            completedTasks: [],
            unlockedBadges: [],
            weights: { empathetic: 1.0, direct: 1.0, socratic: 1.0, mindfulness: 1.0 }
        };
    },

    saveProgress(progress) {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    },

    addPoints(amount) {
        const progress = this.getProgress();
        progress.points += amount;
        const newLevel = Math.floor(progress.points / 500) + 1;
        if (newLevel > progress.level) progress.level = newLevel;
        this.saveProgress(progress);
        return progress;
    },

    updateWeights(style, delta) {
        const progress = this.getProgress();
        if (!progress.weights) {
            progress.weights = { empathetic: 1.0, direct: 1.0, socratic: 1.0, mindfulness: 1.0 };
        }
        
        // Update the specific style weight
        if (progress.weights[style] !== undefined) {
            progress.weights[style] = Math.max(0.1, Math.min(2.0, progress.weights[style] + delta));
        }
        
        this.saveProgress(progress);
        return progress.weights;
    }
};

// ============================================
// NOTIFICATION SERVICE
// ============================================
export const NotificationService = {
    async requestPermission() {
        if (typeof window === 'undefined' || !('Notification' in window)) return false;
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    },

    sendLocal(title, options = {}) {
        if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') return null;
        return new Notification(title, { icon: '/mindshiftr-logo.png', ...options });
    },

    sendToast(title, message, type = 'info') {
        if (typeof window !== 'undefined' && window.addToast) {
            window.addToast({ title, message, type });
        } else {
            console.log(`[Toast] ${title}: ${message}`);
        }
    }
};

// ============================================
// VITALS SERVICE
// ============================================
export const VitalsService = {
    async analyzeVitals(vitals, options = {}) {
        const { userId = 'anonymous', history = [] } = options;
        const response = await fetch(`${API_BASE}/vitals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vitals, userId, history })
        });
        return response.json();
    },

    simulateWearableData() {
        return {
            hrv: Math.round(45 + Math.random() * 30),
            restingHR: Math.round(60 + Math.random() * 20),
            sleepHours: Math.round((5.5 + Math.random() * 3) * 10) / 10,
            steps: Math.round(3000 + Math.random() * 10000),
            timestamp: new Date().toISOString()
        };
    },

    getVitalsHistory() {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem('mindshiftr_vitals_history');
        try { return stored ? JSON.parse(stored) : []; } catch { return []; }
    },

    storeVitals(vitals) {
        if (typeof window === 'undefined') return;
        let history = this.getVitalsHistory();
        history.push({ ...vitals, timestamp: new Date().toISOString() });
        if (history.length > 30) history = history.slice(-30);
        localStorage.setItem('mindshiftr_vitals_history', JSON.stringify(history));
        return history;
    }
};

// ============================================
// CRISIS SERVICE
// ============================================
export const CrisisService = {
    resources: [
        { name: 'National Suicide Prevention Lifeline', phone: '988', country: 'USA' },
        { name: 'Crisis Text Line', phone: 'Text HOME to 741741', country: 'USA' }
    ],
    checkForCrisis(message) {
        const keywords = ['suicide', 'kill myself', 'end my life', 'self-harm'];
        return keywords.some(kw => message.toLowerCase().includes(kw));
    }
};

// ============================================
// COMMUNITY SERVICE
// ============================================
export const CommunityService = {
    getPosts: () => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem('mindshift_community_posts');
        return stored ? JSON.parse(stored) : [];
    },

    savePost: (post) => {
        if (typeof window === 'undefined') return;
        const posts = CommunityService.getPosts();
        const updated = [post, ...posts].slice(0, 50);
        localStorage.setItem('mindshift_community_posts', JSON.stringify(updated));
        return updated;
    },

    generateActivity: () => {
        const activities = [
            "Someone just completed Respirance Breathing 🌬️",
            "Anonymous user reached a 10-day Streak! 🔥",
            "A mindset shift was shared in CBT mode 🧠",
            "Wellness score globally increased by 2% today 📈"
        ];
        return activities[Math.floor(Math.random() * activities.length)];
    }
};

export default {
    ChatService,
    AnalyticsService,
    ScreeningService,
    JournalService,
    UserProgressService,
    NotificationService,
    VitalsService,
    CrisisService,
    CommunityService
};
