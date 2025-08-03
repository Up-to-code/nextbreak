'use server'

import { prisma } from '@/lib'
 import { revalidatePath } from 'next/cache'

 
// Get all carousel items for display
export async function getCarouselItems() {
  try {
    return await prisma.carousel.findMany({
      select: { id: true, image: true, link: true }
    })
  } catch (error) {
    console.error('Fetch items error:', error)
    return []
  }
}

// Admin: Get all carousel items
export async function getAllCarouselItems() {
  try {
    return await prisma.carousel.findMany()
  } catch (error) {
    console.error('Fetch all items error:', error)
    return []
  }
}

// Admin: Get single item
export async function getCarouselItem(id: string) {
  try {
    return await prisma.carousel.findUnique({ where: { id } })
  } catch (error) {
    console.error('Fetch item error:', error)
    return null
  }
}

// Admin: Create new item
export async function createCarouselItem(data: {
  image: string
  link: string
}) {
  try {
    if (!data.image.trim() || !data.link.trim()) {
      return { error: 'Image and link are required' }
    }

    const result = await prisma.carousel.create({
      data: {
        image: data.image,
        link: data.link
      }
    })

    revalidatePaths()
    return { success: true, data: result }
  } catch (error) {
    console.error('Create error:', error)
    return { error: 'Failed to create item' }
  }
}

// Admin: Update item
export async function updateCarouselItem(
  id: string,
  data: {
    image?: string
    link?: string
  }
) {
  try {
    const result = await prisma.carousel.update({
      where: { id },
      data: {
        ...(data.image && { image: data.image }),
        ...(data.link && { link: data.link })
      }
    })

    revalidatePaths()
    return { success: true, data: result }
  } catch (error) {
    console.error('Update error:', error)
    return { error: 'Failed to update item' }
  }
}

// Admin: Delete item
export async function deleteCarouselItem(id: string) {
  try {
    await prisma.carousel.delete({ where: { id } })
    revalidatePaths()
    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { error: 'Failed to delete item' }
  }
}

// Revalidate relevant paths
function revalidatePaths() {
  revalidatePath('/')
  revalidatePath('/admin/carousel')
}
export const getCarouselImages = async (): Promise<string[]> => {
  try {
    const items = await prisma.carousel.findMany({
      select: { image: true },
      orderBy: { createdAt: 'asc' }
    })
    return items.map(item => item.image)
  } catch (error) {
    console.error('Failed to fetch carousel images:', error)
    return []
  }
}