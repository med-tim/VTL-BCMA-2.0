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
            
            {/* Continuous scanning indicator */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-50 text-gray-700 border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-[#0066CC] animate-pulse mr-2"></span>
                <span>Continuously scanning for medications</span>
              </div>
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
