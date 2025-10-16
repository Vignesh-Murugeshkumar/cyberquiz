# 🛡️ Cybersecurity Quiz & Leaderboard

A comprehensive cybersecurity knowledge testing platform with real-time leaderboards and interactive quizzes.

## 🎯 Problem Statement

Organizations and individuals need an effective way to assess and improve their cybersecurity knowledge. This application addresses the need for:
- **Interactive Learning**: Engaging quiz format for cybersecurity education
- **Knowledge Assessment**: Comprehensive testing across multiple cybersecurity domains
- **Progress Tracking**: Real-time scoring and leaderboard system
- **Competitive Learning**: Gamified approach to encourage continuous learning

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with red/black cybersecurity theme

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **PostgreSQL** (optional) - Database with in-memory fallback

### Development Tools
- **Nodemon** - Development server auto-restart
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Features

- ✅ **User Authentication** - Secure register/login system
- ✅ **Multiple Quiz Categories** - Cybersecurity Fundamentals, Network Security, Ethical Hacking
- ✅ **Real-time Scoring** - Instant feedback and percentage calculation
- ✅ **Global Leaderboard** - Rankings with top performers and medals
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Dark Theme** - Professional red/black cybersecurity aesthetic
- ✅ **JWT Security** - Token-based authentication
- ✅ **Database Flexibility** - PostgreSQL with in-memory fallback

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- PostgreSQL (optional - app works with in-memory storage)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd smartshpoppingcart
```

### Step 2: Install Dependencies
```bash
npm run install-all
```

### Step 3: Environment Configuration
Create `.env` file in server directory:
```env
PORT=5001
JWT_SECRET=cyber_quiz_secret_key_2024
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cyber_quiz
DB_USER=postgres
DB_PASSWORD=your_password
```

### Step 4: Database Setup (Optional)
If using PostgreSQL:
```bash
# Create database
psql -U postgres -f server/create_db.sql

# Setup tables and data
psql -U postgres -d cyber_quiz -f server/setup_tables.sql
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```
Expected output: `Server running on port 5001`

**Terminal 2 - Start Frontend Client:**
```bash
cd client
npm start
```
Expected output: `webpack compiled successfully`

### Production Mode
```bash
npm run build
npm start
```

## 🌐 Access Points

- **Frontend Application:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **Production Deployment:** https://cyberquiz-ck4qglf47-vignesh-murugeshkumars-projects.vercel.app

## 👤 Default Login Credentials

- **Email:** admin@quiz.com
- **Password:** password

## 📱 Usage Guide

1. **Registration/Login**
   - Create new account or use default credentials
   - JWT token stored for session management

2. **Taking Quizzes**
   - Select from available quiz categories
   - Answer multiple-choice questions
   - Submit for instant scoring

3. **Viewing Results**
   - See score and percentage immediately
   - Results saved to leaderboard

4. **Leaderboard**
   - View top performers with rankings
   - Medal system for top 3 positions (🥇🥈🥉)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Quizzes
- `GET /api/quizzes` - Get available quizzes
- `GET /api/quizzes/:id` - Get specific quiz with questions
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### Leaderboard
- `GET /api/leaderboard` - Get top 10 scores with rankings

## 📊 Quiz Categories

1. **Cybersecurity Fundamentals** (8 questions)
   - CIA Triad concepts
   - Basic security principles
   - Common threats and defenses

2. **Network Security** (6 questions)
   - Network protocols and ports
   - DDoS attacks and prevention
   - Wireless security standards

3. **Ethical Hacking** (6 questions)
   - Penetration testing methodology
   - Vulnerability assessment
   - Common attack vectors

## 🎨 Design Features

- **Dark Theme**: Professional red (#dc143c) and black gradient
- **Responsive Layout**: Mobile-friendly design
- **Interactive Elements**: Hover effects and smooth transitions
- **Visual Feedback**: Color-coded selections and results
- **Accessibility**: High contrast and readable fonts

## 🚀 Deployment

### Vercel Deployment
```bash
npm install -g vercel
vercel
```

### Railway Deployment
1. Push code to GitHub
2. Connect repository at railway.app
3. Auto-deploys with zero configuration

### Environment Variables for Production
```env
PORT=5001
JWT_SECRET=your_production_secret
```

## 🔧 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill existing processes
taskkill /f /im node.exe

# Or change port in .env file
PORT=5002
```

**PostgreSQL Connection Failed:**
- App automatically falls back to in-memory storage
- Check database credentials in .env file
- Ensure PostgreSQL service is running

**Build Errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📈 Future Enhancements

- [ ] Question difficulty levels
- [ ] Timer-based quizzes
- [ ] Certificate generation
- [ ] Admin panel for quiz management
- [ ] Social sharing features
- [ ] Progress analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Live Demo

**🌐 Deployment Link:** https://cyberquiz-ck4qglf47-vignesh-murugeshkumars-projects.vercel.app

**📧 Contact:** For questions or support, please open an issue in the repository.

---

*Built with ❤️ for cybersecurity education and awareness*"# cyberquiz" 
