import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/api/leaderboard');
      setLeaderboard(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>
      <div className="leaderboard-table">
        <div className="table-header">
          <div>Rank</div>
          <div>Username</div>
          <div>Score</div>
          <div>Percentage</div>
          <div>Date</div>
        </div>
        {leaderboard.map((entry, index) => (
          <div key={index} className={`table-row ${index < 3 ? 'top-three' : ''}`}>
            <div className="rank">
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && index + 1}
            </div>
            <div>{entry.username}</div>
            <div>{entry.score}/{entry.totalQuestions}</div>
            <div>{entry.percentage}%</div>
            <div>{new Date(entry.completedAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
      {leaderboard.length === 0 && (
        <div className="no-results">No quiz results yet. Be the first to take a quiz!</div>
      )}
    </div>
  );
};

export default Leaderboard;