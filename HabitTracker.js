import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/habits');
      setHabits(res.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/habits', { name, completed: false });
      setName('');
      fetchHabits();
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  return (
    <div>
      <h2>Habit Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Habit name"
        />
        <button type="submit">Add Habit</button>
      </form>
      <div>
        {habits.map((habit) => (
          <div key={habit._id}>
            <p>{habit.name} - {habit.completed ? 'Completed' : 'Not Completed'}</p>
            <p>{new Date(habit.date).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HabitTracker;