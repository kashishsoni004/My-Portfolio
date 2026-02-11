const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Contact endpoint (stub - logs to console)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  console.log('New contact message:', { name, email, message });

  // In a real app you would send an email or store this in a DB.
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

