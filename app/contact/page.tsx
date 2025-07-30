'use client'

import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] text-black py-12 px-6 md:px-16 font-mono">
      <section className="max-w-5xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-6 md:p-12 space-y-12">

        {/* Header */}
        <h1 className="text-4xl md:text-6xl font-bold uppercase border-b-4 border-black pb-4">
          Contact Us
        </h1>

        {/* Contact Info */}
        <div className="space-y-4 text-base">
          <p className="flex items-center gap-2">
            <Mail size={20} /> contact@example.com
          </p>
          <p className="flex items-center gap-2">
            <Phone size={20} /> +20 123 456 7890
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={20} /> 123 Cairo Street, Egypt
          </p>
        </div>

        {/* Contact Form */}
        <form className="grid gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border-4 border-black px-4 py-2 bg-[#f1f1f1] placeholder:text-black focus:outline-none"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border-4 border-black px-4 py-2 bg-[#f1f1f1] placeholder:text-black focus:outline-none"
          />
          <textarea
            rows={5}
            placeholder="Your Message"
            className="border-4 border-black px-4 py-2 bg-[#f1f1f1] placeholder:text-black focus:outline-none"
          ></textarea>
          <button
            type="submit"
            className="bg-black text-white border-4 border-black px-6 py-3 uppercase font-bold hover:bg-white hover:text-black transition-all"
          >
            Send Message
          </button>
        </form>

        {/* WhatsApp */}
        <a
          href="https://wa.me/201234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 text-white border-4 border-black px-6 py-3 uppercase font-bold hover:bg-green-600 transition-all"
        >
          <MessageSquare size={20} />
          Chat on WhatsApp
        </a>

        {/* Footer Note */}
        <p className="text-sm text-gray-500 pt-6 border-t-4 border-black">
          We’ll respond within 24 hours. Brutalist support, no bots.
        </p>
      </section>
    </main>
  )
}
