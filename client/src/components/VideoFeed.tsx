import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import type { MedicationDetection } from "@/lib/types";

interface VideoFeedProps {
  onScan: (imageData: string) => void;
  isProcessing: boolean;
  detections: MedicationDetection[];
}

const VideoFeed: React.FC<VideoFeedProps> = ({ onScan, isProcessing, detections }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string | undefined>(undefined);

  // Get list of available cameras
  useEffect(() => {
    async function getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);
        
        if (videoDevices.length > 0 && !activeCameraId) {
          setActiveCameraId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error getting cameras:", error);
      }
    }
    
    getCameras();
  }, [activeCameraId]);

  // Handle camera switching
  const switchCamera = useCallback(() => {
    if (availableCameras.length <= 1) return;
    
    const currentIndex = availableCameras.findIndex(camera => camera.deviceId === activeCameraId);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    setActiveCameraId(availableCameras[nextIndex].deviceId);
  }, [availableCameras, activeCameraId]);

  // Handle manual scan
  const handleScanClick = useCallback(() => {
    if (webcamRef.current && !isProcessing) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        onScan(screenshot);
      }
    }
  }, [onScan, isProcessing]);

  // Reset detection
  const handleReset = useCallback(() => {
    onScan("");
  }, [onScan]);

  // Handle camera ready state
  const handleUserMedia = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  // Video constraints
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment",
    deviceId: activeCameraId ? { exact: activeCameraId } : undefined
  };

  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-2 bg-[#0066CC] text-white">
        <h2 className="font-sfpro font-medium text-lg">Live Syringe Detection</h2>
      </div>
      
      <div className="relative flex-1 flex flex-col">
        <div className="flex-1 bg-gray-900 relative">
          {!isCameraReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="loading-spinner"></div>
            </div>
          )}
          
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={handleUserMedia}
            className="object-cover w-full h-full"
            mirrored={false}
          />
          
          {/* Detection overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {detections.map((detection, index) => (
              <div 
                key={index}
                className="detection-box"
                style={{
                  top: `${detection.boundingBox.y}%`,
                  left: `${detection.boundingBox.x}%`,
                  width: `${detection.boundingBox.width}px`,
                  height: `${detection.boundingBox.height}px`
                }}
              >
                <span className="text-xs text-white bg-[#0066CC] px-1 absolute -top-5 left-0">
                  Syringe
                </span>
              </div>
            ))}
          </div>
          
          {/* Processing indicator */}
          {isProcessing && (
            <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 pulse"></div>
              <span>Processing</span>
            </div>
          )}
        </div>
        
        {/* Simple control bar */}
        <div className="p-2 bg-gray-100 flex items-center justify-between">
          <button 
            className="flex items-center space-x-1 text-[#0066CC] hover:text-blue-800 text-xs"
            onClick={handleReset}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>Reset</span>
          </button>
          
          <button 
            className="bg-[#0066CC] hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleScanClick}
            disabled={!isCameraReady || isProcessing}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Scan</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default VideoFeed;
