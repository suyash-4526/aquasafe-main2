import { Heart } from 'lucide-react';

export default function Footer() {
  const teamMembers = ['Suyash Chavan', 'Sumeet Bangar', 'Vaishnav Babar', 'Yash Dighe', "Om Jadhav"];
  const mentorName = 'Prof. Pallavi Thorat Mam';

  return (
    <footer className="w-full border-t bg-card text-foreground shadow-sm mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          
          {/* Combined Team and Mentor Details */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            
            {/* Team Members */}
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-sm text-foreground">Team:</span> {teamMembers.join(', ')}
            </p>

            {/* Mentor */}
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-sm text-foreground">Guided By:</span> {mentorName}
            </p>

          </div>
          
          <div className="flex items-center justify-center text-sm text-muted-foreground whitespace-nowrap">
            Made with <Heart className="w-4 h-4 mx-1.5 text-red-500 fill-current" /> in India by CYBERFIRE SOFTWARE
          </div>
        </div>
      </div>
    </footer>
  );
}
