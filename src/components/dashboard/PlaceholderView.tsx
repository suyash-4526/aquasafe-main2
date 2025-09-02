import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
  description: string;
}

export default function PlaceholderView({ title, description }: PlaceholderViewProps) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <Wrench className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
          <p className="text-sm mt-4 text-muted-foreground/80">This feature is currently under construction. Please check back later!</p>
        </CardContent>
      </Card>
    </div>
  );
}
