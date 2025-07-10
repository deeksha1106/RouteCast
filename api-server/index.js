const express = require('express');
const cors = require('cors'); // <--- ADD THIS
const redis = require('./redis');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins (or restrict it below)
app.use(cors()); // <--- ADD THIS LINE

app.get('/location/:driverId', async (req, res) => {
  const data = await redis.get(req.params.driverId);
  if (data) {
    res.json(JSON.parse(data));
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API server running at http://localhost:${PORT}`);
});
