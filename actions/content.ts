'use server';
import { prisma } from '@/lib';

// Helper to handle model-specific operations
const handleContentUpdate = async (
  type: 'about' | 'policies',
  content: string
) => {
  if (type === 'about') {
    const existing = await prisma.about.findFirst();
    if (existing) {
      return prisma.about.update({
        where: { id: existing.id },
        data: { content },
      });
    }
    return prisma.about.create({ data: { content } });
  } else {
    const existing = await prisma.policies.findFirst();
    if (existing) {
      return prisma.policies.update({
        where: { id: existing.id },
        data: { content },
      });
    }
    return prisma.policies.create({ data: { content } });
  }
};

export const getContent = async () => {
  try {
    const [about, policies] = await Promise.all([
      prisma.about.findFirst(),
      prisma.policies.findFirst()
    ]);
    return { about, policies };
  } catch (error) {
    throw new Error('Failed to fetch content');
  }
};

export const updateContent = async (type: 'about' | 'policies', content: string) => {
  try {
    await handleContentUpdate(type, content);
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update content' };
  }
};