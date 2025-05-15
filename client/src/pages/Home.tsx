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
    <div className="h-screen flex flex-col bg-[#F8F9FA] overflow-hidden">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {/* Left side: Video feed (takes 2/3 on md screens) */}
          <div className="md:col-span-2 flex flex-col">
            <VideoFeed 
              onScan={handleManualScan} 
              isProcessing={isProcessing || verifyMutation.isPending}
              detections={currentDetection ? [currentDetection] : []}
            />
          </div>
          
          {/* Right side: Verification panel and log (takes 1/3 on md screens) */}
          <div className="flex flex-col space-y-4">
            {/* Verification panel (takes more space) */}
            <div className="flex-1">
              <MedicationVerification 
                detection={currentDetection}
                isLoading={isProcessing}
                isPending={verifyMutation.isPending}
                onVerify={handleVerification}
              />
            </div>
            
            {/* Verification log (smaller) */}
            <div className="h-1/3">
              <VerificationLog verifications={verifications} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer className="py-2" />
    </div>
  );
};

export default Home;
