import React from "react";
import type { MedicationDetection } from "@/lib/types";

interface MedicationVerificationProps {
  detection: MedicationDetection | null;
  isLoading: boolean;
  isPending: boolean;
  onVerify: (isCorrect: boolean) => void;
}

const MedicationVerification: React.FC<MedicationVerificationProps> = ({
  detection,
  isLoading,
  isPending,
  onVerify
}) => {
  const handleConfirm = () => onVerify(true);
  const handleDeny = () => onVerify(false);
  
  // Calculate confidence percentage for display
  const confidencePercent = detection?.confidence 
    ? Math.round(detection.confidence * 100) 
    : 0;
  
  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-2 bg-[#0066CC] text-white">
        <h2 className="font-sfpro font-medium text-lg">Medication Verification</h2>
      </div>
      
      <div className="p-3 flex-1 flex flex-col justify-center overflow-y-auto">
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="loading-spinner mb-2"></div>
            <p className="text-gray-500 text-sm text-center">Processing label...</p>
          </div>
        )}
        
        {/* Detected medication state */}
        {!isLoading && detection && (
          <div className="flex flex-col h-full">
            <div className="bg-blue-50 border-l-4 border-[#0066CC] p-2 mb-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#0066CC]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-700">
                    Verify this medication matches what you expect.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Detected Medication</h3>
              <div className="bg-gray-100 rounded-lg p-3 mb-2">
                <p className="text-xl font-bold font-sfpro text-[#0066CC]">
                  {detection.medicationName || "Unknown Medication"}
                </p>
              </div>
              <div className="inline-flex items-center space-x-1 text-xs text-gray-500">
                <span>Confidence:</span>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#0066CC]" 
                    style={{ width: `${confidencePercent}%` }}
                  ></div>
                </div>
                <span>{confidencePercent}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 mt-auto">
              <button 
                className="bg-[#DC3545] hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDeny}
                disabled={isPending}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Incorrect</span>
              </button>
              
              <button 
                className="bg-[#28A745] hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirm}
                disabled={isPending}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Correct</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && !detection && (
          <div className="py-4 flex flex-col items-center justify-center text-center h-full">
            <div className="bg-gray-100 rounded-full p-3 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Medication Detected</h3>
            <p className="text-xs text-gray-500 mx-auto">Position a syringe in view and click Scan</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MedicationVerification;
