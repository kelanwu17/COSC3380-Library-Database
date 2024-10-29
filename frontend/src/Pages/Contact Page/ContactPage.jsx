import React from 'react';
import LandingPageImage from '../../Assets/LandingPage.png';
import NavBar from '../../Components/NavBar';

const ContactPage = () => {
    return (
        <div className="home-container h-screen flex flex-col">
            <NavBar />
            <div
                className="flex-grow flex items-center justify-center bg-cover bg-center"
                style={{
                    backgroundImage: `url(${LandingPageImage})`,
                }}
            >
                <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 max-w-lg w-full">
                    <h3 className="text-black text-2xl font-semibold mb-4">Get in Touch</h3>
                    <p className="text-black mb-4">If you have any questions, comments, or feedback, please fill out the form below.</p>
                    <form className="flex flex-col gap-4">
                        <label htmlFor="name" className="font-bold text-black">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="p-2 border border-black rounded bg-white text-black"
                        />
                        
                        <label htmlFor="email" className="font-bold text-black">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="p-2 border border-black rounded bg-white text-black"
                        />
                        
                        <label htmlFor="message" className="font-bold text-black">Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="4"
                            required
                            className="p-2 border border-black rounded bg-white text-black"
                        ></textarea>
                        
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
                        >
                            Send Message
                        </button>
                    </form>

                    {/* Improved location and hours section */}
                    <div className="mt-6 text-black">
                        <h4 className="font-semibold text-lg mb-1">Location</h4>
                        <p className="text-gray-700">123 Library Ave</p>
                        <p className="text-gray-700">Your City, State, Zip</p>
                        <h4 className="font-semibold text-lg mt-4 mb-1">Hours</h4>
                        <p className="text-gray-700">Monday - Friday: 8 AM - 6 PM</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
