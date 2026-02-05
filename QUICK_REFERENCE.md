# MindshiftR - Quick Reference Guide

## 📂 Folder Structure & Key Files

### **Root Directory**
```
mindshiftr/
├── .env.local                    # Environment configuration
├── package.json                  # Dependencies & scripts
├── next.config.mjs              # Next.js configuration
├── jsconfig.json                # JavaScript configuration
├── docker-compose.yml           # Docker setup
├── Dockerfile                   # Container definition
└── README.md                    # Project documentation
```

---

## 🎯 Core Application Files

### **1. App Router (`app/`)**

#### **Pages (User-Facing)**
| File | Route | Purpose |
|------|-------|---------|
| `app/page.js` | `/` | Landing page |
| `app/dashboard/page.js` | `/dashboard` | Main user dashboard |
| `app/bot/page.js` | `/bot` | AI companion chat |
| `app/community/page.js` | `/community` | Real-time community feed |
| `app/vitals/page.js` | `/vitals` | Biometric data dashboard |
| `app/analytics/page.js` | `/analytics` | Progress tracking |
| `app/profile/page.js` | `/profile` | User settings |
| `app/crisis/page.js` | `/crisis` | Emergency resources |

#### **Therapeutic Tools (`app/tasks/`)**
| File | Route | Purpose |
|------|-------|---------|
| `breathing/page.js` | `/tasks/breathing` | Resonance breathing exercise |
| `grounding/page.js` | `/tasks/grounding` | 5-4-3-2-1 grounding |
| `journal/page.js` | `/tasks/journal` | Journaling interface |
| `activity/page.js` | `/tasks/activity` | Behavioral activation |

#### **Assessments (`app/screening/`)**
| File | Route | Purpose |
|------|-------|---------|
| `phq9/page.js` | `/screening/phq9` | Depression screening (PHQ-9) |
| `gad7/page.js` | `/screening/gad7` | Anxiety screening (GAD-7) |
| `pbct/page.js` | `/screening/pbct` | Burnout assessment |

---

### **2. API Routes (`app/api/`)**

#### **Backend Endpoints**
| File | Endpoint | Methods | Purpose |
|------|----------|---------|---------|
| `chat/route.js` | `/api/chat` | POST | AI companion responses |
| `journal/route.js` | `/api/journal` | GET, POST, DELETE | Journaling CRUD |
| `screening/route.js` | `/api/screening` | GET, POST | Mental health assessments |
| `vitals/route.js` | `/api/vitals` | GET, POST | Biometric data |
| `auth/login/route.js` | `/api/auth/login` | POST | User authentication |
| `auth/register/route.js` | `/api/auth/register` | POST | User registration |
| `analytics/route.js` | `/api/analytics` | GET | User progress data |

---

### **3. Components (`app/components/`)**

#### **Reusable UI Components**
| File | Purpose | Used In |
|------|---------|---------|
| `Navbar.js` | Navigation bar with auth | All pages |
| `Footer.js` | Site footer | All pages |
| `PremiumBackground.js` | Animated gradient background | Dashboard, Tasks |
| `LoadingSpinner.js` | Loading indicator | Async operations |
| `Modal.js` | Dialog/modal wrapper | Crisis, Settings |

---

### **4. Library (`lib/`)**

#### **Backend Services**
| File | Purpose | Key Functions |
|------|---------|---------------|
| `db.js` | PostgreSQL connection | `initializeDatabase()`, `query()` |
| `auth.js` | Authentication utilities | `registerUser()`, `loginUser()`, `verifyToken()` |
| `models.js` | Database models (ORM-like) | `JournalEntry`, `ChatConversation`, `ScreeningResult` |

#### **AI & Knowledge**
| File | Purpose | Key Features |
|------|---------|--------------|
| `enhancedChatEngine.js` | Main AI engine | Crisis detection, therapeutic responses |
| `enhancedKnowledgeBase.js` | Therapeutic content | CBT, DBT, ACT protocols |
| `advancedChatFeatures.js` | Multi-modal responses | Voice, visual, interactive |
| `clinicalValidation.js` | Evidence-based validation | Protocol matching, outcome tracking |
| `knowledgeBase.js` | Legacy knowledge base | Fallback responses |

#### **Client-Side Services**
| File | Purpose | Key Functions |
|------|---------|---------------|
| `services.js` | Frontend utilities | `NotificationService`, `CommunityService`, `VitalsService` |

#### **Utilities**
| File | Purpose |
|------|---------|
| `logger.js` | Logging utilities |
| `middleware.js` | API middleware |

---

## 🗄️ Database Schema Quick Reference

### **Tables**
1. **users** - User accounts & profiles
2. **user_sessions** - Active sessions
3. **journal_entries** - Personal journaling
4. **screening_results** - Mental health assessments
5. **chat_conversations** - AI chat history
6. **mood_logs** - Daily mood tracking
7. **wellness_sessions** - Exercise completion
8. **vitals_data** - Biometric data
9. **user_streaks** - Engagement tracking
10. **analytics_events** - User activity logs
11. **feedback** - User feedback on AI responses

### **Key Relationships**
```
users (1) ──→ (many) journal_entries
users (1) ──→ (many) chat_conversations
users (1) ──→ (many) screening_results
users (1) ──→ (many) vitals_data
users (1) ──→ (1) user_streaks
```

---

## 🔑 Environment Variables

### **Required**
```env
DATABASE_URL="postgresql://user:pass@host:5432/mindshiftr"
NEXTAUTH_SECRET="your-secret-key-here"
```

### **Optional (Enhanced Features)**
```env
OPENAI_API_KEY="sk-..."           # For GPT-4 integration
ANTHROPIC_API_KEY="sk-ant-..."    # For Claude integration
REDIS_URL="redis://localhost:6379" # Session caching
SENTRY_DSN="https://..."          # Error tracking
```

---

## 📦 NPM Scripts

### **Development**
```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm start                # Start production server
npm run lint             # Run ESLint
```

### **Testing**
```bash
npm test                 # Run unit tests
npm run test:integration # Run integration tests
npm run test:coverage    # Generate coverage report
```

### **Database**
```bash
npm run db:setup         # Initialize database schema
npm run db:seed          # Seed with sample data
```

### **Docker**
```bash
npm run docker:build     # Build Docker image
npm run docker:run       # Start containers
```

---

## 🚀 Quick Start Guide

### **1. Initial Setup**
```bash
# Clone repository
cd mindshiftr

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your database credentials

# Initialize database
npm run db:setup

# Start development server
npm run dev
```

### **2. Access Application**
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api/*

### **3. Test User Flow**
1. Visit `/` (landing page)
2. Click "Launch App" → `/dashboard`
3. Try AI chat → `/bot`
4. Complete breathing exercise → `/tasks/breathing`
5. Log journal entry → `/tasks/journal`
6. Take PHQ-9 assessment → `/screening/phq9`

---

## 🔍 Code Navigation Tips

### **Finding Specific Features**

#### **"Where is the crisis detection logic?"**
→ `lib/enhancedChatEngine.js` → `detectCrisis()` method

#### **"How are journal entries saved?"**
→ `app/api/journal/route.js` → `POST` handler  
→ `lib/models.js` → `JournalEntry.create()`

#### **"Where is the breathing exercise animation?"**
→ `app/tasks/breathing/page.js` → `getCircleScale()` function

#### **"How does authentication work?"**
→ `lib/auth.js` → `loginUser()`, `verifyToken()`  
→ `app/api/auth/login/route.js` → Login endpoint

#### **"Where are the therapeutic protocols?"**
→ `lib/enhancedKnowledgeBase.js` → CBT, DBT, ACT sections

---

## 🎨 Styling System

### **Global Styles**
- **File:** `app/globals.css`
- **System:** CSS-in-JS with styled-jsx
- **Theme:** Glassmorphism with dark mode

### **CSS Variables**
```css
--primary: #0ea5e9;
--primary-glow: rgba(14, 165, 233, 0.5);
--background: #020617;
--card-bg: rgba(15, 23, 42, 0.6);
```

### **Common Classes**
- `.glass-card` - Glassmorphism card
- `.btn-primary` - Primary action button
- `.animate-fade-in` - Fade in animation
- `.animate-slide-up` - Slide up animation

---

## 🐛 Common Issues & Solutions

### **Issue: Database connection error**
**Solution:**
1. Check PostgreSQL is running: `pg_isready`
2. Verify `DATABASE_URL` in `.env.local`
3. Run `npm run db:setup` to initialize schema

### **Issue: JWT token invalid**
**Solution:**
1. Check `NEXTAUTH_SECRET` is set
2. Clear browser localStorage
3. Re-login to get new token

### **Issue: Chat API not responding**
**Solution:**
1. Check `lib/enhancedChatEngine.js` is imported correctly
2. Verify database tables exist (chat_conversations)
3. Check browser console for errors

### **Issue: Breathing exercise not animating**
**Solution:**
1. Check `getCircleScale()` function in `app/tasks/breathing/page.js`
2. Verify CSS transitions are enabled
3. Check browser supports CSS transforms

---

## 📊 Performance Monitoring

### **Key Metrics to Track**
- **API Response Time:** Target < 200ms
- **Database Query Time:** Target < 50ms
- **Page Load Time:** Target < 2s
- **Chat Engine Processing:** Target < 300ms

### **Tools**
- **Vercel Analytics** - Page performance
- **Sentry** - Error tracking
- **PostgreSQL EXPLAIN** - Query optimization
- **Chrome DevTools** - Frontend profiling

---

## 🔐 Security Checklist

### **Before Production**
- [ ] Change `NEXTAUTH_SECRET` to strong random value
- [ ] Enable SSL/TLS for database connection
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for API routes
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Review and sanitize all user inputs
- [ ] Enable HTTPS redirect
- [ ] Configure CSP headers
- [ ] Set up monitoring and alerts

---

## 📚 Additional Resources

### **Documentation Files**
- `README.md` - Project overview
- `CODEBASE_ANALYSIS.md` - Detailed architecture analysis
- `ENHANCED_AI_README.md` - AI engine documentation
- `ENHANCED_FEATURES_SUMMARY.md` - Feature list
- `ROADMAP.md` - Future development plans

### **External Links**
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Documentation](https://react.dev/)
- [JWT.io](https://jwt.io/) - JWT debugger

---

## 🎓 Learning Path

### **For New Developers**
1. **Start Here:** `README.md` → `CODEBASE_ANALYSIS.md`
2. **Understand Auth:** `lib/auth.js` → `app/api/auth/login/route.js`
3. **Explore AI:** `lib/enhancedChatEngine.js` → `app/api/chat/route.js`
4. **Study UI:** `app/dashboard/page.js` → `app/components/Navbar.js`
5. **Database:** `lib/db.js` → `lib/models.js`

### **For Contributors**
1. Read `ROADMAP.md` for planned features
2. Check `package.json` for available scripts
3. Review `lib/enhancedChatEngine.js` for AI logic
4. Study `app/globals.css` for styling system
5. Run tests: `npm test`

---

**Last Updated:** February 5, 2026  
**Version:** 1.0.0  
**Maintainer:** MindshiftR Team
