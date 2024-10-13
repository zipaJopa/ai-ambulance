"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import VideoAnalysis from '@/components/VideoAnalysis';
import ChatBox from '@/components/ChatBox';
import VitalSigns from '@/components/VitalSigns';
import { translations, Language } from '@/lib/translations';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('sr');
  const [isListening, setIsListening] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const { toast } = useToast();

  const t = translations[currentLanguage];

  useEffect(() => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    synth.onvoiceschanged = () => {
      // This ensures voices are loaded
    };
  }, []);

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage === 'en' ? 'en-US' : 'sr-RS';
    synth.speak(utterance);
  };

  const startConversation = () => {
    const welcomeMessage = t.welcome + ' ' + t.askSymptoms;
    toast({
      title: t.welcome,
      description: t.askSymptoms,
    });
    speak(welcomeMessage);
    setIsListening(true);
  };

  const handleLanguageChange = (value: string) => {
    setCurrentLanguage(value as Language);
  };

  const updateDiagnosis = (newDiagnosis: string) => {
    setDiagnosis(newDiagnosis);
    speak(newDiagnosis);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <Select onValueChange={handleLanguageChange} value={currentLanguage}>
          <SelectTrigger className="w-[180px] mt-4">
            <SelectValue placeholder={t.selectLanguage} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sr">Srpski</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t.videoAnalysis}</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoAnalysis language={currentLanguage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.vitalSigns}</CardTitle>
          </CardHeader>
          <CardContent>
            <VitalSigns language={currentLanguage} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t.conversation}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatBox 
              language={currentLanguage} 
              isListening={isListening} 
              setIsListening={setIsListening} 
              updateDiagnosis={updateDiagnosis}
              speak={speak}
            />
            <Button onClick={startConversation} className="mt-4">{t.startConversation}</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t.diagnosis}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{diagnosis || t.diagnosisDefault}</p>
          </CardContent>
        </Card>
      </main>

      <Toaster />
    </div>
  );
}