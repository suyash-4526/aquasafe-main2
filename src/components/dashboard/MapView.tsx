
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { WaterSample } from '@/data/mock-data';
import { whoLimits } from '@/data/mock-data';

interface MapViewProps {
    samples: WaterSample[];
}

export default function MapView({ samples }: MapViewProps) {
    const pimpriChinchwadCenter = '18.6298,73.7997';

    // Constructing the markers string for the Google Maps Static API
    const markers = samples.map(sample => {
        const isHighRisk = sample.lead > whoLimits.lead || sample.arsenic > whoLimits.arsenic;
        const color = isHighRisk ? 'red' : 'green';
        return `markers=color:${color}|label:${sample.location.charAt(0)}|${sample.lat},${sample.lng}`;
    }).join('&');

    const mapUrl = `https://maps.google.com/maps?q=${pimpriChinchwadCenter}&hl=en&z=12&output=embed`;

    return (
        <Card className="shadow-lg w-full h-[80vh]">
            <CardHeader>
                <CardTitle>Pimpri-Chinchwad Water Sample Map</CardTitle>
                <CardDescription>
                    Interactive map showing the locations of water samples.
                    This is a live embedded Google Map centered on Pimpri-Chinchwad.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-full pb-6">
                <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: 'var(--radius)' }}
                    loading="lazy"
                    allowFullScreen
                    src={mapUrl}>
                </iframe>
            </CardContent>
        </Card>
    );
}
