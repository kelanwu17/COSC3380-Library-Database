import React, { useState, useEffect } from 'react';
import './userProfile.css'; 
import Navbar from '../../Components/NavBar';
import axios from "axios";

function UserProfile() {

  // Default profile picture path
  const defaultProfilePic = "/public/profilepic.png"; 

  // State to manage which section is active
  const [activeSection, setActiveSection] = useState('events'); // Default to "events"
  const userId = sessionStorage.getItem('memberId');
  
  // Initialize the userProfile state with default values
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
    profilePic: defaultProfilePic // Initialize with default profile picture
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/member/${userId}`);
        const userFound = response.data[0];
        console.log(userFound);
        
        // Check if user data is found
        if (userFound) {
          setUserProfile({
            username: userFound.username,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            email: userFound.email,
            phone: userFound.phone,
            DOB: userFound.DOB,
            preferences: userFound.preferences || 0,
            accountStatus: userFound.accountStatus || 1,
            memberSince: userFound.memberSince || new Date().toISOString(), // Default to current date if undefined
            memberId: userFound.memberId || userId,
            fines: userFound.fines || '0.00',
            holds: userFound.holds || '0',
            profilePic: userFound.profilePic || defaultProfilePic // Use user profile pic if available, otherwise default
          });
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error fetching User details:', error);
      }
    };
    
    // Invoke the function
    fetchUserDetails();
  }, [activeSection, userId]); // `userId` ensures the correct user is fetched if the session changes

  // Format date of birth to display without time
  const formattedDOB = new Date(userProfile.DOB).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Extract only the year for "Member since"
  const formattedMemberSince = userProfile.memberSince 
    ? new Date(userProfile.memberSince).getFullYear()
    : new Date().getFullYear(); // Default to current year if undefined

  // Function to render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'events':
        return <p>Here are your upcoming events...</p>;
      case 'checkedOutHistory':
        return <p>Here is your checked out history...</p>;
      case 'recommendedBooks':
        return <p>Here are your recommended books...</p>;
      case 'recommendedMusic':
        return <p>Here is your recommended music...</p>;
      default:
        return null;
    }
  };
  
  return (
    <div>
      <Navbar /> {/* Add the Navbar here */}
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

            {/* Notification Inbox in Sidebar */}
            <div className="notification-sidebar">
              <h3 className="notification-title">Notifications</h3>
              <ul className="notification-list">
                <li className="notification-item">
                  <p><strong>Overdue Notice:</strong> You have 2 overdue books. Please return them by the end of this week.</p>
                  <span>Oct 21, 2024</span>
                </li>
                <li className="notification-item">
                  <p><strong>Event Reminder:</strong> Library Book Club meeting this Saturday at 10 AM.</p>
                  <span>Oct 20, 2024</span>
                </li>
                <li className="notification-item">
                  <p><strong>Alert:</strong> Your account balance is $0.00. No pending payments.</p>
                  <span>Oct 18, 2024</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="profile-content">
            {/* Member Info Rectangle with Profile Picture and Information */}
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

              {/* Fines and Holds Positioned Inside Member Info Rectangle */}
              <div className="profile-footer">
                <div className="fines">
                  <p><strong>Fines:</strong> ${userProfile.fines}</p>
                </div>
                <div className="holds">
                  <p><strong>Holds:</strong> {userProfile.holds}</p>
                </div>
              </div>
            </div>

            {/* Dynamic content displayed based on sidebar selection */}
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
