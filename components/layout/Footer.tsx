import React from 'react'
import { FaInstagram } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-black text-white border-t-4 border-black mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Social Media Links */}
        <div className="flex flex-col items-center mb-8">
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <div className="flex items-center justify-center gap-4">
            <a 
              href="https://www.instagram.com/next__break/profilecard/?igsh=MWdoaTNhN2t3czlqeg==" 
              target="_blank" 
              rel="noopener noreferrer nofollow"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-white/10"
              aria-label="Visit our Instagram"
            >
              <FaInstagram className="text-2xl text-pink-500 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-medium">Instagram</span>
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="font-bold text-lg">© 2025 NeoBrut. All Rights Reserved.</p>
          <p className="text-sm mt-2 text-white/60">Designed with passion in Saudi Arabia</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer