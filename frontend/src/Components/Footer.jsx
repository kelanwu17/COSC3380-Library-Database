import React from 'react'
import { useParams, Link } from 'react-router-dom';
function Footer() {
  return (
    <div>
       <footer className="bg-amber-900 text-white py-4">
  <div className="container mx-auto flex justify-between items-center">
    <div className="ml-6">
      <p>&copy; {new Date().getFullYear()} Lumina Library. All rights reserved.</p>
      <p className="text-xs mt-1">Powered by Team 5</p>
    </div>
    <div className="mr-6">
      <Link to="/about" className="mr-4 hover:underline">About</Link>
      <Link to="/contact" className="mr-4 hover:underline">Contact</Link>
      <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
    </div>
  </div>
</footer>
    </div>
  )
}

export default Footer
