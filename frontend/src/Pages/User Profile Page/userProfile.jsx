import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/NavBar';
import axios from "axios";
import ReserveComponent from './Components/ReserveComponent';
import CheckOutHistory from './Components/checkedOutHistory';
import RecommendedBooks from './Components/recommendedBook';
import RecommendedMusic from './Components/recommendedMusic'; 
import UserEvents from './Components/userEvents'; // Import the component
import WaitListComponent from './Components/WaitlistComponent';
import WaitlistComponent from './Components/WaitlistComponent';
function UserProfile() {
  const defaultProfilePic = "/profilepic.png"; 

  const [activeSection, setActiveSection] = useState('events');
  const userId = sessionStorage.getItem('memberId');
  
  const [userProfile, setUserProfile] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    DOB: '',
    preferences: 0,
    accountStatus: 1,
    memberSince: '',
    memberId: userId,
    fines: '0.00',
    holds: '0',
    profilePic: defaultProfilePic
  });
  const [finesId, setFinesId] = useState(null); // Initialize finesId

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/member/${userId}`);
        const userFound = response.data[0];

        if (userFound) {
          setUserProfile(prevProfile => ({
            ...prevProfile, // Preserve previous profile data
            username: userFound.username,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            email: userFound.email,
            phone: userFound.phone,
            DOB: userFound.DOB,
            preferences: userFound.preferences || 0,
            accountStatus: userFound.accountStatus || 1,
            memberSince: userFound.memberSince || new Date().toISOString(),
            memberId: userFound.memberId || userId,
            holds: userFound.holds || '0',
            profilePic: userFound.profilePic || defaultProfilePic
          }));

          // Fetch fines
          const finesResponse = await axios.get(`https://library-database-backend.onrender.com/api/fines/${userId}`);
          const memberFines = finesResponse.data;
          if (memberFines.length > 0) {
            setUserProfile(prevProfile => ({
              ...prevProfile,
              fines: memberFines[0].fineAmount
            }));
            setFinesId(memberFines[0].finesId); // Set finesId correctly
          } else {
            setFinesId(null); // No fines found, set finesId to null
          }
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error fetching User details or fines:', error);
      }
    };

    fetchUserDetails();
  }, [activeSection, userId]);

  const formattedDOB = new Date(userProfile.DOB).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedMemberSince = userProfile.memberSince 
    ? new Date(userProfile.memberSince).getFullYear()
    : new Date().getFullYear();

  const handlePayFines = async () => {
    console.log("Attempting to pay fine with finesId:", finesId);

    if (!finesId) {
      console.error("Error: finesId is not defined.");
      alert("No fine found to pay.");
      return;
    }

    try {
      const response = await axios.put(`https://library-database-backend.onrender.com/api/fines/payFine/${finesId}`);
      setUserProfile(prevProfile => ({
        ...prevProfile,
        fines: '0.00'
      }));
      alert("Payment successful! Your fines have been cleared.");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment failed. Please try again later.");
    }
  };

  // Define renderContent function
  const renderContent = () => {
    switch (activeSection) {
      case 'events':
        return <UserEvents userId={userId} />; // Show user events component
      case 'checkedOutHistory':
        return <CheckOutHistory userId={userId} />; // Show checkout history component
      case 'recommendedBooks':
        return <RecommendedBooks preferences={userProfile.preferences} />;
      case 'recommendedMusic':
        return <RecommendedMusic preferences={userProfile.preferences} />;
      case 'reservedItems':
        return <ReserveComponent />; // Example usage of ReserveComponent
      case 'waitListedItems':
        return  <WaitlistComponent/>
      default:
        return <p>Select a section from the sidebar.</p>;
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', padding: '20px' }}>
        {/* Sidebar */}
        <div style={{
          width: '20%',
          position: 'fixed',
          top: '60px',
          left: 0,
          padding: '20px 0',
          backgroundColor: '#f4f4f4',
          minHeight: '100vh',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li onClick={() => setActiveSection('events')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'events' ? '#ddd' : 'transparent', fontWeight: activeSection === 'events' ? 'bold' : 'normal' }}>Events</li>
            <li onClick={() => setActiveSection('checkedOutHistory')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'checkedOutHistory' ? '#ddd' : 'transparent', fontWeight: activeSection === 'checkedOutHistory' ? 'bold' : 'normal' }}>Checked Out History</li>
            <li onClick={() => setActiveSection('recommendedBooks')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'recommendedBooks' ? '#ddd' : 'transparent', fontWeight: activeSection === 'recommendedBooks' ? 'bold' : 'normal' }}>Recommended Books</li>
            <li onClick={() => setActiveSection('recommendedMusic')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'recommendedMusic' ? '#ddd' : 'transparent', fontWeight: activeSection === 'recommendedMusic' ? 'bold' : 'normal' }}>Recommended Music</li>
            <li onClick={() => setActiveSection('reservedItems')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'reservedItems' ? '#ddd' : 'transparent', fontWeight: activeSection === 'reservedItems' ? 'bold' : 'normal' }}>Reserved Items</li>
            <li onClick={() => setActiveSection('waitListedItems')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'waitListedItems' ? '#ddd' : 'transparent', fontWeight: activeSection === 'waitListedItems' ? 'bold' : 'normal' }}>Waitlisted Items</li>
          </ul>
        </div>

        <div style={{ flex: '3', marginLeft: '20%' }}>
          <div style={{ display: 'flex', marginBottom: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <img
              src={userProfile.profilePic}
              alt={`${userProfile.firstName} ${userProfile.lastName}`}
              style={{ width: '150px', height: '150px', borderRadius: '50%', marginRight: '20px' }}
            />
            <div>
              <h2>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>
              <p><strong>Member since:</strong> {formattedMemberSince}</p>
              <p><strong>Member ID:</strong> {userProfile.memberId}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>DOB:</strong> {formattedDOB}</p>
              <p><strong>Phone Number:</strong> {userProfile.phone}</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <p><strong>Fines:</strong> ${userProfile.fines}</p>
              {parseFloat(userProfile.fines) > 0 && (
                <button onClick={handlePayFines} style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Pay Fines
                </button>
              )}
            </div>
            <div>
              <p><strong>Holds:</strong> {userProfile.holds}</p>
            </div>
          </div>

          <div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
