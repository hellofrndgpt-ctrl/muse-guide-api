import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-cinema.jpg";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export const Hero = ({ searchQuery, onSearchChange, onSearch }: HeroProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Cinema theater" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Discover Your Next
          <br />
          <span className="text-primary">Favorite Story</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          AI-powered recommendations for movies and books tailored just for you
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 p-2 bg-card/80 backdrop-blur-sm rounded-2xl shadow-glow border border-border/50">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for movies or books..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-12 h-14 bg-transparent border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button 
              onClick={onSearch}
              size="lg"
              className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-glow"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
