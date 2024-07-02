import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import JournalEntry from './components/JournalEntry';
import MetricTracker from './components/MetricTracker';
import HabitTracker from './components/HabitTracker';
import InsightsDashboard from './components/InsightsDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Journal</Link></li>
            <li><Link to="/metrics">Metrics</Link></li>
            <li><Link to="/habits">Habits</Link></li>
            <li><Link to="/insights">Insights</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<JournalEntry />} />
          <Route path="/metrics" element={<MetricTracker />} />
          <Route path="/habits" element={<HabitTracker />} />
          <Route path="/insights" element={<InsightsDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;