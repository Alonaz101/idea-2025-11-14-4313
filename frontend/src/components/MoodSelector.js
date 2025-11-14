import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MoodSelector() {
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/moods')
      .then(res => setMoods(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSelectMood = (mood) => {
    setSelectedMood(mood);
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:5000/api/recommendations?moodId=${mood._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setRecipes(res.data))
    .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Select your mood</h2>
      <ul style={{ display: 'flex', listStyle: 'none' }}>
        {moods.map(mood => (
          <li key={mood._id} style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSelectMood(mood)}>
            <span style={{ fontSize: '2rem' }}>{mood.emoji}</span>
            <p>{mood.name}</p>
          </li>
        ))}
      </ul>
      {selectedMood && (
        <div>
          <h3>Recommended Recipes for {selectedMood.name}</h3>
          <ul>
            {recipes.map(recipe => (
              <li key={recipe._id}>
                <h4>{recipe.title}</h4>
                <p>{recipe.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MoodSelector;
