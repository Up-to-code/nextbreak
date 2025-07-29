"use client"
import React, { useState } from 'react';
import { Search, Star, ChevronDown } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  level: string;
  category: string;
  backgroundColor: string;
  borderColor: string;
}

const CourseListingApp: React.FC = () => {
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');

  const courses: Course[] = [
    {
      id: 1,
      title: "BACKEND MASTERY",
      description: "Master Node.JS & Django: build REST APIs with Node.js, GraphQL APIs, add Authentication, use MongoDB, SQL & much more.",
      image: "🔙",
      price: 1800,
      rating: 4.5,
      reviewCount: 12453,
      level: "beginner",
      category: "backend",
      backgroundColor: "bg-green-400",
      borderColor: "border-green-600"
    },
    {
      id: 2,
      title: "JAVASCRIPT MASTERY",
      description: "The modern JavaScript course for everyone! Master JavaScript with projects, challenges and theory. Many courses in one!",
      image: "JS",
      price: 1510,
      rating: 4.6,
      reviewCount: 176839,
      level: "advanced",
      category: "javascript",
      backgroundColor: "bg-yellow-300",
      borderColor: "border-yellow-600"
    },
    {
      id: 3,
      title: "CONQUER YOUR HEALTH WITH KETO",
      description: "Keto Nutrition Certified Health Coach Specialized in the Ketogenic Diet, Ketosis, Macros and Intermittent Fasting",
      image: "🥗",
      price: 1800,
      rating: 4.3,
      reviewCount: 8945,
      level: "beginner",
      category: "health",
      backgroundColor: "bg-red-400",
      borderColor: "border-red-600"
    },
    {
      id: 4,
      title: "PYTHON WITH DJANGO",
      description: "Learn how to build web applications and websites with Python and the Django framework",
      image: "🐍",
      price: 1200,
      rating: 4.4,
      reviewCount: 15672,
      level: "intermediate",
      category: "python",
      backgroundColor: "bg-blue-400",
      borderColor: "border-blue-600"
    },
    {
      id: 5,
      title: "JAVASCRIPT FUNDAMENTALS",
      description: "This is a course on js and the beginner friendly approach to modern web development",
      image: "⚡",
      price: 1100,
      rating: 4.2,
      reviewCount: 5432,
      level: "beginner",
      category: "javascript",
      backgroundColor: "bg-purple-400",
      borderColor: "border-purple-600"
    }
  ];

  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);

  const handlePriceFilter = (price: string) => {
    setSelectedPrice(price);
    filterCourses(price, selectedLevel);
  };

  const handleLevelFilter = (level: string) => {
    setSelectedLevel(level);
    filterCourses(selectedPrice, level);
  };

  const filterCourses = (priceFilter: string, levelFilter: string) => {
    let filtered = courses;

    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'free':
          filtered = filtered.filter(course => course.price === 0);
          break;
        case 'paid':
          filtered = filtered.filter(course => course.price > 0);
          break;
        case 'under500':
          filtered = filtered.filter(course => course.price < 500);
          break;
        case 'under1000':
          filtered = filtered.filter(course => course.price < 1000);
          break;
      }
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => course.level === levelFilter);
    }

    setFilteredCourses(filtered);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-black text-black" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-5 h-5 fill-black text-black opacity-50" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-400 stroke-2" />);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-72 bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] p-6">
            <h2 className="text-xl font-black mb-6 uppercase tracking-tight">SHOWING ALL COURSES</h2>
            
            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-black text-base mb-3 uppercase tracking-wide">PRICE</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'ALL' },
                  { value: 'free', label: 'FREE' },
                  { value: 'paid', label: 'PAID' },
                  { value: 'under500', label: 'UNDER ₹500' },
                  { value: 'under1000', label: 'UNDER ₹1000' },
                  { value: 'custom', label: 'CUSTOM' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="price"
                        value={option.value}
                        checked={selectedPrice === option.value}
                        onChange={(e) => handlePriceFilter(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 border-2 border-black ${selectedPrice === option.value ? 'bg-black' : 'bg-white'} transition-all duration-200 group-hover:shadow-[2px_2px_0px_0px_#000]`}></div>
                    </div>
                    <span className="ml-2 font-bold uppercase tracking-wide text-xs">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <h3 className="font-black text-base mb-3 uppercase tracking-wide">LEVEL</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'ALL' },
                  { value: 'beginner', label: 'BEGINNER' },
                  { value: 'intermediate', label: 'INTERMEDIATE' },
                  { value: 'advanced', label: 'ADVANCED' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="level"
                        value={option.value}
                        checked={selectedLevel === option.value}
                        onChange={(e) => handleLevelFilter(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 border-2 border-black ${selectedLevel === option.value ? 'bg-black' : 'bg-white'} transition-all duration-200 group-hover:shadow-[2px_2px_0px_0px_#000]`}></div>
                    </div>
                    <span className="ml-2 font-bold uppercase tracking-wide text-xs">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Dropdown */}
            <div className="flex justify-end mb-6">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border-3 border-black shadow-[3px_3px_0px_0px_#000] px-4 py-2 pr-10 appearance-none cursor-pointer font-bold uppercase tracking-wide text-xs hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200"
                >
                  <option value="relevance">SORT BY RELEVANCE</option>
                  <option value="price-low">PRICE: LOW TO HIGH</option>
                  <option value="price-high">PRICE: HIGH TO LOW</option>
                  <option value="rating">HIGHEST RATED</option>
                  <option value="newest">NEWEST</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-black pointer-events-none stroke-[2px]" />
              </div>
            </div>

            {/* Course Grid */}
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-200 overflow-hidden group">
                  <div className="flex">
                    {/* Course Image/Icon */}
                    <div className={`w-48 h-32 ${course.backgroundColor} border-r-3 border-black flex items-center justify-center text-black text-4xl font-black transform group-hover:scale-105 transition-transform duration-300`}>
                      {course.image}
                    </div>
                    
                    {/* Course Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-black mb-3 uppercase tracking-tight leading-tight">{course.title}</h3>
                          <p className="text-gray-800 mb-4 leading-relaxed font-medium text-base">{course.description}</p>
                          
                          <div className="flex items-center mb-3">
                            <div className="flex mr-2">
                              {renderStars(course.rating)}
                            </div>
                            <span className="font-bold text-sm">
                              ({course.reviewCount.toLocaleString()})
                            </span>
                          </div>
                          
                          <div className="flex items-center font-bold text-sm">
                            <span className="bg-yellow-300 border-2 border-black px-2 py-1 uppercase tracking-wide text-xs">
                              {course.reviewCount.toLocaleString()} STUDENTS
                            </span>
                            <span className="mx-3 text-lg">•</span>
                            <span className="bg-pink-300 border-2 border-black px-2 py-1 uppercase tracking-wide text-xs">
                              {course.level}
                            </span>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right ml-6">
                          <div className="bg-green-300 border-3 border-black shadow-[3px_3px_0px_0px_#000] p-3 transform hover:scale-105 transition-transform duration-200">
                            <div className="text-2xl font-black text-black">
                              ₹{course.price}
                            </div>
                            {course.originalPrice && (
                              <div className="text-sm font-bold text-gray-600 line-through">
                                ₹{course.originalPrice}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="bg-black text-white border-3 border-black shadow-[4px_4px_0px_0px_#666] px-4 py-2 text-lg font-black hover:shadow-[6px_6px_0px_0px_#666] transition-all duration-200 cursor-pointer">
                1
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseListingApp;