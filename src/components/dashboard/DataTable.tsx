'use client';

import { useState } from 'react';
import type { WaterSample } from '@/data/mock-data';
import { whoLimits } from '@/data/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DataTableProps {
  samples: WaterSample[];
}

type SortKey = keyof WaterSample;

export default function DataTable({ samples }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'date', direction: 'descending'});

  const sortedSamples = [...samples].sort((a, b) => {
    if (sortConfig === null) {
      return 0;
    }
    const { key, direction } = sortConfig;

    let aValue = a[key];
    let bValue = b[key];

    // Special handling for date sorting
    if (key === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
    }
    
    if (aValue < bValue) {
      return direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getRiskLevel = (sample: WaterSample): 'High' | 'Moderate' | 'Low' => {
      const { lead, arsenic, ph } = sample;
      let highRiskFactors = 0;
      let moderateRiskFactors = 0;

      if (lead > whoLimits.lead) highRiskFactors++;
      else if (lead > whoLimits.lead * 0.75) moderateRiskFactors++;

      if (arsenic > whoLimits.arsenic) highRiskFactors++;
      else if (arsenic > whoLimits.arsenic * 0.75) moderateRiskFactors++;

      if (ph < whoLimits.ph_min || ph > whoLimits.ph_max) highRiskFactors++;
      else if (ph < whoLimits.ph_min + 0.5 || ph > whoLimits.ph_max - 0.5) moderateRiskFactors++;
      
      if(highRiskFactors > 0) return 'High';
      if(moderateRiskFactors > 0) return 'Moderate';
      return 'Low';
  }

  const columns: { key: SortKey; label: string; isNumeric?: boolean }[] = [
    { key: 'id', label: 'Sample ID' },
    { key: 'location', label: 'Location' },
    { key: 'date', label: 'Date' },
    { key: 'lead', label: 'Lead (mg/L)', isNumeric: true },
    { key: 'arsenic', label: 'Arsenic (mg/L)', isNumeric: true },
    { key: 'mercury', label: 'Mercury (mg/L)', isNumeric: true },
    { key: 'cadmium', label: 'Cadmium (mg/L)', isNumeric: true },
    { key: 'ph', label: 'pH', isNumeric: true },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Water Sample Data</CardTitle>
        <CardDescription>
          A comprehensive list of all recorded water samples from Pimpri-Chinchwad. Click column headers to sort.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key} className={cn(col.isNumeric && 'text-right')}>
                    <Button variant="ghost" onClick={() => requestSort(col.key)}>
                      {col.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                ))}
                <TableHead className="text-center">Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSamples.map((sample) => (
                <TableRow key={sample.id}>
                  <TableCell>{sample.id}</TableCell>
                  <TableCell>{sample.location}</TableCell>
                  <TableCell>{new Date(sample.date).toLocaleDateString()}</TableCell>
                  <TableCell className={cn('text-right', sample.lead > whoLimits.lead && 'text-destructive font-bold')}>
                      {sample.lead.toFixed(3)}
                  </TableCell>
                  <TableCell className={cn('text-right', sample.arsenic > whoLimits.arsenic && 'text-destructive font-bold')}>
                      {sample.arsenic.toFixed(3)}
                  </TableCell>
                  <TableCell className={cn('text-right', sample.mercury > whoLimits.mercury && 'text-destructive font-bold')}>
                      {sample.mercury.toFixed(3)}
                  </TableCell>
                   <TableCell className={cn('text-right', sample.cadmium > whoLimits.cadmium && 'text-destructive font-bold')}>
                      {sample.cadmium.toFixed(3)}
                  </TableCell>
                  <TableCell className={cn('text-right', (sample.ph < whoLimits.ph_min || sample.ph > whoLimits.ph_max) && 'text-destructive font-bold')}>
                      {sample.ph.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={
                        getRiskLevel(sample) === 'High' ? 'destructive' :
                        getRiskLevel(sample) === 'Moderate' ? 'secondary' : 'default'
                    }
                    className={cn(
                        getRiskLevel(sample) === 'Moderate' && 'bg-amber-400/80 text-black',
                        getRiskLevel(sample) === 'Low' && 'bg-green-500/80'
                    )}
                    >
                        {getRiskLevel(sample)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
