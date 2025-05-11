// api/counter.js
const express = require('express');
const app = express();

let visitorCount = 0; // Simpan di memory

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  next();
});

app.post('/api/counter', (req, res) => {
  visitorCount++;
  res.json({ visitors: visitorCount });
});

module.exports = app;