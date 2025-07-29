import Image from 'next/image'
import React from 'react'

function Footer() {
  return (


      <footer className="bg-black text-white border-t-4 border-black mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-black text-xl mb-6 uppercase text-yellow-400">About Us</h3>
              <p className="font-bold leading-relaxed">
                We are committed to revolutionizing education with a powerful LMS that makes learning accessible, personalized, and effective for everyone. Join us to experience the future of learning.
              </p>
            </div>
            <div>
              <h3 className="font-black text-xl mb-6 uppercase text-yellow-400">Contact</h3>
              <div className="space-y-2 font-bold">
                <p>Email: support@aicademy.com</p>
                <p>Phone: +91-3-456-7890</p>
                <p>Address: 123 Learning Lane, EdTech City, Knowledge State</p>
              </div>
            </div>
            <div>
              <h3 className="font-black text-xl mb-6 uppercase text-yellow-400">Socials</h3>
              <div className="flex gap-4">
                {['📘', '📷', '🐦', '📹', '💼'].map((icon, idx) => (
                  <button
                    key={idx}
                    className="w-12 h-12 bg-white text-black text-xl font-black border-4 border-white hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t-4 border-white mt-12 pt-8 text-center">
            <p className="font-black text-lg">© 2024 AICademy. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer