import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-10">
          <div className="flex items-center space-x-1.5">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-[#0066CC]" 
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
            <h1 className="text-sm font-medium text-[#212529]">MedVerify</h1>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
              <span className="w-1 h-1 rounded-full bg-green-500 mr-1"></span>
              System Ready
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
