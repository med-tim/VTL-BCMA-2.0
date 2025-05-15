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
    <section className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-2 bg-[#0066CC] text-white flex justify-between items-center">
        <h2 className="font-sfpro font-medium text-sm">Recent Verifications</h2>
        <span className="text-xs bg-white bg-opacity-20 px-1.5 py-0.5 rounded">Last 24h</span>
      </div>
      
      <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
        {verifications.length === 0 ? (
          <div className="p-3 text-center text-gray-500 text-xs h-full flex items-center justify-center">
            No recent verifications
          </div>
        ) : (
          verifications.map((verification) => (
            <div key={verification.id} className="p-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <div className={`w-6 h-6 rounded-full ${verification.isCorrect ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                    {verification.isCorrect ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#28A745]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#DC3545]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-900 truncate max-w-[120px]">{verification.medicationName}</h4>
                  <p className="text-[10px] text-gray-500">
                    {verification.isCorrect ? 'Verified' : 'Rejected'} {new Date(verification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {verifications.length > 0 && (
        <div className="p-1 bg-gray-50 text-center text-xs">
          <a href="#" className="text-[#0066CC] font-medium hover:text-blue-700">View All →</a>
        </div>
      )}
    </section>
  );
};

export default VerificationLog;
