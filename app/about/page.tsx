"use client"
import { useEffect, useState } from 'react'
import { getContent } from '@/actions/content'
import { ContentDisplay } from '@/components/ContentDisplay'

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const currentYear = new Date().getFullYear()

  // Default content if none exists
  const defaultAboutContent = `
    <p class="font-medium">
      We're a passionate team dedicated to creating simple, effective solutions that make a difference in people's everyday lives.
    </p>
    
    <h2 class="mb-4 mt-8 text-xl font-black uppercase text-black">Our Story</h2>
    <p class="font-medium">
      Founded in 2020, we started as a small garage operation and have grown into a trusted brand serving customers worldwide, 
      while maintaining our commitment to quality and innovation.
    </p>

    <h2 class="mb-4 mt-8 text-xl font-black uppercase text-black">Our Values</h2>
    <ul class="space-y-4">
      <li class="flex items-start">
        <span class="mr-3 flex-shrink-0 rounded-full border-2 border-black bg-yellow-400 p-1">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span class="font-bold">Quality craftsmanship</span>
      </li>
      <li class="flex items-start">
        <span class="mr-3 flex-shrink-0 rounded-full border-2 border-black bg-yellow-400 p-1">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span class="font-bold">Honest business practices</span>
      </li>
      <li class="flex items-start">
        <span class="mr-3 flex-shrink-0 rounded-full border-2 border-black bg-yellow-400 p-1">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span class="font-bold">Customer-first approach</span>
      </li>
    </ul>
  `

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setIsLoading(true)
        const content = await getContent()
        // Use fetched content if available, otherwise use default
        setAboutContent(content.about?.content || defaultAboutContent)
      } catch (error) {
        console.error('Failed to fetch about content:', error)
        setAboutContent(defaultAboutContent)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAboutContent()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading about page...</p>
        </div>
      </div>
    )
  }

  return (
    <ContentDisplay 
      title="About Our Company"
      content={aboutContent}
      currentYear={currentYear}
    />
  )
}