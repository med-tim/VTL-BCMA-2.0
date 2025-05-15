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
    <section className="h-full flex flex-col border-l border-gray-100">
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900">Recent Verifications</h2>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {verifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 h-full flex items-center justify-center">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">No verifications yet</p>
            </div>
          </div>
        ) : (
          <div className="px-3">
            {verifications.map((verification) => (
              <div key={verification.id} className="py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className={`w-8 h-8 rounded-full ${verification.isCorrect ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                      {verification.isCorrect ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#28A745]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#DC3545]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{verification.medicationName}</h4>
                    <p className="text-xs text-gray-500 flex items-center">
                      {verification.isCorrect ? 'Verified' : 'Rejected'} • {formatTime(verification.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default VerificationLog;
