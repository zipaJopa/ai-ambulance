"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { translations, Language } from '@/lib/translations';

interface VitalSignsProps {
  language: Language;
}

const VitalSigns: React.FC<VitalSignsProps> = ({ language }) => {
  const [heartRate, setHeartRate] = useState('--');
  const [temperature, setTemperature] = useState('--');
  const [oxygenSaturation, setOxygenSaturation] = useState('--');

  const t = translations[language];

  useEffect(() => {
    const updateVitalSigns = () => {
      setHeartRate(Math.floor(Math.random() * (100 - 60 + 1) + 60).toString());
      setTemperature((Math.random() * (37.5 - 36.0) + 36.0).toFixed(1));
      setOxygenSaturation(Math.floor(Math.random() * (100 - 95 + 1) + 95).toString());
    };

    const interval = setInterval(updateVitalSigns, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold">{t.heartRate}</h3>
          <p>{heartRate} BPM</p>
        </div>
        <div>
          <h3 className="font-semibold">{t.temperature}</h3>
          <p>{temperature} °C</p>
        </div>
        <div>
          <h3 className="font-semibold">{t.oxygenSaturation}</h3>
          <p>{oxygenSaturation}%</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalSigns;