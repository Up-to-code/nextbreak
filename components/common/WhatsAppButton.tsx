'use client'

import React from 'react'
import { MessageSquare } from 'lucide-react'

export default function WhatsAppButton() {
  const phoneNumber = '201234567890' // <-- Replace with your actual number (without "+")

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-green-500 text-white border-4 border-black font-bold uppercase text-sm hover:bg-green-600 transition-all shadow-[6px_6px_0px_0px_black]"
    >
      <MessageSquare size={20} className="text-white" />
      WhatsApp
    </a>
  )
}
