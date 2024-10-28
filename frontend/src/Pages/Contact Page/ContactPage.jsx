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
                <div className="bg-amber-900 bg-opacity-90 rounded-lg shadow-lg p-6 max-w-lg w-full">
                    <h3 className="text-white text-2xl font-semibold mb-4">Get in Touch</h3>
                    <p className="text-gray-300 mb-4">If you have any questions, comments, or feedback, please fill out the form below.</p>
                    <form className="flex flex-col gap-4">
                        <label htmlFor="name" className="font-bold text-white">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="p-2 border border-gray-400 rounded bg-white text-gray-800"
                        />
                        
                        <label htmlFor="email" className="font-bold text-white">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="p-2 border border-gray-400 rounded bg-white text-gray-800"
                        />
                        
                        <label htmlFor="message" className="font-bold text-white">Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="4"
                            required
                            className="p-2 border border-gray-400 rounded bg-white text-gray-800"
                        ></textarea>
                        
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
