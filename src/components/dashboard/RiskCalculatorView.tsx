'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getRecommendation, addNewSample } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calculator, Droplets, FlaskConical, GlassWater, Loader2, MapPin, Sparkles, Weight, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StatCard from './StatCard';
import type { WaterSample } from '@/data/mock-data';
import { Checkbox } from '../ui/checkbox';

// --- ENHANCED FORM SCHEMA (Increased Parameters) ---
const formSchema = z.object({
  location: z.string().min(1, 'Location is required.'),
  // Heavy Metals
  lead: z.coerce.number().min(0, 'Value must be non-negative.'),
  arsenic: z.coerce.number().min(0, 'Value must be non-negative.'),
  cadmium: z.coerce.number().min(0, 'Value must be non-negative.'),
  mercury: z.coerce.number().min(0, 'Value must be non-negative.'), // NEW: Mercury
  // Chemical/Other Parameters
  nitrate: z.coerce.number().min(0, 'Value must be non-negative.'),
  sulfate: z.coerce.number().min(0, 'Value must be non-negative.'),
  ph: z.coerce.number().min(0, 'Value must be non-negative.').max(14, 'Value must be 14 or less.'),
  // Exposure Factors
  weight: z.coerce.number().min(1, 'Weight must be greater than 0.'),
  intake: z.coerce.number().min(0.1, 'Intake must be greater than 0.'),
  addToDatabase: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

// --- ENHANCED CALCULATION RESULT INTERFACE ---
interface CalculationResult {
  hqLead: number;
  hqArsenic: number;
  hqCadmium: number;
  hqMercury: number; // NEW
  hazardIndex: number;
  // Risk notes for non-HQ parameters
  nitrateRiskNote: string;
  sulfateRiskNote: string;
}

interface RiskCalculatorViewProps {
  samples: WaterSample[];
  onSampleAdded: (newSample: WaterSample) => void;
}

export default function RiskCalculatorView({ samples, onSampleAdded }: RiskCalculatorViewProps) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      lead: 0.01,
      arsenic: 0.005,
      cadmium: 0.002,
      mercury: 0.002, // Default for new parameter (EPA MCL)
      nitrate: 10,   
      sulfate: 250,   
      ph: 7.0,
      weight: 70,
      intake: 2,
      addToDatabase: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);
    setAiRecommendation(null);

    if (data.addToDatabase) {
        // --- Add the new sample ---
        const sampleResult = await addNewSample({
            location: data.location,
            lead: data.lead,
            arsenic: data.arsenic,
            ph: data.ph,
            // NOTE: Only adding the original parameters to the mock WaterSample type for simplicity.
        }, samples);

        if (!sampleResult.success || !sampleResult.data) {
            toast({
                variant: 'destructive',
                title: 'Error Adding Sample',
                description: sampleResult.error
            });
            setLoading(false);
            return;
        } 
        
        onSampleAdded(sampleResult.data);
        toast({
            title: 'Sample Added',
            description: `Successfully added sample for ${data.location}.`,
        });
    }

    // --- CALCULATION LOGIC (HQ/HI Method) ---
    const rfdLead = 0.0035;  // Provisional RfD for lead in mg/kg/day
    const rfdArsenic = 0.0003; // RfD for arsenic in mg/kg/day
    const rfdCadmium = 0.0005; // RfD for cadmium in mg/kg/day (Source: EPA)
    const rfdMercury = 0.0003; // RfD for inorganic mercury (mercuric chloride) in mg/kg/day (Source: EPA IRIS)

    // Adjusted Daily Dose (ADD) = (C * IR) / BW
    // C = Concentration (mg/L), IR = Intake Rate (L/day), BW = Body Weight (kg)
    const addLead = (data.lead * data.intake) / data.weight;
    const addArsenic = (data.arsenic * data.intake) / data.weight;
    const addCadmium = (data.cadmium * data.intake) / data.weight;
    const addMercury = (data.mercury * data.intake) / data.weight; // NEW

    // Hazard Quotient (HQ) = ADD / RfD
    const hqLead = addLead / rfdLead;
    const hqArsenic = addArsenic / rfdArsenic;
    const hqCadmium = addCadmium / rfdCadmium;
    const hqMercury = addMercury / rfdMercury; // NEW

    // Hazard Index (HI) = Sum of all HQs
    const hazardIndex = hqLead + hqArsenic + hqCadmium + hqMercury; // UPDATED

    // --- NON-HQ RISK ASSESSMENT (For parameters like Nitrate/Sulfate) ---
    // Set MCL/SMCL standards
    const mclNitrate = 10; // mg/L (as Nitrogen) - Health standard
    const smclSulfate = 250; // mg/L - Aesthetic/physical standard

    let nitrateRiskNote = 'Nitrate level is safe.';
    if (data.nitrate > mclNitrate) {
      nitrateRiskNote = `**High Risk:** Nitrate is ${data.nitrate.toFixed(1)} mg/L (MCL is ${mclNitrate} mg/L). May cause **Methemoglobinemia (Blue Baby Syndrome)**, especially in infants.`;
    } else if (data.nitrate > mclNitrate * 0.5) {
      nitrateRiskNote = 'Nitrate is elevated, but below the MCL. Monitor closely.';
    }

    let sulfateRiskNote = 'Sulfate level is acceptable.';
    if (data.sulfate > smclSulfate * 2) {
      sulfateRiskNote = `**Significant Risk:** Sulfate is ${data.sulfate.toFixed(0)} mg/L (SMCL is ${smclSulfate} mg/L). High levels cause a laxative effect, and can lead to corrosive water, affecting plumbing/precipitates.`;
    } else if (data.sulfate > smclSulfate) {
      sulfateRiskNote = 'Sulfate is above the aesthetic limit (SMCL). May cause a noticeable taste/odor and mild laxative effects.';
    }
    
    const newResult: CalculationResult = { 
      hqLead, 
      hqArsenic, 
      hqCadmium, 
      hqMercury, // NEW
      hazardIndex,
      nitrateRiskNote,
      sulfateRiskNote
    };
    setResult(newResult);

    try {
      const recommendation = await getRecommendation({
        // Pass ALL relevant data to the AI for a comprehensive recommendation
        leadLevel: data.lead,
        arsenicLevel: data.arsenic,
        cadmiumLevel: data.cadmium,
        mercuryLevel: data.mercury, // NEW
        nitrateLevel: data.nitrate,
        sulfateLevel: data.sulfate,
        phLevel: data.ph,
        hazardIndex: newResult.hazardIndex,
      });

      if (recommendation.success) {
        setAiRecommendation(recommendation.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'AI Recommendation Error',
          description: recommendation.error,
        });
      }
    } catch (error) {
       toast({
          variant: 'destructive',
          title: 'An Unexpected Error Occurred',
          description: 'Could not fetch AI recommendations. Please try again.',
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-8 pt-4">
      <Card className="shadow-none border-none">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="p-0 mb-4">
              <CardDescription>
                Enter your water test results to calculate health risks. Check the box below to contribute your data to our public system.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-4 p-0">
               <FormField name="location" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-xs"><MapPin className="w-4 h-4" /> Location Name</FormLabel>
                  <FormControl><Input type="text" placeholder="e.g., Pimpri, Chinchwad" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div />

              {/* --- Water Quality Parameters --- */}
              <FormField name="lead" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-xs"><FlaskConical className="w-4 h-4" /> Lead (mg/L)</FormLabel>
                  <FormControl><Input type="number" step="0.001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="arsenic" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-xs"><FlaskConical className="w-4 h-4" /> Arsenic (mg/L)</FormLabel>
                  <FormControl><Input type="number" step="0.001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="cadmium" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-xs"><FlaskConical className="w-4 h-4" /> Cadmium (mg/L)</FormLabel>
                  <FormControl><Input type="number" step="0.001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {/* --- NEW: Mercury Field --- */}
              <FormField name="mercury" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-xs"><FlaskConical className="w-4 h-4" /> **Mercury** (mg/L)</FormLabel>
                  <FormControl><Input type="number" step="0.001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="nitrate" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-xs"><FlaskConical className="w-4 h-4" /> Nitrate (mg/L)</FormLabel>
                  <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="sulfate" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-xs"><Droplets className="w-4 h-4" /> Sulfate (mg/L)</FormLabel>
                  <FormControl><Input type="number" step="1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
               <FormField name="ph" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-xs"><Droplets className="w-4 h-4" /> pH</FormLabel>
                  <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
in             )} />

              <div />

              {/* --- Exposure Factors --- */}
              <FormField name="weight" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-xs"><Weight className="w-4 h-4" /> Body Weight (kg)</FormLabel>                  
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="intake" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-xs"><GlassWater className="w-4 h-4" /> Daily Intake (L)</FormLabel>
                  <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
                <FormField
                control={form.control}
                name="addToDatabase"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 md:col-span-2 shadow-sm bg-accent/10">
S                   <FormControl>
                        <Checkbox
                        checked={field.value}
Boolean                       onCheckedChange={field.onChange}
                  S     />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel className='cursor-pointer'>
                            Contribute this data to the public dataset
s                       </FormLabel>
                        <FormMessage />
                    </div>
                    </FormItem>
s               )}
                />
            </CardContent>
            <CardFooter className="p-0 mt-6">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
