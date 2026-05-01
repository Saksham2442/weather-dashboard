const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/weatherdb');

const NoteSchema = new mongoose.Schema({ city: String, note: String, date: Date });
const Note = mongoose.model('Note', NoteSchema);

// Get current weather
app.get('/weather/:city', async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${process.env.WEATHER_API_KEY}&units=${req.query.units || 'metric'}`
    );
    res.json(data);
  } catch (e) {
    res.status(404).json({ error: 'City not found' });
  }
});

// Get 5-day forecast
app.get('/forecast/:city', async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${req.params.city}&appid=${process.env.WEATHER_API_KEY}&units=${req.query.units || 'metric'}`
    );
    res.json(data);
  } catch (e) {
    res.status(404).json({ error: 'Forecast not found' });
  }
});

// Save a note
app.post('/notes', async (req, res) => {
  const note = await Note.create({ ...req.body, date: new Date() });
  res.json(note);
});

// Get all notes for a city
app.get('/notes/:city', async (req, res) => {
  const notes = await Note.find({ city: req.params.city }).sort({ date: -1 });
  res.json(notes);
});

// Delete a note
app.delete('/notes/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));