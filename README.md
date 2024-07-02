```bash
# Smart Journal Web App Setup

## Step 1: Project Initialization

# Create project directory
mkdir smart-journal
cd smart-journal

# Initialize Node.js project
npm init -y

# Install backend dependencies
npm install express mongoose dotenv cors

# Install development dependencies
npm install --save-dev nodemon

# Create .gitignore file
echo "node_modules\n.env" > .gitignore

## Step 2: Create Basic Server

# Create server.js file
cat << EOF > server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
EOF

# Create .env file
echo "MONGODB_URI=your_mongodb_connection_string" > .env

## Step 3: Set up folder structure

# Create necessary directories
mkdir models routes client

## Step 4: Create data models

# Create JournalEntry model
cat << EOF > models/JournalEntry.js
const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  analysis: { type: String }
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
EOF

# Create Metric model
cat << EOF > models/Metric.js
const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Metric', metricSchema);
EOF

# Create Habit model
cat << EOF > models/Habit.js
const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Habit', habitSchema);
EOF

## Step 5: Create API routes

# Create journalEntries route
cat << EOF > routes/journalEntries.js
const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');

router.get('/', async (req, res) => {
  try {
    const entries = await JournalEntry.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const entry = new JournalEntry({
    content: req.body.content
  });

  try {
    const newEntry = await entry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
EOF

# Create similar files for metrics.js and habits.js in the routes folder

## Step 6: Update server.js to include routes

# Append the following to server.js
cat << EOF >> server.js

const journalEntriesRouter = require('./routes/journalEntries');
app.use('/api/journal-entries', journalEntriesRouter);

// Add similar lines for metrics and habits routes
EOF

## Step 7: Set up frontend

# Navigate to client folder and create React app
cd client
npx create-react-app .

# Install additional frontend dependencies
npm install axios react-router-dom chart.js react-chartjs-2

# Return to root directory
cd ..

## Step 8: Update package.json for concurrent running of backend and frontend

# Add the following scripts to package.json
npm install --save-dev concurrently
npm pkg set scripts.start="node server.js"
npm pkg set scripts.server="nodemon server.js"
npm pkg set scripts.client="npm start --prefix client"
npm pkg set scripts.dev="concurrently \"npm run server\" \"npm run client\""

echo "Basic setup complete. You can now start developing your Smart Journal app!"

```

Now that we have our basic setup, let's go through the next steps to build out our Smart Journal app:

1. Open Visual Studio Code and navigate to the `smart-journal` folder you just created.

2. In the terminal within VS Code, run `npm run dev` to start both the backend server and the React frontend.

3. Let's create our React components. In the `client/src/components` directory, create the following files:

   - JournalEntry.js
   - MetricTracker.js
   - HabitTracker.js
   - InsightsDashboard.js

4. Let's implement the JournalEntry component with speech-to-text functionality:



```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JournalEntry() {
  const [content, setContent] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let recognition = null;

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        setContent(prevContent => prevContent + ' ' + transcript);
      };

      if (isListening) {
        recognition.start();
      } else {
        recognition.stop();
      }
    } else {
      console.error("Speech recognition not supported");
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [isListening]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5000/api/journal-entries', { content });
      setContent('');
      alert('Journal entry saved!');
    } catch (err) {
      setError('Failed to save journal entry. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>New Journal Entry</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your journal entry here..."
          rows="10"
          cols="50"
        />
        <button type="submit" disabled={isLoading}>Save Entry</button>
      </form>
      <button onClick={() => setIsListening(!isListening)}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      {isLoading && <p>Saving...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default JournalEntry;

```

5. Now, let's implement the routing in our main App.js file:

```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
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

        <Switch>
          <Route path="/" exact component={JournalEntry} />
          <Route path="/metrics" component={MetricTracker} />
          <Route path="/habits" component={HabitTracker} />
          <Route path="/insights" component={InsightsDashboard} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

```

6. Next, let's implement the InsightsDashboard component:

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function InsightsDashboard() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/metrics');
        setMetrics(res.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };
    fetchMetrics();
  }, []);

  const data = {
    labels: metrics.map(m => new Date(m.date).toLocaleDateString()),
    datasets: [{
      label: 'Stress Level',
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
        text: 'Stress Level Over Time',
      },
    },
  };

  return (
    <div>
      <h2>Insights Dashboard</h2>
      <Line data={data} options={options} />
    </div>
  );
}

export default InsightsDashboard;

```

7. Now, let's integrate with the Ollama API for AI-powered insights. Create a new file `api/ollama.js` in the server directory:

```javascript
const axios = require('axios');

const analyzeText = async (text) => {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama2',
      prompt: `Analyze the following journal entry and provide insights: ${text}`
    });
    return response.data.response;
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    return null;
  }
};

module.exports = { analyzeText };

```

8. Update the `routes/journalEntries.js` file to use the Ollama API:

```javascript
const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');
const { analyzeText } = require('../api/ollama');

router.get('/', async (req, res) => {
  try {
    const entries = await JournalEntry.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const entry = new JournalEntry({
    content: req.body.content
  });

  try {
    const analysis = await analyzeText(req.body.content);
    entry.analysis = analysis;
    const newEntry = await entry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

```

These steps will give you a solid foundation for your Smart Journal app. You can now run the app using `npm run dev` in the root directory. The backend will run on `http://localhost:5000` and the frontend on `http://localhost:3000`.

Next steps would include:
1. Implementing the MetricTracker and HabitTracker components
2. Adding more features to the InsightsDashboard
3. Improving the UI/UX with CSS styling
4. Adding user authentication
5. Implementing error handling and loading states across all components
6. Writing tests for both frontend and backend
7. Preparing the app for deployment
