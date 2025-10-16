-- Create database
CREATE DATABASE cyber_quiz;

\c cyber_quiz;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes table
CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz results table
CREATE TABLE quiz_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (username, email, password, is_admin) VALUES 
('admin', 'admin@quiz.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

-- Insert quiz
INSERT INTO quizzes (title, description) VALUES 
('Cybersecurity Fundamentals', 'Test your knowledge of cybersecurity basics'),
('Network Security', 'Advanced network security concepts'),
('Ethical Hacking', 'Penetration testing and ethical hacking');

-- Insert questions for Quiz 1 (Cybersecurity Fundamentals)
INSERT INTO questions (quiz_id, question, options, correct_answer) VALUES 
(1, 'What does CIA stand for in cybersecurity?', '["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Computer Information Access", "Cyber Intelligence Analysis"]', 1),
(1, 'Which of the following is a type of malware?', '["Firewall", "Antivirus", "Trojan", "Router"]', 2),
(1, 'What is phishing?', '["A type of fishing", "Social engineering attack via email", "Network protocol", "Encryption method"]', 1),
(1, 'What is the purpose of a firewall?', '["Speed up internet", "Block unauthorized access", "Store passwords", "Encrypt files"]', 1),
(1, 'Which encryption is strongest?', '["DES", "3DES", "AES-256", "MD5"]', 2),
(1, 'What is two-factor authentication?', '["Using two passwords", "Using password + another factor", "Two different browsers", "Two antivirus programs"]', 1),
(1, 'What is a VPN used for?', '["Gaming", "Secure remote connection", "File storage", "Email"]', 1),
(1, 'What is social engineering?', '["Building networks", "Manipulating people for information", "Software engineering", "Hardware design"]', 1);

-- Insert questions for Quiz 2 (Network Security)
INSERT INTO questions (quiz_id, question, options, correct_answer) VALUES 
(2, 'What port does HTTPS use?', '["80", "443", "21", "25"]', 1),
(2, 'What is a DDoS attack?', '["Data theft", "Distributed Denial of Service", "Database corruption", "Device malfunction"]', 1),
(2, 'Which protocol is most secure for email?', '["POP3", "IMAP", "SMTP", "IMAPS"]', 3),
(2, 'What is network segmentation?', '["Dividing network into segments", "Joining networks", "Network speed optimization", "Cable management"]', 0),
(2, 'What is an IDS?', '["Internet Data Service", "Intrusion Detection System", "Internal Database System", "Internet Domain Service"]', 1),
(2, 'Which is a secure wireless protocol?', '["WEP", "WPA", "WPA3", "Open"]', 2);

-- Insert questions for Quiz 3 (Ethical Hacking)
INSERT INTO questions (quiz_id, question, options, correct_answer) VALUES 
(3, 'What is penetration testing?', '["Breaking systems illegally", "Authorized security testing", "Network installation", "Data backup"]', 1),
(3, 'What is a vulnerability assessment?', '["Installing software", "Identifying security weaknesses", "Network monitoring", "Data encryption"]', 1),
(3, 'What is SQL injection?', '["Database optimization", "Code injection attack", "Network protocol", "Encryption method"]', 1),
(3, 'What is cross-site scripting (XSS)?', '["Network attack", "Web application vulnerability", "Database error", "Hardware failure"]', 1),
(3, 'What is the first phase of ethical hacking?', '["Exploitation", "Reconnaissance", "Reporting", "Scanning"]', 1),
(3, 'What is Metasploit?', '["Antivirus software", "Penetration testing framework", "Web browser", "Database system"]', 1);