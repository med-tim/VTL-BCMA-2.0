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
    <section className="w-full max-w-full flex flex-col">
      <div className="text-center">
        <h2 className="text-2xl font-medium text-gray-900 mb-6">Medication Verification</h2>
      </div>
      
      <div className="flex-1 flex flex-col justify-center overflow-y-auto">
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-[#0066CC] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-base">Processing medication label...</p>
          </div>
        )}
        
        {/* Detected medication state */}
        {!isLoading && detection && (
          <div className="flex flex-col h-full">
            <div className="bg-blue-50 border-l-4 border-[#0066CC] p-4 mb-6">
              <p className="text-gray-700">Camera active and processing medication labels in background.</p>
            </div>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center mb-3">
                <span className="text-sm text-gray-600 mr-2">Confidence:</span>
                <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#0066CC]" 
                    style={{ width: `${confidencePercent}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 ml-2">{confidencePercent}%</span>
              </div>
              
              <div className="bg-white rounded-xl border-2 border-[#0066CC] p-6 mb-6 shadow-lg">
                <h3 className="text-base font-medium text-gray-500 mb-2">DETECTED MEDICATION</h3>
                <p className="text-3xl font-bold text-[#0066CC]">
                  {detection.medicationName || "Unknown Medication"}
                </p>
              </div>
              
              <p className="text-base text-gray-600 mb-8">Is this medication identification correct?</p>
            </div>
            
            <div className="flex items-center justify-center space-x-6">
              <button 
                className="bg-[#DC3545] hover:bg-red-600 text-white px-6 py-3 rounded-lg text-base font-medium 
                         flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDeny}
                disabled={isPending}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Incorrect</span>
              </button>
              
              <button 
                className="bg-[#28A745] hover:bg-green-600 text-white px-6 py-3 rounded-lg text-base font-medium 
                         flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirm}
                disabled={isPending}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Correct</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && !detection && (
          <div className="py-12 flex flex-col items-center justify-center text-center h-full">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Medication Detected</h3>
            <p className="text-base text-gray-600 mb-6 max-w-md">
              The system is waiting for a medication to scan. Place a medication in the camera's view.
            </p>
            <div className="bg-blue-50 border-l-4 border-[#0066CC] p-4 max-w-md text-left">
              <p className="text-gray-700">Camera is active and processing medication labels in the background.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MedicationVerification;
