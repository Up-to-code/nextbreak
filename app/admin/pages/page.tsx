'use client';

import { useState } from 'react';
import { updateContent } from '@/actions/content';

type ContentType = 'about' | 'policies';

export default function ContentEditor({
  initialAbout = '',
  initialPolicies = ''
}: {
  initialAbout?: string;
  initialPolicies?: string;
}) {
  const [activeTab, setActiveTab] = useState<ContentType>('about');
  const [contents, setContents] = useState({
    about: initialAbout || '',
    policies: initialPolicies || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const currentContent = contents[activeTab];
  const initialContent = activeTab === 'about' ? initialAbout : initialPolicies;
  const isUnchanged = currentContent.trim() === (initialContent || '').trim();

  const handleSubmit = async () => {
    if (isUnchanged) {
      setMessage({ 
        type: 'error', 
        text: 'No changes detected' 
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const result = await updateContent(activeTab, currentContent);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Content saved successfully!' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Failed to save content' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (value: string) => {
    setContents(prev => ({
      ...prev,
      [activeTab]: value
    }));
  };

  return (
    <div className="neo-brutalism-box  p-6 mb-8">
      {/* Tabs */}
      <div className="flex border-b-4 border-black mb-4">
        <button
          className={`px-4 py-2 font-bold border-b-4 -mb-[4px] mr-2 transition-all
            ${
              activeTab === 'about'
                ? 'border-black bg-[#FFD166]'
                : 'border-transparent hover:bg-gray-100'
            }`}
          onClick={() => setActiveTab('about')}
        >
          About Page
        </button>
        <button
          className={`px-4 py-2 font-bold border-b-4 -mb-[4px] transition-all
            ${
              activeTab === 'policies'
                ? 'border-black bg-[#FFD166]'
                : 'border-transparent hover:bg-gray-100'
            }`}
          onClick={() => setActiveTab('policies')}
        >
          Policies Page
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4 capitalize">{activeTab} Content</h2>
      
      <textarea
        value={currentContent}
        onChange={(e) => handleContentChange(e.target.value)}
        className="w-full min-h-[300px] p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
        placeholder={`Enter your ${activeTab} content here...`}
      />
      
      <div className="flex justify-between items-center mt-4 gap-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || isUnchanged}
          className={`px-6 py-3 font-bold border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-colors
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : isUnchanged
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-400 hover:bg-green-500 active:shadow-none active:translate-x-[5px] active:translate-y-[5px]'
            }`}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
        
        {message && (
          <span className={`px-4 py-2 font-bold border-4 border-black ${
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