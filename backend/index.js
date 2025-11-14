const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const secretKey = 'your_jwt_secret_key';

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/moodrecipe', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});
const User = mongoose.model('User', userSchema);

// Mood schema
const moodSchema = new mongoose.Schema({
  name: {type: String, required: true},
  emoji: {type: String, required: true}
});
const Mood = mongoose.model('Mood', moodSchema);

// Recipe schema
const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: [String],
  steps: [String]
});
const Recipe = mongoose.model('Recipe', recipeSchema);

// MoodRecipeMapping schema
const moodRecipeMappingSchema = new mongoose.Schema({
  moodId: {type: mongoose.Schema.Types.ObjectId, ref: 'Mood', required: true},
  recipeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true}
});
const MoodRecipeMapping = mongoose.model('MoodRecipeMapping', moodRecipeMappingSchema);

// Register endpoint
app.post('/api/auth/signup', async (req, res) => {
  const {username, email, password} = req.body;
  try {
    const existingUser = await User.findOne({email});
    if (existingUser) return res.status(400).json({message: 'User already exists'});
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({username, email, password: hashedPassword});
    await user.save();
    res.status(201).json({message: 'User created'});
  } catch (err) {
    res.status(500).json({message: 'Server error'});
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({message: 'Invalid credentials'});
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({message: 'Invalid credentials'});
    const token = jwt.sign({userId: user._id}, secretKey, {expiresIn: '1h'});
    res.json({token});
  } catch (err) {
    res.status(500).json({message: 'Server error'});
  }
});

// Middleware for JWT auth
const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({message: 'No token provided'});
  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) return res.status(401).json({message: 'Unauthorized'});
    req.userId = decoded.userId;
    next();
  });
};

// Mood input endpoint
app.get('/api/moods', async (req, res) => {
  const moods = await Mood.find();
  res.json(moods);
});

// Recipe recommendation endpoint
app.get('/api/recommendations', auth, async (req, res) => {
  const {moodId} = req.query;
  if (!moodId) return res.status(400).json({message: 'MoodId is required'});
  try {
    const mappings = await MoodRecipeMapping.find({moodId}).populate('recipeId');
    const recipes = mappings.map(m => m.recipeId);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({message: 'Server error'});
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
