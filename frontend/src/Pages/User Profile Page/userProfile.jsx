import React, { useState, useEffect } from 'react';
import './userProfile.css'; 
import Navbar from '../../Components/NavBar';
import axios from "axios";
import ReserveComponent from './Components/ReserveComponent';
import CheckOutHistory from './Components/checkedOutHistory';

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
        return <p>Here are your upcoming events...</p>;
      case 'checkedOutHistory':
        return <CheckOutHistory userId={userId} />; // Show checkout history component
      case 'recommendedBooks':
        return <p>Here are your recommended books...</p>;
      case 'recommendedMusic':
        return <p>Here is your recommended music...</p>;
      case 'reservedItems':
        return <ReserveComponent />; // Example usage of ReserveComponent
      default:
        return <p>Select a section from the sidebar.</p>;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-details">
          <div className="sidebar">
            <ul className="sidebar-menu">
              <li onClick={() => setActiveSection('events')}>EVENTS</li>
              <li onClick={() => setActiveSection('checkedOutHistory')}>CHECKED OUT HISTORY</li>
              <li onClick={() => setActiveSection('recommendedBooks')}>RECOMMENDED BOOKS</li>
              <li onClick={() => setActiveSection('recommendedMusic')}>RECOMMENDED MUSIC</li>
              <li onClick={() => setActiveSection('reservedItems')}>RESERVED ITEMS</li>
              <li onClick={() => setActiveSection('waitListedItems')}>WAITLISTED ITEMS</li>
            </ul>
            <div className="notification-sidebar">
              <h3 className="notification-title">Notifications</h3>
              <ul className="notification-list">
                <li className="notification-item">
                  <p><strong>Overdue Notice:</strong> You have 2 overdue books. Please return them by the end of this week.</p>
                  <span>Oct 21, 2024</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="profile-content">
            <div className="member-info-rectangle">
              <img
                src={userProfile.profilePic}
                alt={`${userProfile.firstName} ${userProfile.lastName}`}
                className="profile-image"
              />
              <div className="profile-info">
                <h2>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>
                <p><strong>Member since:</strong> {formattedMemberSince}</p>
                <p><strong>Member ID:</strong> {userProfile.memberId}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
                <p><strong>DOB:</strong> {formattedDOB}</p>
                <p><strong>Phone Number:</strong> {userProfile.phone}</p>
              </div>

              <div className="profile-footer">
                <div className="fines">
                  <p><strong>Fines:</strong> ${userProfile.fines}</p>
                  {parseFloat(userProfile.fines) > 0 && (
                    <button onClick={handlePayFines} className="pay-fines-button">
                      Pay Fines
                    </button>
                  )}
                </div>
                <div className="holds">
                  <p><strong>Holds:</strong> {userProfile.holds}</p>
                </div>
              </div>
            </div>

            <div className="section-content">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