S               Calculate Risk & Add Data
              </Button>
            </CardFooter>
    s       </form>
        </Form>
      </Card>

      {result && (
        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant={result.hazardIndex > 1 ? 'destructive' : 'default'} className={result.hazardIndex <= 1 ? 'bg-accent/20 border-accent' : ''}>
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle className="font-bold">
                {result.hazardIndex > 1 ? 'High Potential Non-Cancer Risk' : 'Low Potential Non-Cancer Risk'}
              </AlertTitle>
S             <AlertDescription>
                Your total **Hazard Index (HI)** from heavy metals is **{result.hazardIndex.toFixed(2)}**. An index below 1.0 suggests that adverse non-cancer health effects from the measured heavy metals are unlikely.
              </AlertDescription>
            </Alert>
            {/* --- UPDATED GRID to md:grid-cols-5 --- */}
source         <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
               <StatCard title="Lead HQ" value={result.hqLead.toFixed(2)} icon={FlaskConical} className="text-center" />
               <StatCard title="Arsenic HQ" value={result.hqArsenic.toFixed(2)} icon={FlaskConical} className="text-center" />
               <StatCard title="Cadmium HQ" value={result.hqCadmium.toFixed(2)} icon={FlaskConical} className="text-center" />
S              <StatCard title="Mercury HQ" value={result.hqMercury.toFixed(2)} icon={FlaskConical} className="text-center" /> {/* NEW */}
               <StatCard title="Hazard Index (HI)" value={result.hazardIndex.toFixed(2)} icon={AlertTriangle} className="text-center font-bold" />
            </div>

            {/* --- NEW: Non-HQ Risk Summaries --- */}
            <h3 className="text-lg font-semibold flex items-center gap-2 pt-4 border-t mt-4">
              <ShieldAlert className="w-5 h-5 text-yellow-600" /> Non-Index Health & Aesthetic Risks
            </h3>
            <Alert variant={result.nitrateRiskNote.includes('High Risk') ? 'destructive' : 'default'} className={!result.nitrateRiskNote.includes('High Risk') ? 'bg-secondary/10' : ''}>
source           <AlertDescription>
                **Nitrate Risk:** {result.nitrateRiskNote}
              </AlertDescription>
            </Alert>
            <Alert variant={result.sulfateRiskNote.includes('Significant Risk') ? 'destructive' : 'default'} className={!result.sulfateRiskNote.includes('Significant Risk') ? 'bg-secondary/10' : ''}>
              <AlertDescription>
                **Sulfate Risk:** {result.sulfateRiskNote}
              </AlertDescription>
source         </Alert>

          </CardContent>
        </Card>
      )}

      {loading && !aiRecommendation && (
         <div className="flex justify-center items-center gap-3 text-lg text-primary p-8">
source           <Loader2 className="h-8 w-8 animate-spin" />
            <span className="font-semibold">Generating AI Recommendations...</span>
        </div>
      )}

      {aiRecommendation && (
        <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-accent/5 mt-6">
          <CardHeader>
source           <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              AI-Powered Recommendation
            </CardTitle>
            <CardDescription>Personalized advice based on your data from our AI expert.</CardDescription>
source       </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground space-y-2" dangerouslySetInnerHTML={{ __html: aiRecommendation }} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
