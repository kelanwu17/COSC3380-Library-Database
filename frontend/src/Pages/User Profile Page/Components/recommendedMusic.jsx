import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RecommendedMusic({ preferences, userId }) {
  const [recommendedMusic, setRecommendedMusic] = useState([]);
  const [selectedMusicGenres, setSelectedMusicGenres] = useState([]);

  const musicGenres = ['pop', 'rock', 'hip-hop', 'electronic']; // Available music genres

  // Sync preferences prop with selectedMusicGenres on mount or when preferences change
  useEffect(() => {
    setSelectedMusicGenres(preferences ? preferences.split(',').map(genre => genre.trim()) : []);
  }, [preferences]);

  // Fetch recommended music based on selected genres
  useEffect(() => {
    const fetchRecommendedMusic = async () => {
      const genresToFetch = selectedMusicGenres.length > 0 ? selectedMusicGenres : ["pop"];
      const musicByGenre = [];

      for (const genre of genresToFetch) {
        try {
          console.log(`Fetching music for genre: ${genre}`);
          const response = await axios.get(`https://library-database-backend.onrender.com/api/music/genre/${genre}`);
          if (response.data && Array.isArray(response.data)) {
            musicByGenre.push(...response.data);
          }
        } catch (error) {
          console.warn(`Error fetching music for genre "${genre}":`, error);
        }
      }

      setRecommendedMusic(musicByGenre);
    };

    fetchRecommendedMusic();
  }, [selectedMusicGenres]);

  // Handle checkbox changes for music genres
  const handleMusicGenreChange = (event) => {
    const { value, checked } = event.target;
    setSelectedMusicGenres(prevGenres => 
      checked ? [...prevGenres, value] : prevGenres.filter(genre => genre !== value)
    );
  };

  // Save updated music preferences to the backend
  const saveMusicPreferences = async () => {
    if (!userId) {
      console.error("Error: userId is not defined.");
      alert("User ID is missing. Please make sure you're logged in.");
      return;
    }

    try {
      await axios.put(`https://library-database-backend.onrender.com/api/member/updateMemberPref/${userId}`, {
        preferences: selectedMusicGenres.join(', ')
      });
      alert("Music preferences saved successfully.");
    } catch (error) {
      console.error("Error saving music preferences:", error);
      alert("Failed to save preferences.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-black">Recommended Music</h1>

      <div style={{ marginBottom: '20px' }}>
        <h3>Select Music Genres</h3>
        {musicGenres.map(genre => (
          <label key={genre} style={{ display: 'block' }}>
            <input
              type="checkbox"
              value={genre}
              checked={selectedMusicGenres.includes(genre)}
              onChange={handleMusicGenreChange}
            />
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </label>
        ))}
        <button onClick={saveMusicPreferences} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Save Music Preferences
        </button>
      </div>

      {recommendedMusic.length > 0 ? (
        <ul>
          {recommendedMusic.map((music) => (
            <li key={music.id || music.title} className="mb-2">
              <p className="font-semibold text-black">{music.title}</p>
              <p className="text-sm text-gray-600">{music.artist}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No recommended music available.</p>
      )}
    </div>
  );
}

export default RecommendedMusic;
