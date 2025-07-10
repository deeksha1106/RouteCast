const express = require('express');
const cors = require('cors');
const redis = require('./redis');

const app = express();
const PORT = process.env.PORT || 3001;
const THRESHOLD_MS = 6 * 1000; // 6 seconds

app.use(cors());

app.get('/location/:driverId', async (req, res) => {
  try {
    const data = await redis.get(req.params.driverId);

    if (!data) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const parsed = JSON.parse(data);

  
    const now = Date.now();
    if (!parsed.timestamp || now - parsed.timestamp > THRESHOLD_MS) {
      return res.status(204).send(); 
    }

    return res.json(parsed);
  } catch (error) {
    console.error('Error fetching location:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API server running at https://routecast-1.onrender.com:${PORT}`);
});
