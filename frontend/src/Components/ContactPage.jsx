import React from 'react';

const ContactPage = () => {
    return (
        <div className="bg-beige min-h-screen flex flex-col">
            <header className="bg-brown text-white py-5 text-center">
                <h1 className="text-3xl font-bold">Lumina Archives</h1>
                <h2 className="text-xl mt-2">Contact Us</h2>
            </header>
            <main className="flex-grow flex items-center justify-center p-5">
                <div className="bg-light-brown rounded-lg shadow-lg p-6 max-w-lg w-full">
                    <h3 className="text-brown text-2xl font-semibold mb-4">Get in Touch</h3>
                    <p className="mb-4">If you have any questions, comments, or feedback, please fill out the form below.</p>
                    <form className="flex flex-col gap-4">
                        <label htmlFor="name" className="font-bold">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="p-2 border border-brown rounded"
                        />
                        
                        <label htmlFor="email" className="font-bold">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="p-2 border border-brown rounded"
                        />
                        
                        <label htmlFor="message" className="font-bold">Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="4"
                            required
                            className="p-2 border border-brown rounded"
                        ></textarea>
                        
                        <button
                            type="submit"
                            className="bg-brown text-white py-2 rounded hover:bg-dark-brown transition duration-300"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ContactPage;
