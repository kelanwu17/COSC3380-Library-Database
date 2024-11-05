import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../Components/NavBar';
import { useNavigate } from 'react-router-dom';

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
  const[checkedOut, setCheckedOut] = useState(false)
  const [cHistoryId, setcHistoryId] = useState('')
  const [waitListID, setWaitListID] = useState('')
  const [reserve, setReserve] = useState('')
  const [reserveID, setReserveID] = useState('')
  const [lastDate, setLastDate] = useState('')
  const [fines, setFines] = useState(false)
  
  const userId = sessionStorage.getItem('memberId');
  //Checkout Logic
  const[itemInstance, setItemInstance] = useState('')
  const dataToSend = {
    memberId: userId,
    musicId: id,
    instanceId: itemInstance,
  };

  //Waitlist logic
  let waitListData = {
    itemId: id,
    itemType:"music",
    memberId: userId,

  }
  const [waitList, setWaitList] = useState(false)
  async function waitListBook(e) {
    e.preventDefault();
    try {
      setWaitList(true)
      console.log(waitListData)
      const response = await axios.post('https://library-database-backend.onrender.com/api/waitlist/createWaitlist', waitListData);
      console.log(response)
      alert("You have waitlisted this item.");
      setWaitList(true);
      
      // Redirect or show success message here
    } catch (error) {
      
    }
  }
  async function checkout(e) {
    e.preventDefault();
    
    try {
      const response = await axios.post('https://library-database-backend.onrender.com/api/checkoutmusic/insertCheckOutMusic', dataToSend);
      
      if (response.status === 201) { // Check if the response status is 201 (Created)
        setCheckedOut(true);
        alert("You have checked out this item.");
      }
      if (reserve) {
        // Call cancelReserveItem and pass an event to prevent any errors
        const cancelEvent = { preventDefault: () => {} }; // Create a mock event object
        await cancelReserveItem(cancelEvent); // Await the cancellation to ensure it completes
    }
      // Redirect or show success message here
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to check out item. Please try again.");
    }
  }
  async function returnMusic(e) {
    e.preventDefault();
    try {
      console.log('chistory',cHistoryId)
      const response = await axios.put(`https://library-database-backend.onrender.com/api/checkoutmusic/updateCheckoutMusic/${cHistoryId}`);
      alert("You have returned this item.");
      
      setCheckedOut(false);
      
      // Redirect or show success message here
    } catch (error) {
      
    }
  }

  async function cancelwaitListMusic(e) {
    e.preventDefault();
    try {
      setWaitList(false)
      
      const response = await axios.put(`https://library-database-backend.onrender.com/api/waitlist/cancelWaitlist/${waitListID}`);
      console.log(response)
      alert("You have been removed from the waitlist this item.");
      
      setWaitListID(undefined);
      setWaitList(false);
      // Redirect or show success message here
    } catch (error) {
      
    }
  }


   //Logic for reserve item 
   async function reserveItem(e) {
    e.preventDefault();
    try {
      let reserveData = {
        itemId: id,
        itemType: 'music',
        memberId: userId,
        instanceId: itemInstance

      }
      console.log(reserveData)
      
      const response = await axios.post('https://library-database-backend.onrender.com/api/reserve/createReserve', reserveData);
      setReserve(true)
      alert("You have reserved this item.");
      
      
      // Redirect or show success message here
    } catch (error) {
      
    }
  }
  async function cancelReserveItem(e) {
    e.preventDefault();
   try{
      const response = await axios.put(`https://library-database-backend.onrender.com/api/reserve/cancelReserve/${reserveID}`);
      setReserve(false)
      
      
      
      // Redirect or show success message here
   } catch (error) {
      
    }
}
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
        navigate('/books')
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
    const fetchInstance = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/musicInstance/${id}`);
        const instances = response.data; 
       
       
        if(!reserve)
        {
          const availableInstance = instances.find(instance => instance.checkedOutStatus == 0);
          if (availableInstance) {
            setItemInstance(availableInstance.instanceId); 
           
          }
        }
       
       // console.log(availableInstance)
  
      }
      catch (error) {
        console.error('Error fetching similar music:', error);
        
      }
    };
    const fetchMemberHistory = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/checkoutmusic/${userId}`);
        const memberHistory = response.data; 
      
        const instanceFound = memberHistory.find(instance => instance.musicId == id && instance.timeStampReturn == null);
       
        if(instanceFound == undefined)
        {
          setCheckedOut(false);
          
        }
        else
        {
          
          if (instanceFound.timeStampReturn === null) {
            // Book is still checked out
            
            console.log("Book is currently checked out.");
            const checkoutHistoryID = instanceFound.checkedOutMusicHistoryId;
            
            setcHistoryId(checkoutHistoryID);
            
            setCheckedOut(true);
          } 
        }
    
      }
      catch (error) {
        console.error('Error fetching similar books:', error);
        
      }
    };
    const fetchWaitList = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/waitlist/${userId}`);
        const memberHistory = response.data; 
       console.log(memberHistory)
       const instanceFound = memberHistory.find(instance => instance.itemId == id && instance.active == 1 && instance.itemType == 'music');
      
      
        if(instanceFound != undefined)
        {
       
          console.log('runs')
          setWaitListID(instanceFound.waitlistId)
          setWaitList(true)
        
        }
        else
        {
          setWaitList(false)
          setWaitListID(undefined)
        }
    
      }
      catch (error) {
        console.error('Error fetching similar books:', error);
        
      }
    };
    const fetchReserveList = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/reserve/${userId}`);
        const memberHistory = response.data; 
        const instanceFound = memberHistory.find(instance => instance.itemId == id && instance.active == 1 && instance.itemType == 'music');
        console.log("i",instanceFound)

        if(instanceFound !=null )
          {
            setItemInstance(instanceFound.instanceId)
            setReserve(true)
            setReserveID(instanceFound.reserveId)
            const reserveDate = instanceFound.reserveDate; // Get the reserve date
  
            // Create a new Date object
            let date = new Date(reserveDate);
            
            // Extract month, day, and year
            let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            let day = String(date.getDate()).padStart(2, '0');
            let year = date.getFullYear();
            
            // Format to "month-day-year"
            let formattedDate = `${month}-${day}-${year}`;
            
            // Set the last date with the formatted string
            setLastDate(formattedDate);
            
          }
          else
          {
            setReserveID(undefined)
            setReserve(false)
          }
  
        }  
      catch (error) {
        console.error('Error fetching similar books:', error);
        
      }
    };
    const fetchUserLibraryCard = async (genre) => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/libraryCard/${userId}`);
        const lCard = response.data
        
        if(lCard.status !==1)
        {
          setFines(true)
        }
        else
        {
          setFines(true)
        }
      } catch (error) {
        console.error('Error fetching similar books:', error);
        
      }
    };
    

    fetchWaitList();
    fetchMusicDetails();
    fetchInstance();
    fetchMemberHistory();
    fetchReserveList();
    fetchUserLibraryCard();
    
  }, [id,checkedOut,waitList, reserve]);

  const filteredSimilarMusic = similarMusic.filter((music) => music.albumName !== albumName);
  const handleToggleDetails = () => setShowMoreDetails(!showMoreDetails);
  const handleBackClick = () => navigate('/Music');
  return (
    <div>
      <Navbar />
      <hr className="ml-2 mr-2 border-t-2 border-black" />
  
      <div className="h-8">
        <button
          className="ml-4 mt-4 h-6 border bg-amber-900 w-32 rounded-lg text-white font-bold border-black"
          onClick={handleBackClick}
        >
          Back
        </button>
      </div>
  
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-row ml-6 mt-6">
          <div className="w-2/12 h-80">
            <img src={imgURL} className="w-full h-full object-cover" alt="Music cover" />
          </div>
  
          <div className="ml-2 mt-2 flex flex-col">
            <p className="text-sm mt-1">Album: {albumName}</p>
            <p className="text-sm mt-1">Artist: {artist}</p>
            <p className="text-sm mt-1">
              Genres:{" "}
              <button
                className="text-blue-600 hover:text-purple-800"
                onClick={() => navigate(`/music/${musicGenre}`)}
              >
                {musicGenre}
              </button>
            </p>
            <p className="text-sm mt-1">Count: {count}</p>
            <p className="text-sm mt-1">Date Released: {dateReleased}</p>
          </div>
  
          {(userId && fines) && (
  <div className="ml-auto mr-12 flex flex-col">
    {waitList || count <= 0 ? (
      waitList ? (
        <button
          onClick={cancelwaitListMusic}
          className="border bg-amber-900 w-36 rounded-lg text-white font-bold border-black"
        >
          Cancel Waitlist
        </button>
      ) : (
        <button
          onClick={waitListBook}
          className="border bg-amber-900 w-36 rounded-lg text-white font-bold border-black"
        >
          Waitlist
        </button>
      )
    ) : !checkedOut ? (
      <button
        onClick={checkout}
        className="border bg-amber-900 w-36 rounded-lg text-white font-bold border-black mt-2"
      >
        Checkout
      </button>
    ) : (
      <button
        onClick={returnMusic}
        className="border bg-amber-900 w-36 rounded-lg text-white font-bold border-black mt-2"
      >
        Return
      </button>
    )}

    {/* Render Reserve or Cancel Reserve button based on the reserve variable and checkedOut status */}
    {count > 0 && !waitList && !checkedOut && ( // Add !checkedOut condition here
      !reserve ? ( // Check if reserve is false
        <button
          onClick={reserveItem}
          className="border bg-amber-900 w-36 rounded-lg text-white font-bold border-black mt-2"
        >
          Reserve
        </button>
      ) : ( // If reserve is true
        <button
          onClick={cancelReserveItem}
          className="border bg-amber-900 w-36 rounded-lg text-white font-bold border-black mt-2"
        >
          Cancel Reserve <span className="block text-xs">{lastDate}</span>
        </button>
      )
    )}
  </div>
)}
        </div>
      )}
  
      <hr className="ml-6 mt-2 bg-black border-0" />
      <p className="ml-4">Similar Music:</p>
      <hr className="mt-2 ml-2 mr-2 border-t-2 border-black" />
  
      <div className="flex flex-row flex-wrap">
        {similarMusic.length > 0 &&
          similarMusic.filter((music) => music.albumName !== albumName).map((music) => (
            <Link to={`/music/${music.musicId}`} key={music.musicId}>
              <div className="flex flex-col ml-32 mt-4 hover:scale-105 transform transition-transform duration-300">
                <div className="border-black border h-60 w-48">
                  <img src={music.imgUrl} alt={music.albumName} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm text-center mt-1">{music.albumName}</p>
                <p className="text-xs text-center mb-4">{music.artist}</p>
              </div>
            </Link>
          ))}
      </div>
  
      
    </div>
  );
  }
  
  export default MusicDetails;
  