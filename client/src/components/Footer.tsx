import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 mb-4 md:mb-0">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} MedVerify</p>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-sm text-[#0066CC] hover:text-blue-700">Privacy Policy</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-sm text-[#0066CC] hover:text-blue-700">Terms of Use</a>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">System Status:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
