import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../Components/NavBar';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Components/Footer';

function MusicDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [musicID, setMusicID] = useState('');
  const [musicGenre, setMusicGenre] = useState('');
  const [artist, setArtist] = useState('');
  const [dateReleased, setDateReleased] = useState('');
  const [count, setCount] = useState(0);
  const [albumName, setAlbumName] = useState('');
  const [monetaryValue, setMonetaryValue] = useState(0);
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [lastUpdatedBy, setLastUpdatedBy] = useState('');
  const [imgURL, setImgURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [similarMusic, setSimilarMusic] = useState([]);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  useEffect(() => {
    const fetchMusicDetails = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/music/${id}`);
        const music = response.data[0];

        if (music) {
          const { 
            musicID, musicGenre, artist, dateReleased, count, albumName, 
            monetaryValue, availabilityStatus, lastUpdatedBy, imgUrl 
          } = music;

          const date = new Date(dateReleased);
          const formattedDate = date.toISOString().split('T')[0];

          setMusicID(musicID);
          setMusicGenre(musicGenre);
          setArtist(artist);
          setDateReleased(formattedDate);
          setCount(count);
          setAlbumName(albumName);
          setMonetaryValue(monetaryValue);
          setAvailabilityStatus(availabilityStatus);
          setLastUpdatedBy(lastUpdatedBy);
          setImgURL(imgUrl);

          fetchSimilarMusic(musicGenre); // Fetch similar music based on genre
        } else {
          throw new Error('Music not found');
        }
      } catch (error) {
        console.error('Error fetching music details:', error);
      } finally {
        setLoading(false); // Set loading to false after request finishes
      }
    };

    const fetchSimilarMusic = async (genre) => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/music/genre/${genre}`);
        const music = response.data.slice(0, 5);
        setSimilarMusic(music); 
      } catch (error) {
        console.error('Error fetching similar music:', error);
      }
    };

    fetchMusicDetails();
  }, [id]);

  const filteredSimilarMusic = similarMusic.filter((music) => music.albumName !== albumName);
  const handleToggleDetails = () => setShowMoreDetails(!showMoreDetails);
  const handleBackClick = () => navigate('/book');

  return (
    <div>
      <Navbar />
      <hr className="ml-2 mr-2 border-t-2 border-black" />
      <div className="h-8">
        <button className="ml-4 mt-4 h-6 border bg-amber-900 w-32 rounded-lg text-white text-bold border-black" onClick={handleBackClick}>Back</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-row ml-6 mt-6">
          <p className="w-2/12 h-80">
            <img src={imgURL} className="w-full h-full object-cover" alt="Music cover" />
          </p>
          <div className="ml-2 mt-2 flex flex-col">
            <p className="text-sm mt-1">Album: {albumName}</p>
            <p className="text-sm mt-1">Artist: {artist}</p>
            <p className="text-sm mt-1">
              Genres: <button className='text-blue-600 hover:text-purple-800' onClick={() => navigate(`/music/${musicGenre}`)}>{musicGenre}</button>
            </p>
            <p className="text-sm mt-1">Count: {count}</p>
            <p className="text-sm mt-1">Date Released: {dateReleased}</p>
          </div>
          <div className="ml-auto mr-12 flex flex-col">
            <button className="border bg-amber-900 w-36 rounded-lg text-white text-bold border-black">Reserve</button>
            <button className="border bg-amber-900 w-36 rounded-lg text-white text-bold border-black mt-2">Checkout</button>
          </div>
        </div>
      )}

      <hr className="ml-6 mt-2 bg-black border-0" />
      <p className="ml-4">Similar Music:</p>
      <hr className="mt-2 ml-2 mr-2 border-t-2 border-black" />
      <div className="flex flex-row flex-wrap">
        {filteredSimilarMusic.length > 0 && (
          filteredSimilarMusic.map((music) => (
            <Link to={`/music/${music.musicId}`} key={music.musicId}>
              <div className="flex flex-col ml-32 mt-4 hover:scale-105 transform transition-transform duration-300">
                <div className="border-black border h-60 w-48">
                  <img src={music.imgUrl} alt={music.albumName} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm text-center mt-1">{music.albumName}</p>
                <p className="text-xs text-center mb-4">{music.artist}</p>
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}

export default MusicDetails;
