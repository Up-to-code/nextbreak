'use server'

import { prisma } from '@/lib/'
import { revalidatePath } from 'next/cache'
import type { ContactInfo, ContactMessage } from '@prisma/client'

// Response types
interface BaseResponse {
  success: boolean
  error?: string
}

interface ContactInfoResponse extends BaseResponse {
  data?: ContactInfo
}

interface ContactMessagesResponse extends BaseResponse {
  data?: {
    messages: ContactMessage[]
    totalCount: number
    totalPages: number
    currentPage: number
  }
}

interface MessageStatsResponse extends BaseResponse {
  data?: {
    total: number
    unread: number
    responded: number
    pending: number
  }
}

// Contact Info Actions
export const getContactInfo = async (): Promise<ContactInfoResponse> => {
  try {
    const contactInfo = await prisma.contactInfo.findFirst({
      orderBy: { updatedAt: 'desc' },
    })

    // Return default values if no contact info exists
    if (!contactInfo) {
      return {
        success: true,
        data: {
          id: 0,
          email: '',
          phone: '',
          address: '',
          whatsapp: '',
          updatedAt: new Date()
        }
      }
    }

    return { success: true, data: contactInfo }
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return { success: false, error: 'Failed to fetch contact info' }
  }
}

export const updateContactInfo = async (data: Omit<ContactInfo, 'id' | 'updatedAt'>): Promise<ContactInfoResponse> => {
  try {
    // Upsert contact info (create or update)
    const contactInfo = await prisma.contactInfo.upsert({
      where: { id: 1 }, // Assuming single contact info record with ID 1
      update: {
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        whatsapp: data.whatsapp.trim(),
      },
      create: {
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        whatsapp: data.whatsapp.trim(),
      }
    })

    revalidatePath('/admin/contact')
    return { success: true, data: contactInfo }
  } catch (error) {
    console.error('Error updating contact info:', error)
    return { success: false, error: 'Failed to update contact info' }
  }
}

// Message Actions
export const getContactMessages = async (
  page = 1,
  limit = 10
): Promise<ContactMessagesResponse> => {
  try {
    const skip = (page - 1) * limit
    
    const [messages, totalCount] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count(),
    ])

    return {
      success: true,
      data: {
        messages,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    }
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return { success: false, error: 'Failed to fetch messages' }
  }
}

export const getMessageStats = async (): Promise<MessageStatsResponse> => {
  try {
    const [total, unread, responded] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.contactMessage.count({ where: { responded: true } }),
    ])

    return {
      success: true,
      data: {
        total,
        unread,
        responded,
        pending: total - responded,
      },
    }
  } catch (error) {
    console.error('Error fetching message stats:', error)
    return { success: false, error: 'Failed to fetch statistics' }
  }
}

export const markMessageAsRead = async (id: number): Promise<BaseResponse> => {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    })

    revalidatePath('/admin/contact')
    return { success: true }
  } catch (error) {
    console.error('Error marking message as read:', error)
    return { success: false, error: 'Failed to mark message as read' }
  }
}

export const markMessageAsResponded = async (id: number): Promise<BaseResponse> => {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { responded: true, isRead: true },
    })

    revalidatePath('/admin/contact')
    return { success: true }
  } catch (error) {
    console.error('Error marking message as responded:', error)
    return { success: false, error: 'Failed to mark message as responded' }
  }
}

export const deleteContactMessage = async (id: number): Promise<BaseResponse> => {
  try {
    await prisma.contactMessage.delete({
      where: { id },
    })

    revalidatePath('/admin/contact')
    return { success: true }
  } catch (error) {
    console.error('Error deleting contact message:', error)
    return { success: false, error: 'Failed to delete message' }
  }
}




















 
interface BaseResponse {
  success: boolean
  error?: string
}

interface ContactInfoResponse extends BaseResponse {
  data?: ContactInfo
}

interface SubmitContactResponse extends BaseResponse {
  data?: ContactMessage
}

 
// Submit contact form
export const submitContactForm = async (
  data: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead' | 'responded'>
): Promise<SubmitContactResponse> => {
  try {
    const newMessage = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
        phone: data.phone,
        source: data.source || 'website',
        isRead: false,
        responded: false
      }
    })

    // In a real app, you might want to send email notifications here
    // await sendContactEmailNotification(newMessage)
    
    return { success: true, data: newMessage }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return { success: false, error: 'Failed to submit contact form' }
  }
}