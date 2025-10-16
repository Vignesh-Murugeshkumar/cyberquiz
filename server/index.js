const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Try to load pg, fallback if not available
let Pool;
let useInMemoryStorage = true;
try {
  Pool = require('pg').Pool;
  useInMemoryStorage = false;
} catch (e) {
  console.log('PostgreSQL not available, using in-memory storage');
}

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// PostgreSQL connection (optional)
let pool;
if (Pool) {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  // Test database connection
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Database connection failed:', err.message);
      console.log('Falling back to in-memory storage...');
      useInMemoryStorage = true;
    } else {
      console.log('Connected to PostgreSQL database');
      release();
    }
  });
} else {
  useInMemoryStorage = true;
}

// In-memory storage data
let users = [
  { id: 1, username: 'admin', email: 'admin@quiz.com', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', isAdmin: true }
];
let quizzes = [
  {
    id: 1,
    title: 'Cybersecurity Fundamentals',
    description: 'Test your knowledge of cybersecurity basics',
    questions: [
      {
        id: 1,
        question: 'What does CIA stand for in cybersecurity?',
        options: ['Central Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Computer Information Access', 'Cyber Intelligence Analysis'],
        correct: 1
      },
      {
        id: 2,
        question: 'Which of the following is a type of malware?',
        options: ['Firewall', 'Antivirus', 'Trojan', 'Router'],
        correct: 2
      },
      {
        id: 3,
        question: 'What is phishing?',
        options: ['A type of fishing', 'Social engineering attack via email', 'Network protocol', 'Encryption method'],
        correct: 1
      },
      {
        id: 4,
        question: 'What is the purpose of a firewall?',
        options: ['Speed up internet', 'Block unauthorized access', 'Store passwords', 'Encrypt files'],
        correct: 1
      },
      {
        id: 5,
        question: 'Which encryption is strongest?',
        options: ['DES', '3DES', 'AES-256', 'MD5'],
        correct: 2
      }
    ]
  },
  {
    id: 2,
    title: 'Network Security',
    description: 'Advanced network security concepts',
    questions: [
      {
        id: 1,
        question: 'What port does HTTPS use?',
        options: ['80', '443', '21', '25'],
        correct: 1
      },
      {
        id: 2,
        question: 'What is a DDoS attack?',
        options: ['Data theft', 'Distributed Denial of Service', 'Database corruption', 'Device malfunction'],
        correct: 1
      },
      {
        id: 3,
        question: 'What is network segmentation?',
        options: ['Dividing network into segments', 'Joining networks', 'Network speed optimization', 'Cable management'],
        correct: 0
      }
    ]
  }
];
let quizResults = [];

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (useInMemoryStorage) {
      if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: users.length + 1,
        username,
        email,
        password: hashedPassword,
        isAdmin: false
      };
      
      users.push(user);
      
      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.isAdmin },
        process.env.JWT_SECRET || 'secret'
      );
      
      res.json({ token, user: { id: user.id, username, email, isAdmin: user.isAdmin } });
    } else {
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, is_admin',
        [username, email, hashedPassword]
      );
      
      const user = result.rows[0];
      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.is_admin },
        process.env.JWT_SECRET || 'secret'
      );
      
      res.json({ token, user: { id: user.id, username: user.username, email: user.email, isAdmin: user.is_admin } });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (useInMemoryStorage) {
      const user = users.find(u => u.email === email);
      
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.isAdmin },
        process.env.JWT_SECRET || 'secret'
      );
      
      res.json({ token, user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
    } else {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.is_admin },
        process.env.JWT_SECRET || 'secret'
      );
      
      res.json({ token, user: { id: user.id, username: user.username, email: user.email, isAdmin: user.is_admin } });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Quiz routes
app.get('/api/quizzes', authMiddleware, async (req, res) => {
  try {
    if (useInMemoryStorage) {
      res.json(quizzes.map(q => ({ id: q.id, title: q.title, description: q.description })));
    } else {
      const result = await pool.query('SELECT id, title, description FROM quizzes WHERE is_active = TRUE');
      res.json(result.rows);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quizzes/:id', authMiddleware, async (req, res) => {
  try {
    const quizId = parseInt(req.params.id);
    
    if (useInMemoryStorage) {
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
      res.json(quiz);
    } else {
      const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [quizId]);
      if (quizResult.rows.length === 0) return res.status(404).json({ error: 'Quiz not found' });
      
      const questionsResult = await pool.query('SELECT * FROM questions WHERE quiz_id = $1', [quizId]);
      
      const quiz = {
        ...quizResult.rows[0],
        questions: questionsResult.rows.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correct: q.correct_answer
        }))
      };
      
      res.json(quiz);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/quizzes/:id/submit', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body;
    const quizId = parseInt(req.params.id);
    
    if (useInMemoryStorage) {
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
      
      let score = 0;
      quiz.questions.forEach((q, index) => {
        if (answers[index] === q.correct) score++;
      });
      
      const result = {
        id: quizResults.length + 1,
        userId: req.user.id,
        quizId: quiz.id,
        score,
        totalQuestions: quiz.questions.length,
        completedAt: new Date()
      };
      
      quizResults.push(result);
      res.json(result);
    } else {
      const questionsResult = await pool.query('SELECT * FROM questions WHERE quiz_id = $1', [quizId]);
      const questions = questionsResult.rows;
      
      let score = 0;
      questions.forEach((q, index) => {
        if (answers[index] === q.correct_answer) score++;
      });
      
      const result = await pool.query(
        'INSERT INTO quiz_results (user_id, quiz_id, score, total_questions) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.user.id, quizId, score, questions.length]
      );
      
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leaderboard routes
app.get('/api/leaderboard', authMiddleware, async (req, res) => {
  try {
    if (useInMemoryStorage) {
      const leaderboard = quizResults
        .map(result => {
          const user = users.find(u => u.id === result.userId);
          return {
            username: user.username,
            score: result.score,
            totalQuestions: result.totalQuestions,
            percentage: Math.round((result.score / result.totalQuestions) * 100),
            completedAt: result.completedAt
          };
        })
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10);
      
      res.json(leaderboard);
    } else {
      const result = await pool.query(`
        SELECT u.username, qr.score, qr.total_questions, qr.completed_at,
               ROUND((qr.score::float / qr.total_questions) * 100) as percentage
        FROM quiz_results qr
        JOIN users u ON qr.user_id = u.id
        ORDER BY percentage DESC, qr.completed_at DESC
        LIMIT 10
      `);
      
      res.json(result.rows);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});