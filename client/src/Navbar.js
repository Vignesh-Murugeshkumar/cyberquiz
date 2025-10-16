import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/quiz">🛡️ Cyber Quiz</Link>
      </div>
      <div className="nav-links">
        <Link to="/quiz">Quiz</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <span className="user-info">Welcome, {user.username}</span>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;