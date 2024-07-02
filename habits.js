const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find().sort({ date: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const habit = new Habit({
    name: req.body.name,
    completed: req.body.completed
  });

  try {
    const newHabit = await habit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;