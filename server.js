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
const journalEntriesRouter = require('./routes/journalEntries');
app.use('/api/journal-entries', journalEntriesRouter);

// Add similar lines for metrics and habits routes

const metricsRouter = require('./routes/metrics');
const habitsRouter = require('./routes/habits');

app.use('/api/journal-entries', journalEntriesRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/habits', habitsRouter);