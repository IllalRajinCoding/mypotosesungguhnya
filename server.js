const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Simpan data di memory (akan reset saat redeploy)
let visitorData = {
  totalVisitors: 0,
  lastVisit: null
};

// Middleware visitor counter
app.use((req, res, next) => {
  visitorData.totalVisitors += 1;
  visitorData.lastVisit = new Date().toISOString();
  next();
});

// Serve static files from public directory
app.use(express.static('public'));

// API endpoint untuk visitor count
app.get('/api/visitors', (req, res) => {
  res.json(visitorData);
});

// Tangani semua route lainnya
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

module.exports = app;