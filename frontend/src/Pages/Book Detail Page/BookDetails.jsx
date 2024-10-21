import React, { useState } from 'react';
import Navbar from '../../Components/NavBar';
import { useNavigate } from 'react-router-dom'; 

function BookDetails() {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const navigate = useNavigate()
  const handleToggleDetails = () => {
    setShowMoreDetails(!showMoreDetails);
  };
  const handleBackClick = () => {
    navigate(-1);  
  };

  

  return (
    <div>
      <Navbar />
      <hr className="ml-2 mr-2 border-t-2 border-black" />
      <div className="h-8">
        <button className="ml-4 mt-4 h-6 border bg-amber-900 w-32 rounded-lg text-white text-bold border-black" onClick={handleBackClick}>Back</button>
      </div>
      <div className="flex flex-row ml-6 mt-6">
        <p className="border border-black w-2/12 h-80">Image will be here</p>
        <div className="ml-2 mt-2 flex flex-col">
          <p className="text-sm mt-1">Title:</p>
          <p className="text-sm mt-1">Author:</p>
          {showMoreDetails ?  (
            <>
          
              <p className="text-sm mt-1">Genres:</p>
              <p className="text-sm mt-1">Holds:</p>
              <p className="text-sm mt-1">Current Availability:</p>
              <p className="text-sm mt-1">Location: <span>Library Section A, Shelf 3</span></p>
              <p className="text-sm mt-1">Summary:</p>
              <button className='text-xs mt-1 font-bold' 
            
            onClick={handleToggleDetails}
            >
            Hide Details
          </button>
            </>
          ):(
            <>
            <button 
            className="text-xs mt-1 font-bold"
            onClick={handleToggleDetails}
          >
            More Details
          </button>
            </>

          )}
          
          
        </div>
        <div className="ml-auto mr-12 flex flex-col">
          <button className="border bg-amber-900 w-36 rounded-lg text-white text-bold border-black">Reserve</button>
          <button className="border bg-amber-900 w-36 rounded-lg text-white text-bold border-black mt-2">Checkout</button>
        </div>
      </div>
      <hr className="ml-6 mt-2 bg-black border-0" />
      <p className='ml-4'>Similar Books:</p>
      <hr className="mt-1 ml-2 mr-2 border-t-2 border-black" />
      <div className="">
        <div className="flex flex-row">
          <div className="flex flex-col">
            <div className="border-black border h-60 ml-36 w-48 mt-4  hover:scale-105  transform transition-transform duration-300">Book1</div>
            <p className="ml-36 text-sm">Title goes here</p>
            <p className="ml-36 mb-4 text-xs">Author goes here</p>
          </div>
          <div className="border-black border h-60 ml-16 w-48 mt-4 mb-4">Book2</div>
          <div className="border-black border h-60 ml-16 w-48 mt-4 mb-4">Book3</div>
          <div className="border-black border h-60 ml-16 w-48 mt-4 mb-4">Book4</div>
          <div className="border-black border h-60 ml-16 w-48 mt-4 mb-4">Book5</div>
        </div>
      </div>
      <footer>Footer</footer>
    </div>
  );
}

export default BookDetails;
