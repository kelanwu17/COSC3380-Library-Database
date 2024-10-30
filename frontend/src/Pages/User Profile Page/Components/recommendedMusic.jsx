import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RecommendedMusic({ preferences }) {
  const [recommendedMusic, setRecommendedMusic] = useState([]);

  useEffect(() => {
    const fetchRecommendedMusic = async () => {
      try {
        const genres = preferences.split(',').map(genre => genre.trim());
        const musicByGenre = [];

        for (const genre of genres) {
          const response = await axios.get(`https://library-database-backend.onrender.com/api/music/genre/${genre}`);
          musicByGenre.push(...response.data);
        }

        setRecommendedMusic(musicByGenre);
      } catch (error) {
        console.error("Error fetching recommended music by genre:", error);
      }
    };

    if (preferences) {
      fetchRecommendedMusic();
    }
  }, [preferences]);

  return (
    <div className="p-4 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-black">Recommended Music</h1>
      {recommendedMusic.length > 0 ? (
        <ul>
          {recommendedMusic.map((music) => (
            <li key={music.id} className="mb-2">
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
