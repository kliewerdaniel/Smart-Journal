import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MetricTracker() {
  const [metrics, setMetrics] = useState([]);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/metrics');
      setMetrics(res.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/metrics', { name, value: Number(value) });
      setName('');
      setValue('');
      fetchMetrics();
    } catch (error) {
      console.error('Error saving metric:', error);
    }
  };

  return (
    <div>
      <h2>Metric Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Metric name"
        />
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Metric value"
        />
        <button type="submit">Add Metric</button>
      </form>
      <div>
        {metrics.map((metric) => (
          <div key={metric._id}>
            <p>{metric.name}: {metric.value}</p>
            <p>{new Date(metric.date).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MetricTracker;