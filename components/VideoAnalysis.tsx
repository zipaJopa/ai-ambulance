"use client";

import { useRef, useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { translations, Language } from '@/lib/translations';

interface VideoAnalysisProps {
  language: Language;
}

const VideoAnalysis: React.FC<VideoAnalysisProps> = ({ language }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const t = translations[language];

  useEffect(() => {
    const initializeVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera", error);
      }
    };

    initializeVideo();
  }, []);

  useEffect(() => {
    const analyzeVideo = () => {
      if (videoRef.current && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          // Here you would typically call your AI model for analysis
          // For now, we'll just set a placeholder result
          setAnalysisResult(t.analysisPending);
        }
      }
    };

    const interval = setInterval(analyzeVideo, 5000);
    return () => clearInterval(interval);
  }, [language]);

  return (
    <Card className="relative overflow-hidden">
      <video ref={videoRef} autoPlay muted className="w-full h-auto" />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
        {analysisResult}
      </div>
    </Card>
  );
};

export default VideoAnalysis;