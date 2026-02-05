# 🧠 MindshiftR - Mental Health Platform

A comprehensive mental health platform built with Next.js 16, featuring AI-powered companionship, clinical-grade screening tools, and biometric analysis.

## ✨ Features

### 🤖 AI Mental Wellness Companion
- **Conversation Memory**: Context-aware dialogue with session persistence
- **Therapeutic Personas**: Multiple AI personalities (Empathetic, Direct, Socratic, Mindfulness)
- **Intent Classification**: Smart detection of user needs (crisis, screening, tasks, etc.)
- **RAG-Enhanced Responses**: Clinical knowledge base with 40+ therapeutic protocols

### 📊 Clinical-Grade Screening
- **PHQ-9**: Depression screening with severity scoring
- **GAD-7**: Anxiety assessment with personalized recommendations
- **PSS-10**: Perceived stress scale evaluation
- **Burnout Assessment**: Work-related exhaustion detection

### 📝 Intelligent Journaling
- **AI-Powered Insights**: Emotion detection and sentiment analysis
- **Guided Prompts**: 8 categories of therapeutic writing prompts
- **Progress Tracking**: Mood trends and emotional patterns

### 🫀 Biometric Analysis
- **Health Vitals Integration**: HRV, heart rate, sleep, activity analysis
- **Pattern Detection**: Early identification of anxiety, depression, burnout
- **Personalized Recommendations**: Task suggestions based on biometric data

### 📈 Analytics & Progress
- **Wellness Scoring**: Comprehensive mental health metrics
- **Streak Tracking**: Daily engagement and consistency rewards
- **Progress Visualization**: Mood trends and session analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 15+
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mindshiftr
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
# Edit .env.local with your configuration
```

4. **Set up the database**
```bash
# Using Docker (recommended)
docker-compose up postgres redis

# Or manually:
# Create PostgreSQL database and run scripts/init-db.sql
```

5. **Run the application**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🐳 Docker Deployment

### Production Deployment with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services Included
- **PostgreSQL**: Primary database with full-text search
- **Redis**: Caching and session storage
- **Next.js App**: Production-optimized application
- **Nginx**: Reverse proxy with SSL termination

## 📡 API Documentation

### Authentication
All API endpoints support optional authentication. Include a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Core Endpoints

#### Chat Companion
```http
POST /api/chat
Content-Type: application/json

{
  "message": "I'm feeling anxious today",
  "sessionId": "session_123",
  "vitals": { "hrv": 45, "restingHR": 72 }
}
```

#### Journal Entries
```http
POST /api/journal
Content-Type: application/json

{
  "content": "Today was challenging but I learned...",
  "category": "reflection",
  "mood": "neutral",
  "tags": ["growth", "learning"]
}
```

#### Mental Health Screening
```http
POST /api/screening
Content-Type: application/json

{
  "type": "phq9",
  "responses": [1, 2, 3, 1, 2, 3, 1, 2, 3]
}
```

#### Vitals Analysis
```http
POST /api/vitals
Content-Type: application/json

{
  "hrv": 42,
  "restingHR": 78,
  "sleepHours": 7.5,
  "steps": 8500,
  "sleepQuality": 85
}
```

## 🏗️ Architecture

### Backend Stack
- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL 15 with UUID primary keys
- **Caching**: Redis for session management
- **Authentication**: JWT-based with bcrypt password hashing
- **ORM**: Native PostgreSQL queries with connection pooling

### Frontend Features
- **UI Framework**: React 19 with modern hooks
- **Styling**: CSS-in-JS with glass-morphism design
- **State Management**: React Context + Server Components
- **Animations**: Smooth transitions and micro-interactions

### Data Models
- **Users**: Authentication, preferences, streaks
- **Journal Entries**: Content analysis, sentiment tracking
- **Chat Conversations**: Session persistence, context awareness
- **Screening Results**: Clinical scoring, recommendations
- **Vitals Data**: Biometric analysis, pattern detection
- **Analytics**: Mood trends, wellness scoring

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/mindshiftr"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional Services
OPENAI_API_KEY="your-openai-key"
GOOGLE_CLIENT_ID="oauth-client-id"
SMTP_HOST="smtp.gmail.com"
```

### Database Schema

The application uses a comprehensive PostgreSQL schema with:
- **10+ tables** for complete data management
- **Full-text search** indexes on journal and chat content
- **UUID primary keys** for security
- **JSONB columns** for flexible data storage
- **Automated triggers** for timestamp updates

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

## 📊 Monitoring & Logging

- **Structured Logging**: JSON-formatted logs with levels
- **Error Tracking**: Comprehensive error handling and reporting
- **Performance Monitoring**: Request timing and database query analysis
- **Health Checks**: Docker health checks and API endpoints

## 🔒 Security Features

- **Password Security**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries
- **Rate Limiting**: Request throttling per IP
- **CORS Protection**: Configurable cross-origin policies

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker
```bash
# Build production image
docker build -t mindshiftr .

# Run with docker-compose
docker-compose up -d
```

### Traditional VPS
```bash
# Build application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Crisis Resources

**Important**: This application is not a substitute for professional mental health care. If you're in crisis:

- **Call 988** (Suicide & Crisis Lifeline)
- **Text HOME to 741741** (Crisis Text Line)
- **Call 911** for immediate emergencies

## 🙏 Acknowledgments

- Clinical protocols based on evidence-based therapeutic practices
- AI companionship powered by retrieval-augmented generation
- Biometric analysis algorithms validated against clinical research
