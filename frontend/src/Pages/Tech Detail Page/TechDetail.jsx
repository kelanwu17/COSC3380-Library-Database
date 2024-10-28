import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/NavBar';
import { useNavigate, useParams, Link } from 'react-router-dom'; 
import axios from "axios";

function TechDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [techDetails, setTechDetails] = useState({
    techId: null,
    deviceName: '',
    modelNumber: '',
    count: 0,
    availabilityStatus: '',
    monetaryValue: 0,
    lastUpdatedBy: '',
    imgUrl: ''
  });
  const [otherTechs, setOtherTechs] = useState([]); 
  const[checkedOut, setCheckedOut] = useState(false)
  const [cHistoryId, setcHistoryId] = useState('')
  const userId = sessionStorage.getItem('memberId');
  //checkout logic
  const[itemInstance, setItemInstance] = useState('')
  
  const dataToSend = {
    memberId: userId,
    techId: id,
    instanceId: itemInstance,
  };
  
  async function checkout(e) {
    e.preventDefault();
    
    try {
      console.log(dataToSend)
      const response = await axios.post('https://library-database-backend.onrender.com/api/checkouttech/insertCheckOutTech', dataToSend);
      
      if (response.status === 201) { // Check if the response status is 201 (Created)
        setCheckedOut(true);
        alert("You have checked out this item.");
      }
      
      // Redirect or show success message here
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to check out item. Please try again.");
    }
  }
  async function returnTech(e) {
    e.preventDefault();
    try {
      console.log('chistory',cHistoryId)
      const response = await axios.put(`https://library-database-backend.onrender.com/api/checkouttech/updateCheckoutTech/${cHistoryId}`);
      
      console.log(response)
      setCheckedOut(false);
      alert("You have returned this item.");
      
      // Redirect or show success message here
    } catch (error) {
      
    }
  }

  useEffect(() => {
    const fetchTechDetails = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/technology/${id}`);
        const tech = response.data[0];

        if (tech) {
          setTechDetails({
            techId: tech.techId,
            deviceName: tech.deviceName,
            modelNumber: tech.modelNumber,
            count: tech.count,
            availabilityStatus: tech.availabilityStatus,
            monetaryValue: tech.monetaryValue,
            lastUpdatedBy: tech.lastUpdatedBy,
            imgUrl: tech.imgUrl // Fixed imgURL typo
          });
        } else {
          throw new Error('Tech not found');
        }
      } catch (error) {
        console.error('Error fetching Tech details:', error);
      } 
    };

    const fetchOtherTechs = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/technology`);
        const techs = response.data.slice(0, 5); 
        setOtherTechs(techs); 
      } catch (error) {
        console.error('Error fetching similar tech:', error);
      }
    };
    const fetchInstance = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/techInstance/${id}`);
        const instances = response.data; 
       
        
        //Logic to pick first instance where checked out status is not 0
        const availableInstance = instances.find(instance => instance.checkedOutStatus == 0);
       // console.log(availableInstance)
    if (availableInstance) {
      setItemInstance(availableInstance.instanceId); 
     
    }
      }
      catch (error) {
        console.error('Error fetching similar music:', error);
        
      }
    };
    
    const fetchMemberHistory = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/checkouttech/${userId}`);
        const memberHistory = response.data; 
      
        const instanceFound = memberHistory.find(instance => instance.techId == id && instance.timeStampReturn == null);
       
        if(instanceFound == undefined)
        {
          setCheckedOut(false);
          
        }
        else
        {
          
          if (instanceFound.timeStampReturn === null) {
            // Book is still checked out
            
            console.log("Book is currently checked out.");
            const checkoutHistoryID = instanceFound.checkedOutTechHistoryId ;
            
            setcHistoryId(checkoutHistoryID);
            
            setCheckedOut(true);
          } 
        }
    
      }
      catch (error) {
        console.error('Error fetching similar books:', error);
        
      }
    };
    fetchInstance();
    fetchTechDetails();
    fetchOtherTechs();
    fetchMemberHistory();
  }, [id]);

  const handleBackClick = () => navigate('/book');
  
  // Fix: Filter otherTechs excluding the current tech by deviceName
  const fetchSimilarTech = otherTechs.filter(tech => tech.deviceName !== techDetails.deviceName);

  return (
    <div>
      <Navbar />
      <hr className="ml-2 mr-2 border-t-2 border-black" />
      <div className="h-8">
        <button className="ml-4 mt-4 h-6 border bg-amber-900 w-32 rounded-lg text-white font-bold border-black" onClick={handleBackClick}>Back</button>
      </div>
      
      <div className="flex flex-row ml-6 mt-6">
        <div className="w-2/12 h-80">
          <img src={techDetails.imgUrl} className="w-full h-full object-cover" alt="Tech cover" />
        </div>
        <div className="ml-2 mt-2 flex flex-col">
          <p className="text-sm mt-1">Device: {techDetails.deviceName}</p>
          <p className="text-sm mt-1">Model Number: {techDetails.modelNumber}</p>
          <p className="text-sm mt-1">Count: {techDetails.count}</p>
        </div>
        <div className="ml-auto mr-12 flex flex-col">
          <button className="border bg-amber-900 w-36 rounded-lg text-white font-bold border-black">Reserve</button>
          {!checkedOut ? (
    <button
      onClick={checkout}
      className="border bg-amber-900 w-36 rounded-lg text-white font-bold border-black mt-2"
    >
      Checkout
    </button>
  ) : (
    <button
      onClick={returnTech}
      className="border bg-amber-900 w-36 rounded-lg text-white font-bold border-black mt-2"
    >
      Return
    </button>
  )}
        </div>
      </div>

      <hr className="ml-6 mt-2 bg-black border-0" />
      <p className="ml-4">Other Tech:</p>
      <hr className="mt-2 ml-2 mr-2 border-t-2 border-black" />
      <div className="flex flex-row flex-wrap">
        {fetchSimilarTech.length > 0 && fetchSimilarTech.map((tech) => (
          <Link to={`/tech/${tech.techId}`} key={tech.techId}> 
            <div className="flex flex-col ml-32 mt-4 hover:scale-105 transform transition-transform duration-300">
              <div className="border-black border h-60 w-48">
                <img src={tech.imgUrl} alt={tech.deviceName} className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-center mt-1">{tech.deviceName}</p>
              <p className="text-xs text-center mb-4">{tech.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TechDetail;
