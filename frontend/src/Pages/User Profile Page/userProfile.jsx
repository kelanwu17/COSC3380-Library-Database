import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/NavBar';
import axios from "axios";
import ReserveComponent from './Components/ReserveComponent';
import CheckOutHistory from './Components/checkedOutHistory';
import RecommendedBooks from './Components/recommendedBook';
import RecommendedMusic from './Components/recommendedMusic'; 
import UserEvents from './Components/userEvents'; 
import WaitlistComponent from './Components/WaitlistComponent';
import LibraryCard from './Components/libraryCard'; 


function UserProfile() {
  const defaultProfilePic = "/profilepic.png"; 
  const [activeSection, setActiveSection] = useState('events');
  const userId = sessionStorage.getItem('memberId');
  const [isEditing, setIsEditing] = useState(false);

  const [userProfile, setUserProfile] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    DOB: '',
    preferences: '',
    accountStatus: 1,
    memberSince: '',
    memberId: userId,
    fines: '0.00',
    holds: '0',
    profilePic: defaultProfilePic
  });
  const [originalProfile, setOriginalProfile] = useState({});
  const [finesId, setFinesId] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/member/${userId}`);
        const userFound = response.data[0];
  
        if (userFound) {
          setUserProfile(prevProfile => ({
            ...prevProfile,
            firstName: userFound.firstName || prevProfile.firstName,
            lastName: userFound.lastName || prevProfile.lastName,
            email: userFound.email || prevProfile.email,
            phone: userFound.phone || prevProfile.phone,
            DOB: userFound.DOB || prevProfile.DOB,
            preferences: userFound.preferences || prevProfile.preferences,
            accountStatus: userFound.accountStatus || prevProfile.accountStatus,
            memberSince: userFound.createdAt || prevProfile.memberSince,
            role: userFound.role || prevProfile.role,
            profilePic: userFound.profilePic || defaultProfilePic
          }));
          setOriginalProfile(userFound); // Store original data for comparison
  
          // Fetch fines
          const finesResponse = await axios.get(`https://library-database-backend.onrender.com/api/fines/${userId}`);
          const memberFines = finesResponse.data;
          if (memberFines.length > 0) {
            setUserProfile(prevProfile => ({
              ...prevProfile,
              fines: memberFines[0].fineAmount
            }));
            setFinesId(memberFines[0].finesId);
          } else {
            setFinesId(null);
          }
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user details or fines:', error);
      }
    };
  
    fetchUserDetails();
  }, [userId]);
  

  const formattedDOB = new Date(userProfile.DOB).toLocaleDateString('en-US', {
    timeZone: 'UTC',  // This forces it to display the date as-is, without shifting time zones
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  

  const formattedMemberSince = userProfile.memberSince 
    ? new Date(userProfile.memberSince).getFullYear()
    : new Date().getFullYear();

  const handlePayFines = async () => {
    if (!finesId) {
      alert("No fine found to pay.");
      return;
    }

    try {
      await axios.put(`https://library-database-backend.onrender.com/api/fines/payFine/${finesId}`);
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Prepare updated data only for fields that have been changed
      const updatedProfileData = {};

      if (userProfile.firstName !== originalProfile.firstName) {
        updatedProfileData.firstName = userProfile.firstName;
      }
      if (userProfile.lastName !== originalProfile.lastName) {
        updatedProfileData.lastName = userProfile.lastName;
      }
      if (userProfile.email !== originalProfile.email) {
        updatedProfileData.email = userProfile.email;
      }
      if (userProfile.phone !== originalProfile.phone) {
        updatedProfileData.phone = userProfile.phone;
      }

      // Only proceed if there are fields to update
      if (Object.keys(updatedProfileData).length > 0) {
        await axios.put(`https://library-database-backend.onrender.com/api/member/updateMember/${userId}`, updatedProfileData);
        alert("Profile updated successfully!");
        setIsEditing(false);
        setOriginalProfile(prev => ({ ...prev, ...updatedProfileData })); // Update original data with the new changes
      } else {
        alert("No changes to save.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'events':
        return <UserEvents userId={userId} />;
      case 'checkedOutHistory':
        return <CheckOutHistory userId={userId} />;
      case 'recommendedBooks':
        return <RecommendedBooks preferences={userProfile.preferences} userId={userId} />;
      case 'recommendedMusic':
        return <RecommendedMusic preferences={userProfile.preferences} userId={userId} />;
      case 'reservedItems':
        return <ReserveComponent />;
      case 'waitListedItems':
        return <WaitlistComponent />;
      case 'libraryCard':
        return <LibraryCard userId={userId} />; // Render LibraryCard component
        default:
        return <p>Select a section from the sidebar.</p>;
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', padding: '20px' }}>
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
            <li onClick={() => setActiveSection('libraryCard')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'libraryCard' ? '#ddd' : 'transparent', fontWeight: activeSection === 'libraryCard' ? 'bold' : 'normal' }}>Library Card</li>
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
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="firstName"
                  value={userProfile.firstName || ''} // Ensure value is bound
                  onChange={handleInputChange}
                  style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={userProfile.lastName || ''} // Ensure value is bound
                  onChange={handleInputChange}
                  style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}
                  placeholder="Last Name"
                />
              </>
            ) : (
              <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>
            )}   
              <p><strong>Member since:</strong> {formattedMemberSince}</p>
              <p><strong>Member ID:</strong> {userProfile.memberId}</p>
              <p><strong>DOB:</strong> {formattedDOB}</p>
              <p>
                <strong>Email:</strong>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={userProfile.email}
                    onChange={handleInputChange}
                    style={{ fontSize: '14px', marginLeft: '10px' }}
                  />
                ) : (
                  userProfile.email
                )}
              </p>
              <p>
                <strong>Phone Number:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={userProfile.phone}
                    onChange={handleInputChange}
                    style={{ fontSize: '14px', marginLeft: '10px' }}
                  />
                ) : (
                  userProfile.phone
                )}
              </p>
              <button onClick={handleEditToggle} style={{ marginTop: '10px', padding: '10px', backgroundColor: isEditing ? '#007bff' : '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              {isEditing && (
                <button onClick={handleSaveProfile} style={{ marginTop: '10px', marginLeft: '10px', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Save
                </button>
              )}
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
