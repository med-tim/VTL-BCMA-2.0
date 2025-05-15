import React from "react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={`bg-white ${className}`}>
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-8">
          <p className="text-[10px] text-gray-500">© {new Date().getFullYear()} MedVerify | v1.0.0</p>
          <div className="flex items-center">
            <span className="text-[10px] text-gray-500">Cameras Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
