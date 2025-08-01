"use client"
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Comment, Product } from '@prisma/client';

type CommentWithUser = Comment & {
  user: {
    name: string;
    image: string | null;
  };
};

interface CommentProps {
  product: Product & {
    comments: CommentWithUser[];
  };
  onAddComment: (content: string) => Promise<void>;
}

export const ProductComments = ({ product, onAddComment }: CommentProps) => {
  const { data: session } = useSession();
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      await onAddComment(commentContent);
      setCommentContent('');
    } catch (err) {
      setError('Failed to post comment');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-4 border-black p-6 mt-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-3xl font-black text-black mb-6 tracking-wider">
        CUSTOMER REVIEWS
      </h2>

      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                src={session.user?.image || '/default-avatar.jpg'}
                alt={session.user?.name || 'User'}
                className="h-12 w-12 rounded-full border-2 border-black"
              />
            </div>
            <div className="flex-1">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="w-full border-4 border-black p-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                maxLength={500}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {commentContent.length}/500 characters
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !commentContent.trim()}
                  className="bg-black text-white border-4 border-black px-6 py-2 font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'POSTING...' : 'POST REVIEW'}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-yellow-100 border-4 border-black">
          <p className="font-bold">
            Please sign in to leave a review.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {product.comments.length > 0 ? (
          product.comments.map((comment) => (
            <div key={comment.id} className="border-2 border-black p-4">
              <div className="flex items-center mb-3">
                <img
                  src={comment.user.image || '/default-avatar.jpg'}
                  alt={comment.user.name}
                  className="h-10 w-10 rounded-full border-2 border-black mr-3"
                />
                <div>
                  <h4 className="font-bold">{comment.user.name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <p className="whitespace-pre-line">{comment.content}</p>
            </div>
          ))
        ) : (
          <div className="border-2 border-black p-4 text-center">
            <p className="font-bold">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
};