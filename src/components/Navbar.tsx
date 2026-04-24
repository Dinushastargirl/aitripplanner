import { MapPin } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 border-b border-black bg-black text-white flex items-center px-6 justify-between shrink-0">
      <div className="flex items-center gap-3">
        <img 
          src="https://ibb.co/HTyxn1fN" 
          alt="AI Trip Planner Logo" 
          className="h-8 w-auto invert brightness-0"
          onError={(e) => {
            // Fallback for broken logo link
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#E32E26]" />
          <span className="font-bold tracking-tight text-xl">TripPlanner.AI</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium opacity-80">
        <a href="#" className="hover:text-[#E32E26] transition-colors">My Trips</a>
        <a href="#" className="hover:text-[#E32E26] transition-colors">Explore</a>
        <a href="#" className="hover:text-[#E32E26] transition-colors">Community</a>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-sm font-medium opacity-80 hover:opacity-100">Log In</button>
        <button className="bg-[#E32E26] text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700 transition-colors">
          Sign Up
        </button>
      </div>
    </header>
  );
}
