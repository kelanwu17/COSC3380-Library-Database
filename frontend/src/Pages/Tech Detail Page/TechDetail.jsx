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

    fetchTechDetails();
    fetchOtherTechs();
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
          <button className="border bg-amber-900 w-36 rounded-lg text-white font-bold border-black mt-2">Checkout</button>
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
