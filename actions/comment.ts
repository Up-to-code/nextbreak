// actions/comment.ts
import { prisma } from '@/lib/';
import { auth } from '@/lib/auth';
 
export const addComment = async ({
  productId,
  content,
}: {
  productId: string;
  content: string;
}) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be signed in to post a comment');
  }

  return prisma.comment.create({
    data: {
      content,
      productId,
      userId: session.user.id,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};