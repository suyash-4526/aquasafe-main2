
'use client';

import { whoLimits, type WaterSample } from '@/data/mock-data';
import StatCard from './StatCard';
import { AlertTriangle, Beaker, Calendar, MapPin, Calculator, Wrench, ChevronRight } from 'lucide-react';
import MetalChart from './MetalChart';
import type { View } from './Navbar';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';

interface DashboardViewProps {
  setActiveView: (view: View) => void;
  samples: WaterSample[];
}

export default function DashboardView({ setActiveView, samples }: DashboardViewProps) {
  const [latestSampleDate, setLatestSampleDate] = useState('');
  
  const totalSamples = samples.length;
  const highRiskLocations = samples.filter(
    (s) => s.lead > whoLimits.lead || s.arsenic > whoLimits.arsenic
  ).length;

  const latestSample = [...samples].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
  useEffect(() => {
    if (latestSample) {
      setLatestSampleDate(new Date(latestSample.date).toLocaleDateString());
    }
  }, [latestSample]);


  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Samples" value={String(totalSamples)} icon={Beaker} description="Number of water tests recorded" />
        <StatCard title="High-Risk Locations" value={String(highRiskLocations)} icon={AlertTriangle} description="Samples exceeding WHO limits for Lead/Arsenic" />
        <StatCard title="Latest Sample Location" value={latestSample.location} icon={MapPin} description={`ID: ${latestSample.id}`} />
        <StatCard title="Latest Sample Date" value={latestSampleDate} icon={Calendar} description="Most recent data point" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <MetalChart samples={samples} />
         <div className='space-y-6'>
             <Card className="shadow-md flex flex-col">
                <CardHeader>
                    <CardTitle className='flex items-center gap-3'><Calculator className='w-8 h-8 text-primary' /> Contribute & Calculate Risk</CardTitle>
                    <CardDescription>Add your own water sample data to our system and get a personalized health risk assessment based on the latest guidelines.</CardDescription>
                </CardHeader>
                <CardContent className='flex-grow' />
                <CardFooter>
                    <Button variant="outline" onClick={() => setActiveView('calculator')}>
                        Go to Calculator <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </Card>
             <Card className="shadow-md flex flex-col">
                <CardHeader>
                    <CardTitle className='flex items-center gap-3'><Wrench className='w-8 h-8 text-primary' /> Find Water Solutions</CardTitle>
                    <CardDescription>Explore effective filtration technologies and find solutions for common water quality problems like high lead or arsenic levels.</CardDescription>
                </CardHeader>
                 <CardContent className='flex-grow' />
                <CardFooter>
                     <Button variant="outline" onClick={() => setActiveView('solutions')}>
                        Find Solutions <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </Card>
         </div>
      </div>
    </div>
  );
}
