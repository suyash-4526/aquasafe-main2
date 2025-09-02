'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { WaterSample } from '@/data/mock-data';
import { whoLimits } from '@/data/mock-data';

interface MetalChartProps {
  samples: WaterSample[];
}

export default function MetalChart({ samples }: MetalChartProps) {
  const metals = ['lead', 'arsenic', 'mercury', 'cadmium'];

  const averageConcentrations = metals.map((metal) => {
    const total = samples.reduce((acc, sample) => acc + (sample[metal as keyof WaterSample] as number), 0);
    const average = total / samples.length;
    return {
      name: metal.charAt(0).toUpperCase() + metal.slice(1),
      'Average Concentration': parseFloat(average.toPrecision(3)),
      'WHO Limit': whoLimits[metal as keyof typeof whoLimits],
    };
  });

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Average Metal Concentrations (mg/L)</CardTitle>
        <CardDescription>Comparison against World Health Organization (WHO) limits.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={averageConcentrations}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis type="number" domain={[0, 'dataMax + 0.005']} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Legend wrapperStyle={{fontSize: "14px"}} />
            <Bar dataKey="Average Concentration" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="WHO Limit" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
