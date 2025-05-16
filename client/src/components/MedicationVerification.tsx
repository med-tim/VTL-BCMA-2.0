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
          <div className="flex flex-col h-full items-center justify-center">
            <div className="text-center max-w-md mb-10">
              <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-100">
                <p className="text-4xl font-bold text-[#0066CC] mb-1">
                  {detection.medicationName || "Unknown Medication"}
                </p>
                <div className="inline-flex items-center mt-2">
                  <span className="text-xs text-gray-500 mr-2">Confidence {confidencePercent}%</span>
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0066CC]" 
                      style={{ width: `${confidencePercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <p className="text-base text-gray-600 mb-8">Is this medication identification correct?</p>
            </div>
            
            <div className="flex items-center justify-center space-x-12">
              {/* Big X button */}
              <button 
                className="bg-white hover:bg-red-50 border-2 border-[#DC3545] text-[#DC3545] w-20 h-20 rounded-full 
                         flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-sm hover:shadow-md"
                onClick={handleDeny}
                disabled={isPending}
                aria-label="Incorrect"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Big check mark button */}
              <button 
                className="bg-white hover:bg-green-50 border-2 border-[#28A745] text-[#28A745] w-20 h-20 rounded-full 
                         flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-sm hover:shadow-md"
                onClick={handleConfirm}
                disabled={isPending}
                aria-label="Correct"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Empty state with scanning animation */}
        {!isLoading && !detection && (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <div className="scanning-animation w-60 h-60 flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-white shadow-sm">
              <div className="w-16 h-16 rounded-full border-2 border-[#0066CC] flex items-center justify-center mb-5" 
                   style={{animation: "scanner-pulse 2s infinite"}}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0066CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.613,10.007 L18.984,10.007 L18.984,5.635 M18.984,5.635 L14.613,5.635 M14.613,5.635 L18.984,10.007 M9.389,13.993 L5.016,13.993 L5.016,18.365 M5.016,18.365 L9.389,18.365 M9.389,18.365 L5.016,13.993 M5.016,10.007 L5.016,5.635 L9.389,5.635 M18.984,13.993 L18.984,18.365 L14.613,18.365" />
                </svg>
              </div>
              <p className="text-lg font-medium text-[#0066CC]">Scanning</p>
              <p className="text-sm text-gray-500 mt-2">Looking for medication labels</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MedicationVerification;
