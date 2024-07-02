const express = require('express');
const router = express.Router();
const Metric = require('../models/Metric');

router.get('/', async (req, res) => {
  try {
    const metrics = await Metric.find().sort({ date: -1 });
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const metric = new Metric({
    name: req.body.name,
    value: req.body.value
  });

  try {
    const newMetric = await metric.save();
    res.status(201).json(newMetric);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;