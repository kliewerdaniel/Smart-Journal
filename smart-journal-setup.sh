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
