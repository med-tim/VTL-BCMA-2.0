import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoFeed from "@/components/VideoFeed";
import MedicationVerification from "@/components/MedicationVerification";
import VerificationLog from "@/components/VerificationLog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MedicationDetection, Verification } from "@/lib/types";

const Home: React.FC = () => {
  const { toast } = useToast();
  const [currentDetection, setCurrentDetection] = React.useState<MedicationDetection | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Fetch recent verifications
  const { data: verifications = [] } = useQuery<Verification[]>({
    queryKey: ['/api/verifications'],
  });

  // Mutation for verifying medication
  const verifyMutation = useMutation({
    mutationFn: async ({ id, isCorrect }: { id: string; isCorrect: boolean }) => {
      return apiRequest('POST', '/api/verifications', { 
        detectionId: id, 
        isCorrect 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/verifications'] });
      setCurrentDetection(null);
    },
    onError: (error) => {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Handle video frame processing
  const processVideoFrame = async (imageData: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const response = await apiRequest('POST', '/api/detect', { imageData });
      const data = await response.json();
      
      if (data && data.medications && data.medications.length > 0) {
        setCurrentDetection(data.medications[0]);
      } else {
        setCurrentDetection(null);
      }
    } catch (error) {
      console.error('Detection error:', error);
      toast({
        title: "Detection failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle manual scan
  const handleManualScan = (imageData: string) => {
    processVideoFrame(imageData);
  };

  // Handle verification decisions
  const handleVerification = (isCorrect: boolean) => {
    if (!currentDetection) return;
    
    verifyMutation.mutate({ 
      id: currentDetection.id, 
      isCorrect 
    });
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Header />
      
      <main className="flex-1 w-full mx-auto flex">
        {/* Main medication verification panel (75%) */}
        <div className="w-3/4 h-full border-r border-gray-200 flex items-center justify-center p-8">
          <div className="w-full max-w-xl">
            <MedicationVerification 
              detection={currentDetection}
              isLoading={isProcessing}
              isPending={verifyMutation.isPending}
              onVerify={handleVerification}
            />
            
            {/* Manual scan button at the bottom */}
            <div className="mt-8 text-center">
              <button 
                className="bg-[#0066CC] hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium 
                           flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => processVideoFrame('backend-image-data')}
                disabled={isProcessing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Process Next Medication</span>
              </button>
              
              <p className="text-xs text-gray-500 mt-2">
                Camera active and processing images in background
              </p>
            </div>
          </div>
        </div>
        
        {/* Verification log panel (25%) */}
        <div className="w-1/4 h-full overflow-hidden">
          <VerificationLog verifications={verifications} />
        </div>
      </main>
      
      <Footer className="py-1 border-t border-gray-200" />
    </div>
  );
};

export default Home;
