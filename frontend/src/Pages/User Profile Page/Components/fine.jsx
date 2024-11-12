import React from 'react';
import axios from 'axios';

function Fine({ userId, fines, paid, setUserProfile }) {
    const handlePayFines = async () => {
        if (!fines || parseFloat(fines) === 0 || paid) {
            alert("No fine to pay or the fine has already been paid.");
            return;
        }

        try {
            const response = await axios.put(`https://library-database-backend.onrender.com/api/fines/payFine/${userId}`);
            if (response.status === 200) {
                setUserProfile(prevProfile => ({
                    ...prevProfile,
                    fines: '0.00',
                    paid: true
                }));
                alert("Payment successful! Your fines have been cleared.");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("Payment failed. Please try again later.");
        }
    };

    console.log("Fines data:", { fines, paid });

    return (
        <div>
            <p><strong>Fines:</strong> ${paid ? "0.00" : fines}</p>
            {!paid && parseFloat(fines) > 0 && (
                <button onClick={handlePayFines} style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Pay Fines
                </button>
            )}
        </div>
    );
}

export default Fine;
