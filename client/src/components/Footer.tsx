import React from "react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 mb-1 md:mb-0">
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} MedVerify</p>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-xs text-[#0066CC] hover:text-blue-700">Privacy</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-xs text-[#0066CC] hover:text-blue-700">Terms</a>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Status:</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
