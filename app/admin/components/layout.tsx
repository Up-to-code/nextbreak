'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface MenuItem {
  name: string;
  icon: string;
  href: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  
  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: '📊', href: '/admin' },
    { name: 'Orders', icon: '📦', href: '/admin/orders' },
    { name: 'Products', icon: '🛍️', href: '/admin/products' },
    { name: 'Users', icon: '👥', href: '/admin/users' },
    { name: 'Analytics', icon: '📈', href: '/admin/analytics' },
   ];

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile, auto-open on desktop
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when clicking on mobile menu item
  const handleMobileMenuClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-black z-30 md:hidden flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 border-2 border-black bg-[#4ECDC4] hover:bg-[#45b7b8] transition-colors rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg border-2 border-black bg-[#4ECDC4] flex items-center justify-center mr-2">
            <span className="font-bold text-sm">NB</span>
          </div>
          <h1 className="text-lg font-bold">NeoBrut Admin</h1>
        </div>
      </div>

      {/* Sidebar */}
      <div 
        className={`
          ${isMobile ? 'fixed' : 'relative'} 
          ${sidebarOpen ? (isMobile ? 'translate-x-0' : 'w-64') : (isMobile ? '-translate-x-full' : 'w-16')} 
          ${isMobile ? 'w-64 h-full' : 'min-h-screen'}
          bg-white border-r-2 border-black transition-all duration-300 ease-in-out z-50
          ${isMobile ? 'top-0 left-0' : ''}
        `}
      >
        {/* Desktop Header / Mobile Header */}
        <div className={`p-4 border-b-2 border-black ${isMobile ? 'mt-0' : ''}`}>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg border-2 border-black bg-[#4ECDC4] flex items-center justify-center mr-3 flex-shrink-0">
              <span className="font-bold">NB</span>
            </div>
            {(sidebarOpen || !isMobile) && (
              <h1 className="text-xl font-bold whitespace-nowrap">NeoBrut Admin</h1>
            )}
            
            {/* Mobile close button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-auto p-1 hover:bg-gray-100 rounded"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 px-2 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={handleMobileMenuClick}
                    className={`
                      flex items-center p-3 rounded-lg font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-[#FFD166] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform translate-x-1 translate-y-1'
                        : 'hover:bg-[#f5f5f5] border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      } 
                      ${(sidebarOpen || isMobile) ? 'justify-start' : 'justify-center'}
                    `}
                  >
                    <span className="text-xl flex-shrink-0" role="img" aria-label={item.name}>
                      {item.icon}
                    </span>
                    {((sidebarOpen && !isMobile) || isMobile) && (
                      <span className="ml-3 whitespace-nowrap">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Desktop Toggle Button */}
        {!isMobile && (
          <div className="p-4 border-t-2 border-black bg-white">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full border-2 border-black bg-[#FF6B6B] hover:bg-[#ff5252] p-2 font-bold flex items-center justify-center transition-all duration-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                  Collapse
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen ${isMobile ? 'pt-16' : ''}`}>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}