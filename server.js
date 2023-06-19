const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser')
require('dotenv-flow').config()

const app = express();

app.use(cors({
  origin: '*'
}));

app.use( bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/health', require('express-healthcheck')({
  healthy: function () {
    return { message: 'ExpressJS web service is up and running' };
  }
}));

app.get('/', (req, res) => {
  res.send('Swagger will be here later...');
});

const HUDDLE_HEADERS = {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.HUDDLE_API_KEY,
  }
}

// http://localhost:5021/live-meetings
app.get('/live-meetings', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.huddle01.com/api/v1/live-meeting',
      {},
      HUDDLE_HEADERS
    );
    res.json(response?.data);
  } catch (error) {
    res.status(404).json(error);
  }
});

// http://localhost:5021/meeting-details/lgx-mktp-ywx
app.get('/meeting-details/:id', async (req, res) => {
  const roomId = req.params.id;
  try {
    const { data } = await axios.get(
      `https://api.huddle01.com/api/v1/meeting-details/${roomId}`,
      HUDDLE_HEADERS
    );
    res.json(data);
  } catch (error) {
    res.status(404).json(error);
  }
});

// Create new room
app.post('/rooms/create', async (req, res) => {
  try {
    const { data } = await axios.post(
      `https://api.huddle01.com/api/v1/create-room`,
      req.body,
      HUDDLE_HEADERS
    );
    res.json(data.data);
  } catch (error) {
    res.status(404).json(error);
  }
});

const port = process.env.APP_PORT || 5021;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});