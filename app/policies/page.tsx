"use client"
import { useEffect, useState } from 'react';
import { getContent } from '@/actions/content';
import { ContentDisplay } from '@/components/ContentDisplay';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  // Default content if none exists
  const defaultPoliciesContent = `
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Our Policies</h1>
      <p class="mb-4">
        At our company, we are committed to transparency and protecting your rights.
        This document outlines our policies regarding data privacy, terms of service,
        and acceptable use of our platform.
      </p>
      
      <div class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">Privacy Policy</h2>
        <p>
          We respect your privacy and are committed to protecting your personal data.
          We collect only necessary information to provide our services and never share
          your data with third parties without your consent.
        </p>
      </div>
      
      <div class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">Terms of Service</h2>
        <p>
          By using our services, you agree to abide by our terms of service. These include
          restrictions on illegal activities, respecting intellectual property rights,
          and maintaining the security of your account.
        </p>
      </div>
      
      <div class="bg-gray-100 p-4 border-l-4 border-blue-500 mt-8">
        <p class="text-sm">
          <strong>Note:</strong> This is default content. Please update your policies
          through the admin dashboard.
        </p>
        <p class="text-sm mt-2">© {currentYear} Your Company Name. All rights reserved.</p>
      </div>
    </div>
  `;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const contentData = await getContent();
        setPolicies(contentData.policies?.content || defaultPoliciesContent);
      } catch (error) {
        console.error('Failed to fetch policies:', error);
        setPolicies(defaultPoliciesContent);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading policies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <ContentDisplay content={policies} title="Policies" currentYear={currentYear} />
    </div>
  );
}