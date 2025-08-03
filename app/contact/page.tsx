 "use client"

import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'
import { submitContactForm, getContactInfo } from '@/actions/contact'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    phone: ''
  })
  const [contactInfo, setContactInfo] = useState({
    email: 'contact@example.com',
    phone: '+20 123 456 7890',
    address: '123 Cairo Street, Egypt',
    whatsapp: '+201234567890'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)

  // Fetch contact info on component mount
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const result = await getContactInfo()
        if (result.success && result.data) {
          setContactInfo({
            email: result.data.email,
            phone: result.data.phone,
            address: result.data.address,
            whatsapp: result.data.whatsapp
          })
        }
      } catch (error) {
        console.error('Failed to fetch contact info:', error)
      }
    }
    fetchContactInfo()
  }, []) // Empty dependency array ensures this runs only once on mount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({
        success: false,
        message: 'Please fill in all required fields'
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const result = await submitContactForm({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        phone: formData.phone || null, // Send undefined if phone is empty
        source: 'website'
      })

      if (result.success) {
        setSubmitStatus({
          success: true,
          message: 'Message sent successfully! We will respond soon.'
        })
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: '',
          phone: ''
        })
      } else {
        setSubmitStatus({
          success: false,
          message: result.error || 'Failed to send message. Please try again.'
        })
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen  text-black py-12 px-6 md:px-16">
      <section className="max-w-5xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-6 md:p-12 space-y-12">
        {/* Header */}
        <h1 className="text-4xl md:text-6xl font-bold uppercase border-b-4 border-black pb-4">
          Contact Us
        </h1>

        {/* Contact Info - Dynamically loaded from server */}
        <div className="space-y-4 text-lg">
          <p className="flex items-center gap-2">
            <Mail size={20} /> {contactInfo.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={20} /> {contactInfo.phone}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={20} /> {contactInfo.address}
          </p>
        </div>

        {/* Status Message */}
        {submitStatus && (
          <div
            className={`p-4 border-4 ${
              submitStatus.success
                ? 'bg-green-100 border-green-500 text-green-800'
                : 'bg-red-100 border-red-500 text-red-800'
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block font-bold mb-2">
                Your Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full p-3 border-2 border-black focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-bold mb-2">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full p-3 border-2 border-black focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block font-bold mb-2">
              Phone Number (Optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+20 123 456 7890"
              className="w-full p-3 border-2 border-black focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-bold mb-2">
              Your Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help you?"
              required
              className="w-full p-3 border-2 border-black focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-6 py-3 font-bold uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 font-bold uppercase hover:bg-green-600 transition-colors text-center flex items-center justify-center gap-2"
            >
              <MessageSquare size={20} />
              Chat on WhatsApp
            </a>
          </div>
        </form>

        <p className="text-sm text-gray-500 pt-6 border-t-4 border-black">
          We&apos;ll respond within 24 hours. No bots, just real people.
        </p>
      </section>
    </main>
  )
}