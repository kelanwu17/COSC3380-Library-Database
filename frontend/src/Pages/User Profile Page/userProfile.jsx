import React, { useState, useEffect } from "react";
import Navbar from "../../Components/NavBar";
import axios from "axios";
import ReserveComponent from "./Components/ReserveComponent";
import CheckOutHistory from "./Components/checkedOutHistory";
import RecommendedBooks from "./Components/recommendedBook";
import RecommendedMusic from "./Components/recommendedMusic";
import UserEvents from "./Components/userEvents";
import WaitlistComponent from "./Components/WaitlistComponent";
import LibraryCard from "./Components/libraryCard";
import Fine from "./Components/fine";
import { Alert, Tooltip } from "@mui/material";

function UserProfile() {
  const defaultProfilePic = "/profilepic.png";
  const [activeSection, setActiveSection] = useState("events");
  const userId = sessionStorage.getItem("memberId");
  const [isEditing, setIsEditing] = useState(false);

  const [userProfile, setUserProfile] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    DOB: "",
    preferences: "",
    accountStatus: 1,
    memberSince: "",
    memberId: userId,
    fines: "0.00",
    holds: "0",
    profilePic: defaultProfilePic,
  });
  const [originalProfile, setOriginalProfile] = useState({});
  const [finesId, setFinesId] = useState(null);
  const [overdueItems, setOverdueItems] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `https://library-database-backend.onrender.com/api/member/${userId}`
        );
        const userFound = response.data[0];
        if (userFound) {
          const formattedDOB = userFound.DOB ? userFound.DOB.split("T")[0] : "";
          setUserProfile((prevProfile) => ({
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
            profilePic: userFound.profilePic || defaultProfilePic,
            fines: userFound.fines || "0.00",
          }));
          setOriginalProfile(userFound); // Store original data for comparison

          console.log("Backend response:", response.data);

          // Fetch fines
          const finesResponse = await axios.get(
            `https://library-database-backend.onrender.com/api/fines/${userId}`
          );
          const memberFines = finesResponse.data;

          // Log each fine to verify structure
          console.log("Fines data from API:", memberFines);

          // Calculate total unpaid fines
          const totalUnpaidFines = memberFines
            .filter((fine) => fine.paid === 0) // Only include unpaid fines
            .reduce((total, fine) => total + parseFloat(fine.fineAmount), 0);

          setUserProfile((prevProfile) => ({
            ...prevProfile,
            fines: totalUnpaidFines.toFixed(2), // Display as a fixed decimal
          }));
          console.log("Unpaid fines total:", totalUnpaidFines);
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user details or fines:", error);
      }
    };
    const fetchOverdue = async () => {
      const overdueResponse = await axios
        .get(
          `https://library-database-backend.onrender.com/api/overdue/${userId}`
        )
        .then((response) => {
          console.log("Found overdue");
          setOverdueItems(response.data);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            console.log("No overdue items found");
          }
        });
    };

    fetchUserDetails();
    fetchOverdue();
  }, [userId]);

  const formattedDOB = userProfile.DOB
    ? new Date(userProfile.DOB).toISOString().split("T")[0] // Extract just the date part
    : "Date Invalid";

  console.log("Formatted DOB:", formattedDOB);
  console.log("Fetched DOB:", userProfile.DOB);

  const formattedMemberSince = userProfile.memberSince
    ? new Date(userProfile.memberSince).getFullYear()
    : new Date().getFullYear();

  const handlePayFines = async () => {
    if (!userProfile?.fines || parseFloat(userProfile.fines) === 0) {
      alert("No fine found to pay.");
      return;
    }

    if (userProfile.paid) {
      alert("This fine has already been paid.");
      return;
    }

    try {
      // Simulate payment API call
      await axios.put(
        `https://library-database-backend.onrender.com/api/fines/payFine/${userId}`
      );

      // Update frontend state to show that the fines are paid and the amount is zero
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        fines: "0.00",
        paid: true,
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
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
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
        await axios.put(
          `https://library-database-backend.onrender.com/api/member/updateMember/${userId}`,
          updatedProfileData
        );
        alert("Profile updated successfully!");
        setIsEditing(false);
        setOriginalProfile((prev) => ({ ...prev, ...updatedProfileData })); // Update original data with the new changes
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
      case "events":
        return <UserEvents userId={userId} />;
      case "checkedOutHistory":
        return <CheckOutHistory userId={userId} />;
      case "recommendedBooks":
        return (
          <RecommendedBooks
            preferences={userProfile.preferences}
            userId={userId}
          />
        );
      case "recommendedMusic":
        return (
          <RecommendedMusic
            preferences={userProfile.preferences}
            userId={userId}
          />
        );
      case "reservedItems":
        return <ReserveComponent />;
      case "waitListedItems":
        return <WaitlistComponent />;
      case "libraryCard":
        return <LibraryCard userId={userId} />;
      default:
        return <p>Select a section from the sidebar.</p>;
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex", padding: "20px" }}>
        <div
          style={{
            width: "20%",
            position: "fixed",
            top: "60px",
            left: 0,
            padding: "20px 0",
            backgroundColor: "#f4f4f4",
            minHeight: "100vh",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li
              onClick={() => setActiveSection("events")}
              style={{
                padding: "15px 20px",
                cursor: "pointer",
                backgroundColor:
                  activeSection === "events" ? "#ddd" : "transparent",
                fontWeight: activeSection === "events" ? "bold" : "normal",
              }}
            >
              Events
            </li>
            <li
              onClick={() => setActiveSection("checkedOutHistory")}
              style={{
                padding: "15px 20px",
                cursor: "pointer",
                backgroundColor:
                  activeSection === "checkedOutHistory"
                    ? "#ddd"
                    : "transparent",
                fontWeight:
                  activeSection === "checkedOutHistory" ? "bold" : "normal",
              }}
            >
              Checked Out History
            </li>
            <li
              onClick={() => setActiveSection("recommendedBooks")}
              style={{
                padding: "15px 20px",
                cursor: "pointer",
                backgroundColor:
                  activeSection === "recommendedBooks" ? "#ddd" : "transparent",
                fontWeight:
                  activeSection === "recommendedBooks" ? "bold" : "normal",
              }}
            >
              Recommended Books
            </li>
            <li
              onClick={() => setActiveSection("recommendedMusic")}
              style={{
                padding: "15px 20px",
                cursor: "pointer",
                backgroundColor:
                  activeSection === "recommendedMusic" ? "#ddd" : "transparent",
                fontWeight:
                  activeSection === "recommendedMusic" ? "bold" : "normal",
              }}
            >
              Recommended Music
            </li>
            <li
              onClick={() => setActiveSection("reservedItems")}
              style={{
                padding: "15px 20px",
                cursor: "pointer",
                backgroundColor:
                  activeSection === "reservedItems" ? "#ddd" : "transparent",
                fontWeight:
                  activeSection === "reservedItems" ? "bold" : "normal",
              }}
            >
              Reserved Items
            </li>
            <li
              onClick={() => setActiveSection("waitListedItems")}
              style={{
                padding: "15px 20px",
                cursor: "pointer",
                backgroundColor:
                  activeSection === "waitListedItems" ? "#ddd" : "transparent",
                fontWeight:
                  activeSection === "waitListedItems" ? "bold" : "normal",
              }}
            >
              Waitlisted Items
            </li>
            <li
              onClick={() => setActiveSection("libraryCard")}
              style={{
                padding: "15px 20px",
                cursor: "pointer",
                backgroundColor:
                  activeSection === "libraryCard" ? "#ddd" : "transparent",
                fontWeight: activeSection === "libraryCard" ? "bold" : "normal",
              }}
            >
              Library Card
            </li>
          </ul>
        </div>

        <div style={{ flex: "3", marginLeft: "20%" }}>
          <div
            style={{
              display: "flex",
              marginBottom: "20px",
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              src={userProfile.profilePic}
              alt={`${userProfile.firstName} ${userProfile.lastName}`}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                marginRight: "20px",
              }}
            />
            <div>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="firstName"
                    value={userProfile.firstName || ""} // Ensure value is bound
                    onChange={handleInputChange}
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={userProfile.lastName || ""} // Ensure value is bound
                    onChange={handleInputChange}
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                    placeholder="Last Name"
                  />
                </>
              ) : (
                <div>
                  <h2
                    style={{ fontSize: "28px", fontWeight: "bold" }}
                  >{`${userProfile.firstName} ${userProfile.lastName}`}</h2>
                </div>
              )}
              <p>
                <strong>Member since:</strong> {formattedMemberSince}
              </p>
              <p>
                <strong>Member ID:</strong> {userProfile.memberId}
              </p>
              <p>
                <strong>DOB:</strong> {formattedDOB}
              </p>
              <p>
                <strong>Email:</strong>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={userProfile.email}
                    onChange={handleInputChange}
                    style={{ fontSize: "14px", marginLeft: "10px" }}
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
                    style={{ fontSize: "14px", marginLeft: "10px" }}
                  />
                ) : (
                  userProfile.phone
                )}
              </p>
              <p>
                <strong>Role:</strong> {userProfile.role}
              </p>
              {overdueItems !== null || userProfile.fines !== '0.00' ? (
                <Tooltip title="You have overdue items or fines. Please resolve immediately." placement="right">
                  <Alert severity="error">Restricted</Alert>
                </Tooltip>
              ) : (
                <Tooltip title="No overdue items" placement="right">
                  <Alert severity="success">Active</Alert>
                </Tooltip>
              )}

              <button
                onClick={handleEditToggle}
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  backgroundColor: isEditing ? "#007bff" : "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  style={{
                    marginTop: "10px",
                    marginLeft: "10px",
                    padding: "10px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div>
              <Fine
                userId={userId}
                fines={userProfile.fines}
                paid={userProfile.paid}
                setUserProfile={setUserProfile}
              />
            </div>
            <div>
              <p>
                <strong>Holds:</strong> {userProfile.holds}
              </p>
            </div>
          </div>

          <div>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
