import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const startQuiz = async (quizId) => {
    try {
      const response = await axios.get(`/api/quizzes/${quizId}`);
      setCurrentQuiz(response.data);
      setCurrentQuestion(0);
      setAnswers([]);
      setShowResult(false);
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  };

  const selectAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    try {
      const response = await axios.post(`/api/quizzes/${currentQuiz.id}/submit`, { answers });
      setResult(response.data);
      setShowResult(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setShowResult(false);
    setResult(null);
  };

  if (showResult) {
    return (
      <div className="quiz-container">
        <div className="result-card">
          <h2>Quiz Complete!</h2>
          <div className="score">
            Score: {result.score}/{result.totalQuestions}
          </div>
          <div className="percentage">
            {Math.round((result.score / result.totalQuestions) * 100)}%
          </div>
          <button onClick={resetQuiz}>Take Another Quiz</button>
        </div>
      </div>
    );
  }

  if (currentQuiz) {
    const question = currentQuiz.questions[currentQuestion];
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>{currentQuiz.title}</h2>
          <div className="progress">
            Question {currentQuestion + 1} of {currentQuiz.questions.length}
          </div>
        </div>
        <div className="question-card">
          <h3>{question.question}</h3>
          <div className="options">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option ${answers[currentQuestion] === index ? 'selected' : ''}`}
                onClick={() => selectAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>
          <button 
            className="next-btn"
            onClick={nextQuestion}
            disabled={answers[currentQuestion] === undefined}
          >
            {currentQuestion === currentQuiz.questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>Available Quizzes</h2>
      <div className="quiz-list">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="quiz-card">
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <button onClick={() => startQuiz(quiz.id)}>Start Quiz</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;