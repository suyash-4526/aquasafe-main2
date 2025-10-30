export default function Footer() {
  const teamMembers = ['Suyash Chavan', 'Sumeet Bangar', 'Vaishnav Babar', 'Yash Dighe'];
 

  return (
    <footer className="w-full border-t bg-card text-foreground shadow-sm mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-center items-center text-center md:text-left gap-4">
          
          {/* Combined Team and Mentor Details */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            
            {/* Team Members */}
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-sm text-foreground">Team:</span> {teamMembers.join(', ')}
            </p>

          
          </div>
          
        </div>
      </div>
    </footer>
  );
}
