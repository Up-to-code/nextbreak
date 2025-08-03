"use client"
import React, { useState, useEffect } from 'react'
import { 
  getContactInfo, 
  updateContactInfo, 
  getContactMessages, 
  markMessageAsRead, 
  markMessageAsResponded, 
  deleteContactMessage,
  getMessageStats 
} from '@/actions/contact'
import type { ContactInfo, ContactMessage } from '@prisma/client'

type TabType = 'info' | 'messages'
type MessageAction = 'read' | 'responded' | 'delete'
type ButtonVariant = 'primary' | 'danger' | 'secondary' | 'warning'
type NotificationType = 'success' | 'error'

interface MessageStats {
  total: number
  unread: number
  responded: number
  pending: number
}

const AdminContactPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('info')
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    id: 0,
    email: '',
    phone: '',
    address: '',
    whatsapp: '',
    updatedAt: new Date()
  })
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [stats, setStats] = useState<MessageStats>({ 
    total: 0, 
    unread: 0, 
    responded: 0, 
    pending: 0 
  })
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadData()
  }, [activeTab, currentPage])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'info') {
        const infoResult = await getContactInfo()
        if (infoResult.success && infoResult.data) {
          setContactInfo(infoResult.data)
        }
      } else {
        const [messagesResult, statsResult] = await Promise.all([
          getContactMessages(currentPage, 10),
          getMessageStats()
        ])
        
        if (messagesResult.success && messagesResult.data) {
          setMessages(messagesResult.data.messages)
          setTotalPages(messagesResult.data.totalPages)
        }
        
        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data)
        }
      }
    } catch (error) {
      showNotification('Error loading data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message: string, type: NotificationType = 'success') => {
    setNotification(message)
    setTimeout(() => setNotification(''), 3000)
  }

  const handleContactInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await updateContactInfo({
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: contactInfo.address,
      whatsapp: contactInfo.whatsapp
    })
    
    if (result.success) {
      showNotification('Contact info updated successfully!')
      if (result.data) {
        setContactInfo(result.data)
      }
    } else {
      showNotification(result.error || 'Failed to update contact info', 'error')
    }
    setLoading(false)
  }

  const handleMessageAction = async (id: number, action: MessageAction) => {
    setLoading(true)
    try {
      let result
      switch (action) {
        case 'read':
          result = await markMessageAsRead(id)
          break
        case 'responded':
          result = await markMessageAsResponded(id)
          break
        case 'delete':
          result = await deleteContactMessage(id)
          break
      }
      
      if (result?.success) {
        showNotification(`Message ${action.toUpperCase()}!`)
        await loadData()
      } else {
        showNotification(result?.error || `Failed to ${action} message`, 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  // UI Components
  const TabButton = ({
    id,
    label,
    count,
    active,
    onClick
  }: {
    id: TabType
    label: string
    count?: number
    active: boolean
    onClick: (id: TabType) => void
  }) => (
    <button
      onClick={() => onClick(id)}
      className={`
        px-6 py-4 text-lg font-black uppercase tracking-wider
        border-4 border-black transition-all duration-200
        ${active 
          ? 'bg-yellow-400 text-black shadow-[8px_8px_0px_0px_#000]' 
          : 'bg-white text-black hover:bg-red-400 hover:shadow-[4px_4px_0px_0px_#000]'
        }
      `}
    >
      {label} {count !== undefined && `(${count})`}
    </button>
  )

  const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    required = false
  }: {
    label: string
    type?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
  }) => (
    <div className="mb-6">
      <label className="block text-xl font-black uppercase mb-2 text-black">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full p-4 text-lg font-bold border-4 border-black
          bg-white focus:bg-yellow-100 outline-none
          shadow-[4px_4px_0px_0px_#000] focus:shadow-[6px_6px_0px_0px_#000]
          transition-all duration-200
        "
      />
    </div>
  )

  const Textarea = ({
    label,
    value,
    onChange,
    required = false
  }: {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    required?: boolean
  }) => (
    <div className="mb-6">
      <label className="block text-xl font-black uppercase mb-2 text-black">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        required={required}
        rows={4}
        className="
          w-full p-4 text-lg font-bold border-4 border-black
          bg-white focus:bg-yellow-100 outline-none resize-none
          shadow-[4px_4px_0px_0px_#000] focus:shadow-[6px_6px_0px_0px_#000]
          transition-all duration-200
        "
      />
    </div>
  )

  const Button = ({
    onClick,
    children,
    variant = 'primary',
    disabled = false,
    type = 'button'
  }: {
    onClick?: () => void
    children: React.ReactNode
    variant?: ButtonVariant
    disabled?: boolean
    type?: 'button' | 'submit'
  }) => {
    const variants = {
      primary: 'bg-green-400 hover:bg-green-500',
      danger: 'bg-red-400 hover:bg-red-500',
      secondary: 'bg-blue-400 hover:bg-blue-500',
      warning: 'bg-orange-400 hover:bg-orange-500'
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={`
          px-6 py-3 text-lg font-black uppercase tracking-wider
          border-4 border-black text-black transition-all duration-200
          shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
        `}
      >
        {children}
      </button>
    )
  }

  const MessageCard = ({ message }: { message: ContactMessage }) => (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-black uppercase">{message.name}</h3>
          <p className="text-lg font-bold text-gray-700">{message.email}</p>
          {message.phone && <p className="text-lg font-bold text-gray-700">{message.phone}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <span className={`
            px-3 py-1 text-sm font-black uppercase border-2 border-black
            ${message.isRead ? 'bg-gray-300' : 'bg-yellow-300'}
          `}>
            {message.isRead ? 'READ' : 'UNREAD'}
          </span>
          <span className={`
            px-3 py-1 text-sm font-black uppercase border-2 border-black
            ${message.responded ? 'bg-green-300' : 'bg-orange-300'}
          `}>
            {message.responded ? 'RESPONDED' : 'PENDING'}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-lg font-bold bg-gray-100 p-4 border-2 border-black">
          {message.message}
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm font-bold text-gray-600">
          {new Date(message.createdAt).toLocaleDateString()} • {message.source?.toUpperCase() || 'WEBSITE'}
        </div>
        <div className="flex gap-2">
          {!message.isRead && (
            <Button
              variant="secondary"
              onClick={() => handleMessageAction(message.id, 'read')}
              disabled={loading}
            >
              MARK READ
            </Button>
          )}
          {!message.responded && (
            <Button
              variant="warning"
              onClick={() => handleMessageAction(message.id, 'responded')}
              disabled={loading}
            >
              MARK RESPONDED
            </Button>
          )}
          <Button
            variant="danger"
            onClick={() => handleMessageAction(message.id, 'delete')}
            disabled={loading}
          >
            DELETE
          </Button>
        </div>
      </div>
    </div>
  )

  const Pagination = () => (
    <div className="flex justify-center gap-2 mt-8">
      <Button
        variant="secondary"
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1 || loading}
      >
        ← PREV
      </Button>
      <div className="px-6 py-3 bg-black text-white font-black text-lg border-4 border-black">
        {currentPage} / {totalPages}
      </div>
      <Button
        variant="secondary"
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages || loading}
      >
        NEXT →
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-6xl font-black uppercase tracking-wider mb-4 text-black">
          ADMIN PANEL
        </h1>
        <div className="h-2 bg-black"></div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="mb-8 p-4 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <p className="text-xl font-black uppercase text-black">{notification}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 mb-8">
        <TabButton 
          id="info" 
          label="CONTACT INFO" 
          active={activeTab === 'info'} 
          onClick={() => {
            setActiveTab('info')
            setCurrentPage(1)
          }} 
        />
        <TabButton 
          id="messages" 
          label="MESSAGES" 
          count={stats.total} 
          active={activeTab === 'messages'} 
          onClick={() => {
            setActiveTab('messages')
            setCurrentPage(1)
          }} 
        />
      </div>

      {/* Loading Overlay */}
      {loading && (
    null
      )}

      {/* Contact Info Tab */}
      {activeTab === 'info' && (
        <div className="bg-gray-50 border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000]">
          <h2 className="text-3xl font-black uppercase mb-8">EDIT CONTACT INFORMATION</h2>
          
          <form onSubmit={handleContactInfoSubmit}>
            <Input
              label="EMAIL ADDRESS"
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
              required
            />
            
            <Input
              label="PHONE NUMBER"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
              required
            />
            
            <Input
              label="WHATSAPP NUMBER"
              value={contactInfo.whatsapp}
              onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})}
            />
            
            <Textarea
              label="ADDRESS"
              value={contactInfo.address}
              onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
              required
            />
            
            <Button type="submit" disabled={loading}>
              {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </Button>
          </form>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-400 border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
              <p className="text-2xl font-black text-black">{stats.total}</p>
              <p className="text-lg font-black uppercase text-black">TOTAL</p>
            </div>
            <div className="bg-yellow-400 border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
              <p className="text-2xl font-black text-black">{stats.unread}</p>
              <p className="text-lg font-black uppercase text-black">UNREAD</p>
            </div>
            <div className="bg-green-400 border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
              <p className="text-2xl font-black text-black">{stats.responded}</p>
              <p className="text-lg font-black uppercase text-black">RESPONDED</p>
            </div>
            <div className="bg-orange-400 border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
              <p className="text-2xl font-black text-black">{stats.pending}</p>
              <p className="text-lg font-black uppercase text-black">PENDING</p>
            </div>
          </div>

          {/* Messages List */}
          <div>
            <h2 className="text-3xl font-black uppercase mb-6">CONTACT MESSAGES</h2>
            
            {messages.length === 0 ? (
              <div className="bg-gray-100 border-4 border-black p-8 text-center shadow-[4px_4px_0px_0px_#000]">
                <p className="text-2xl font-black uppercase">NO MESSAGES FOUND</p>
              </div>
            ) : (
              <>
                {messages.map(message => (
                  <MessageCard key={message.id} message={message} />
                ))}
                <Pagination />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminContactPage