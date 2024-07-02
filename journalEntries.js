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