const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/weatherdb');

const NoteSchema = new mongoose.Schema({ city: String, note: String, date: Date });
const Note = mongoose.model('Note', NoteSchema);

app.get('/weather/:city', async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    res.json(data);
  } catch (e) {
    res.status(404).json({ error: 'City not found' });
  }
});

app.post('/notes', async (req, res) => {
  const note = await Note.create({ ...req.body, date: new Date() });
  res.json(note);
});

app.get('/notes/:city', async (req, res) => {
  const notes = await Note.find({ city: req.params.city });
  res.json(notes);
});

app.listen(3000, () => console.log('Server running on port 3000'));