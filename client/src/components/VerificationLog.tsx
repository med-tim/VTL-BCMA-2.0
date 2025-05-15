import React from "react";
import { format } from "date-fns";
import type { Verification } from "@/lib/types";

interface VerificationLogProps {
  verifications: Verification[];
}

const VerificationLog: React.FC<VerificationLogProps> = ({ verifications }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return format(date, "h:mm a");
    }
    return `Yesterday, ${format(date, "h:mm a")}`;
  };

  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-[#0066CC] text-white flex justify-between items-center">
        <h2 className="font-sfpro font-medium text-lg">Recent Verifications</h2>
        <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">Last 24 hours</span>
      </div>
      
      <div className="divide-y divide-gray-200">
        {verifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No recent verifications found
          </div>
        ) : (
          verifications.map((verification) => (
            <div key={verification.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full ${verification.isCorrect ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                    {verification.isCorrect ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#28A745]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#DC3545]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{verification.medicationName}</h4>
                  <p className="text-xs text-gray-500">
                    {verification.isCorrect ? 'Verified' : 'Rejected'} by {verification.verifiedBy}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{formatTime(verification.timestamp)}</span>
            </div>
          ))
        )}
      </div>
      
      {verifications.length > 0 && (
        <div className="p-3 bg-gray-50 text-center">
          <a href="#" className="text-[#0066CC] text-sm font-medium hover:text-blue-700">View All Verifications →</a>
        </div>
      )}
    </section>
  );
};

export default VerificationLog;
