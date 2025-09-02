'use client';

import { useState } from 'react';
import Navbar, { type View } from '@/components/dashboard/Navbar';
import DashboardView from '@/components/dashboard/DashboardView';
import { mockWaterSamples, type WaterSample } from '@/data/mock-data';
import DataTable from '@/components/dashboard/DataTable';
import Footer from '@/components/dashboard/Footer';
import MapView from '@/components/dashboard/MapView';
import RiskCalculatorView from '@/components/dashboard/RiskCalculatorView';
import SolutionsView from '@/components/dashboard/SolutionsView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [samples, setSamples] = useState(mockWaterSamples);

  const handleAddSample = (newSample: WaterSample) => {
    setSamples(currentSamples => [newSample, ...currentSamples]);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView setActiveView={setActiveView} samples={samples} />;
      case 'map':
        return <MapView samples={samples} />;
      case 'data':
        return <DataTable samples={samples} />;
      case 'calculator':
        return (
          <Card className='shadow-lg'>
              <CardHeader>
                  <CardTitle>Contribute Data & Calculate Risk</CardTitle>
              </CardHeader>
              <CardContent>
                  <RiskCalculatorView samples={samples} onSampleAdded={handleAddSample} />
              </CardContent>
          </Card>
        );
      case 'solutions':
        return (
            <Card className='shadow-lg'>
              <CardHeader>
                  <CardTitle>Find Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                  <SolutionsView />
              </CardContent>
          </Card>
        );
      default:
        return <DashboardView setActiveView={setActiveView} samples={samples} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Navbar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
}
