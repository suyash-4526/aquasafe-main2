import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, ShieldAlert, Droplets, Filter, AlertTriangle } from 'lucide-react';

const filtrationSolutions = [
    {
        title: 'Reverse Osmosis (RO) Filters',
        icon: <Droplets className="w-8 h-8 text-primary" />,
        description: 'Highly effective at removing a wide range of contaminants, including heavy metals like lead and arsenic, salts, and other dissolved solids by forcing water through a semipermeable membrane.',
        bestFor: ['Lead', 'Arsenic', 'Mercury', 'Cadmium', 'High TDS (Total Dissolved Solids)'],
    },
    {
        title: 'Activated Carbon Filters',
        icon: <Filter className="w-8 h-8 text-primary" />,
        description: 'Excellent for removing chlorine, pesticides, and volatile organic compounds (VOCs), which improves taste and odor. Some specialized carbon blocks can also remove lead.',
        bestFor: ['Chlorine', 'Bad Taste/Odor', 'Pesticides', 'Some Lead (check certification)'],
    },
    {
        title: 'UV Purifiers',
        icon: <ShieldAlert className="w-8 h-8 text-primary" />,
        description: 'Uses ultraviolet light to kill bacteria, viruses, and other microorganisms. It does not remove chemical contaminants, so it is often paired with other filtration systems.',
        bestFor: ['Bacteria', 'Viruses', 'Protozoa', 'Microbiological safety'],
    },
];

const commonProblems = [
    {
        issue: 'High Lead Levels (> 0.01 mg/L)',
        icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
        solutions: [
            'Use a certified Reverse Osmosis (RO) or a specific lead-rated Activated Carbon filter.',
            'Do not boil water to remove lead. This will concentrate the lead further.',
            'Use only cold water for drinking and cooking, as hot water can leach more lead from pipes.',
            'Consider replacing old plumbing fixtures, especially those installed before 1986.',
        ],
    },
    {
        issue: 'High Arsenic Levels (> 0.01 mg/L)',
        icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
        solutions: [
            'Reverse Osmosis (RO) is the most effective method for removing arsenic from residential water.',
            'Specialized anion exchange filters or adsorptive media filters (iron oxide) can also be effective.',
            'Boiling water does not remove arsenic.',
            'Seek alternative water sources for drinking and cooking if levels are extremely high and treatment is not possible.',
        ],
    },
    {
        issue: 'Unsafe pH Levels ( < 6.5 or > 8.5)',
        icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
        solutions: [
            'For low pH (acidic water), an acid neutralizing filter containing calcite or magnesium oxide can be used to raise the pH.',
            'For high pH (alkaline water), a small, controlled acid injection system can be installed to lower the pH, though this is less common in homes.',
            'Unsafe pH can cause corrosion of pipes (leaching metals) and reduce the effectiveness of disinfection.',
        ],
    },
];

export default function SolutionsView() {
    return (
        <div className="w-full mx-auto space-y-8 pt-4">
            <Card className="shadow-none border-none">
                <CardHeader className='p-0 mb-4'>
                    <CardDescription>
                        Understand common water issues and discover the best solutions to ensure your water is safe.
                    </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        <AccordionItem value="item-1" className="border rounded-md px-4">
                            <AccordionTrigger className="text-base font-semibold hover:no-underline">Filtration Technologies</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid md:grid-cols-3 gap-4 py-4">
                                     {filtrationSolutions.map((solution) => (
                                        <Card key={solution.title} className="flex flex-col bg-background hover:bg-card/90">
                                            <CardHeader className="items-center text-center">
                                                {solution.icon}
                                                <CardTitle className="mt-2 text-base">{solution.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex-grow space-y-2">
                                                <p className="text-xs text-muted-foreground">{solution.description}</p>
                                                <div>
                                                    <h4 className="font-semibold text-xs mb-1">Best For:</h4>
                                                    <ul className="space-y-1">
                                                        {solution.bestFor.map((item) => (
                                                            <li key={item} className="flex items-start gap-2 text-xs">
                                                                <CheckCircle className="w-3 h-3 mt-0.5 text-green-500 shrink-0" />
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border rounded-md px-4">
                             <AccordionTrigger className="text-base font-semibold hover:no-underline">Common Problem Solutions</AccordionTrigger>
                             <AccordionContent className="pt-2">
                                <Accordion type="single" collapsible className="w-full">
                                    {commonProblems.map((problem) => (
                                        <AccordionItem key={problem.issue} value={problem.issue}>
                                            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                                                <div className="flex items-center gap-3">
                                                    {problem.icon}
                                                    <span>{problem.issue}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-2">
                                                <ul className="space-y-2 pl-4">
                                                    {problem.solutions.map((step) => (
                                                        <li key={step} className="flex items-start gap-3 text-sm text-muted-foreground">
                                                            <CheckCircle className="w-4 h-4 mt-1 text-primary shrink-0" />
                                                            <span>{step}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                             </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
