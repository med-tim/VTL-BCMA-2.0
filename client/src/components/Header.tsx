import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center space-x-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-[#0066CC]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M17 3L21 7L7 21L3 17L17 3Z"></path>
              <path d="M15.5 9.5L12.5 12.5"></path>
              <path d="M18 7L15 4"></path>
            </svg>
            <h1 className="text-lg font-semibold font-sfpro text-[#212529]">MedVerify</h1>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
              Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
