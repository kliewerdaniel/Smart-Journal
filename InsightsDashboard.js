import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function InsightsDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [habits, setHabits] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const metricsRes = await axios.get('http://localhost:5000/api/metrics');
      const habitsRes = await axios.get('http://localhost:5000/api/habits');
      const entriesRes = await axios.get('http://localhost:5000/api/journal-entries');
      
      setMetrics(metricsRes.data);
      setHabits(habitsRes.data);
      setEntries(entriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const metricData = {
    labels: metrics.map(m => new Date(m.date).toLocaleDateString()),
    datasets: [{
      label: 'Metric Values',
      data: metrics.map(m => m.value),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Metric Values Over Time',
      },
    },
  };

  return (
    <div>
      <h2>Insights Dashboard</h2>
      <div>
        <h3>Metrics Overview</h3>
        <Line data={metricData} options={options} />
      </div>
      <div>
        <h3>Recent Journal Entries</h3>
        {entries.slice(0, 5).map((entry) => (
          <div key={entry._id}>
            <p>{new Date(entry.date).toLocaleString()}</p>
            <p>{entry.content.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
      <div>
        <h3>Habit Completion</h3>
        {habits.map((habit) => (
          <div key={habit._id}>
            <p>{habit.name}: {habit.completed ? 'Completed' : 'Not Completed'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InsightsDashboard;