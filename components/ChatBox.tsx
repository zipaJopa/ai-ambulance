"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { translations, Language } from '@/lib/translations';

interface ChatBoxProps {
  language: Language;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  updateDiagnosis: (diagnosis: string) => void;
  speak: (text: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ language, isListening, setIsListening, updateDiagnosis, speak }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const t = translations[language];

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if ('webkitSpeechRecognition' in window) {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'en' ? 'en-US' : 'sr-RS';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addMessage('user', transcript);
        setIsListening(false);
        processUserInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    if (isListening && recognition) {
      recognition.start();
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening, language, setIsListening]);

  const addMessage = (role: 'user' | 'ai', content: string) => {
    setMessages((prevMessages) => [...prevMessages, { role, content }]);
  };

  const processUserInput = async (input: string) => {
    // Here you would typically send the message to your AI backend
    // For now, we'll simulate an AI response
    const aiResponse = await simulateAIResponse(input);
    addMessage('ai', aiResponse);
    speak(aiResponse);

    // Update diagnosis if applicable
    if (aiResponse.includes("Based on your symptoms")) {
      updateDiagnosis(aiResponse);
    }
  };

  const simulateAIResponse = async (input: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (input.toLowerCase().includes("glavobolja")) {
      return t.headacheResponse;
    } else if (input.toLowerCase().includes("kašalj") || input.toLowerCase().includes("kasalj")) {
      return t.coughResponse;
    } else {
      return t.generalResponse;
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      addMessage('user', inputMessage);
      processUserInput(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <Card>
      <CardContent>
        <ScrollArea className="h-[300px] mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {message.content}
              </span>
            </div>
          ))}
        </ScrollArea>
        <div className="flex">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t.enterMessage}
            className="mr-2"
          />
          <Button onClick={handleSendMessage}>{t.send}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBox;