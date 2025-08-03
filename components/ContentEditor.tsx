'use client';
import { useState } from 'react';
import { updateContent } from '@/actions/content';

type ContentType = 'about' | 'policies';

export default function ContentEditor({
  type,
  initialContent
}: {
  type: ContentType;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage(null);
    
    const result = await updateContent(type, content);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Content saved successfully!' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save' });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="neo-brutalism-box bg-white p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 capitalize">{type}</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-[300px] p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
      />
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-6 py-3 font-bold border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] 
            ${isSubmitting ? 'bg-gray-400' : 'bg-green-400 hover:bg-green-500'}`}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        
        {message && (
          <span className={`px-4 py-2 font-bold ${
            message.type === 'success' 
              ? 'bg-green-200 text-green-800' 
              : 'bg-red-200 text-red-800'
          }`}>
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}