import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/NavBar';
import { useNavigate } from 'react-router-dom'; 
import axios from "axios";
import { useParams, Link } from 'react-router-dom';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookId, setBookId] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genres, setGenres] = useState([]); // Change from single string to array
  const [ageCategory, setAgeCategory] = useState('');
  const [count, setCount] = useState(0);
  const [description, setDescription] = useState('');
  const [edition, setEdition] = useState('');
  const [aisle, setAisle] = useState(0);
  const [isbn, setIsbn] = useState('');
  const [monetaryValue, setMonetaryValue] = useState(0);
  const [publisher, setPublisher] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [similarBooks, setSimilarBooks] = useState([]); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const[itemInstance, setItemInstance] = useState('')
  const[checkedOut, setCheckedOut] = useState(false)
  const [waitList, setWaitList] = useState(false)
  const [cHistoryId, setcHistoryId] = useState('')
  const [waitListID, setWaitListID] = useState('')



  const userId = sessionStorage.getItem('memberId');
  useEffect(() => {

    if (userId) {
        setIsLoggedIn(true)
    } 
    else {
        setIsLoggedIn(false)
        setError('Not logged in')
    }
}, []);
  const dataToSend = {
    memberId: userId,
    bookId: id,
    instanceId: itemInstance

  }
  let waitListData = {
    itemId: id,
    itemType:"book",
    memberId: userId,

  }
 
  async function waitListBook(e) {
    e.preventDefault();
    try {
      
      console.log(waitListData)
      const response = await axios.post('https://library-database-backend.onrender.com/api/waitlist/createWaitlist', waitListData);
      console.log(response)
      alert("You have waitlisted this item.");
      setWaitList(true);
      
      // Redirect or show success message here
    } catch (error) {
      
    }
  }
  async function cancelwaitListBook(e) {
    e.preventDefault();
    try {
      
      
      const response = await axios.put(`https://library-database-backend.onrender.com/api/waitlist/cancelWaitlist/${waitListID}`);
      console.log(response)
      alert("You have been removed from the waitlist this item.");
      setWaitListID(undefined);
      setWaitList(false);
      
      // Redirect or show success message here
    } catch (error) {
      
    }
  }
  //Logic for checkout
  async function checkout(e) {
    e.preventDefault();
    try {

      const response = await axios.post('https://library-database-backend.onrender.com/api/checkoutbook/insertCheckOutBook', dataToSend);
      
      if(response)
      {
setCheckedOut(true);
alert("You have checked out this item.");
      }
      
      // Redirect or show success message here
    } catch (error) {
      
    }
  }
  async function returnBook(e) {
    e.preventDefault();
    try {
      
      const response = await axios.put(`https://library-database-backend.onrender.com/api/checkoutbook/updateCheckOutBook/${cHistoryId}`);
      
      alert("You have returned this item.");
      setCheckedOut(false);
      
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
        itemType: 'book',
        memberId: userId,

      }
      const response = await axios.post(`https://library-database-backend.onrender.com/api/reserve/createReserve`);
      
      alert("You have reserved this item.");
      
      
      // Redirect or show success message here
    } catch (error) {
      
    }
  }




  useEffect(() => {
   //console.log(dataToSend)
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/books/${id}`);
        const book = response.data[0];
        
        if (book) {
          const { 
            bookId, title, author, genre, ageCategory, count, 
            description, edition, aisle, isbn, monetaryValue, publisher, imgUrl 
          } = book;

          setBookId(bookId);
          setTitle(title);
          setAuthor(author);
          setGenres(genre.split(',').map(g => g.trim())); // Assume genre comes as a comma-separated string
          setAgeCategory(ageCategory);
          setCount(count);
          setDescription(description);
          setEdition(edition);
          setAisle(aisle);
          setIsbn(isbn);
          setMonetaryValue(monetaryValue);
          setPublisher(publisher);
          setImgUrl(imgUrl);

          fetchSimilarBooks(genre);

         
        } else {
          throw new Error('Book not found');
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
        
      } finally {
        setLoading(false); 
      }
    };

    const fetchSimilarBooks = async (genre) => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/books/genre/${genre}`);
        const books = response.data.slice(0, 5); 
        setSimilarBooks(books); 
      } catch (error) {
        console.error('Error fetching similar books:', error);
        
      }
    };
    const fetchInstance = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/bookInstance/${id}`);
        const instances = response.data; 
       
        
        //Logic to pick first instance where checked out status is not 0
        const availableInstance = instances.find(instance => instance.checkedOutStatus == 0);
       // console.log(availableInstance)
    if (availableInstance) {
      setItemInstance(availableInstance.instanceId); 
     
    }
      }
      catch (error) {
        console.error('Error fetching similar books:', error);
        
      }
    };
const fetchMemberHistory = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/checkoutbook/${userId}`);
        const memberHistory = response.data; 
       
        const instanceFound = memberHistory.find(instance => instance.bookId == id && instance.timeStampReturn == null);
       
        if(instanceFound == undefined)
        {
          setCheckedOut(false);
          
        }
        else
        {
          
          if (instanceFound.timeStampReturn === null) {
            // Book is still checked out
            
            console.log("Book is currently checked out.");
            const checkoutHistoryID = instanceFound.checkedOutBookHistoryId;
            
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
       
        waitListData = {
          itemId: id,
          itemType:"book",
          memberId: userId,
      
        }
        const instanceFound = memberHistory.find(instance => instance.itemId == id && instance.active == 1 && instance.itemType == 'book');
      console.log(memberHistory)
        if(instanceFound != undefined)
        {
       
          
          setWaitListID(instanceFound.waitlistId)
          setWaitList(true)
        
        }
        else
        {
          setWaitList(false)
          setWaitListID(undefined)
        }
        
        console.log(response.data)

    
      }
      catch (error) {
        console.error('Error fetching similar books:', error);
        
      }
    };
    fetchInstance();
    fetchBookDetails(); 
    fetchMemberHistory();
    fetchWaitList();
    
  }, [id,checkedOut, waitList]);

  const handleToggleDetails = () => setShowMoreDetails(!showMoreDetails);
  const handleBackClick = () => navigate('/books');
  
  const filteredSimilarBooks = similarBooks.filter(book => book.title !== title);

  return (
    <div>
      <Navbar />
      <hr className="ml-2 mr-2 border-t-2 border-black" />
      <div className="h-8">
        <button className="ml-4 mt-4 h-6 border bg-amber-900 w-32 rounded-lg text-white text-bold border-black" onClick={handleBackClick}>Back</button>
      </div>
      
        <div className="flex flex-row ml-6 mt-6">
          <p className="w-2/12 h-80">
            <img src={imgUrl} className="w-full h-full object-cover" alt="Book cover" />
          </p>
          <div className="ml-2 mt-2 flex flex-col">
            <p className="text-sm mt-1">Title: {title}</p>
            <p className="text-sm mt-1">Author: {author}</p>
            <p className="text-sm mt-1">
              Genres: {genres.map((g, index) => (
                <span key={index}>
                  <Link to={`/books/${g}`}>
                    <span className='text-blue-600 hover:text-purple-800'>{g}</span>
                  </Link>
                  {index < genres.length - 1 && ', '} 
                </span>
              ))}
            </p>
            {showMoreDetails ? (
              <>
                <p className="text-sm mt-1">Isbn: {isbn}</p>
                <p className="text-sm mt-1">Publisher: {publisher}</p>
                <p className="text-sm mt-1">Current Availability: {count}</p>
                <p className="text-sm mt-1">Location: Aisle {aisle}</p>
                <p className="text-sm mt-1">Summary: {description}</p>
                <button className='text-xs mt-1 font-bold' onClick={handleToggleDetails}>
                  Hide Details
                </button>
              </>
            ) : (
              <button className="text-xs mt-1 font-bold" onClick={handleToggleDetails}>
                More Details
              </button>
            )}
          </div>
          {userId && (
  <div className="ml-auto mr-12 flex flex-col">
    {waitList || count <= 0 ? (
      waitList ? (
        <button 
          onClick={cancelwaitListBook}
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
    ) : (
      !checkedOut ? (
        <button 
          onClick={checkout} 
          className="border bg-amber-900 w-36 rounded-lg text-white font-bold border-black mt-2"
        >
          Checkout
        </button>
      ) : (
        <button 
          onClick={returnBook} 
          className="border bg-amber-900 w-36 rounded-lg text-white font-bold border-black mt-2"
        >
          Return
        </button>
      )
    )}
    {/* Render Reserve button only if not in waitlist and count > 0 */}
    {count > 0 && !waitList && (
      <button 
        onClick={reserveItem} 
        className="border bg-amber-900 w-36 rounded-lg text-white font-bold border-black mt-2"
      >
        Reserve
      </button>
    )}
  </div>
)}

        </div>
      
      
      <hr className="ml-6 mt-2 bg-black border-0" />
      <p className="ml-4">Similar Books:</p>
      <hr className="mt-2 ml-2 mr-2 border-t-2 border-black" />
      <div className="flex flex-row flex-wrap">
        {filteredSimilarBooks.length > 0 && ( 
          filteredSimilarBooks.map((book) => (
            <Link to={`/books/${book.bookId}`} key={book.bookId}> 
              <div className="flex flex-col ml-32 mt-4 hover:scale-105 transform transition-transform duration-300">
                <div className="border-black border h-60 w-48 ">
                  <img src={book.imgUrl} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm text-center mt-1">{book.title}</p>
                <p className="text-xs text-center mb-4">{book.author}</p>
              </div>
            </Link>
          ))
        )}
      </div>
      <footer>Footer</footer>
    </div>
  );
}

export default BookDetails;
