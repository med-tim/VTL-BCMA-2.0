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
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          <VideoFeed 
            onScan={handleManualScan} 
            isProcessing={isProcessing || verifyMutation.isPending}
            detections={currentDetection ? [currentDetection] : []}
          />
          
          <MedicationVerification 
            detection={currentDetection}
            isLoading={isProcessing}
            isPending={verifyMutation.isPending}
            onVerify={handleVerification}
          />
          
          <VerificationLog verifications={verifications} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
