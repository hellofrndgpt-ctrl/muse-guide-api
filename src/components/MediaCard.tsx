import { Star, BookOpen, Film } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface MediaItem {
  id: number;
  title: string;
  year: number;
  rating: number;
  description: string;
  type: "movie" | "book";
  genre?: string;
}

interface MediaCardProps {
  item: MediaItem;
  onClick: () => void;
}

export const MediaCard = ({ item, onClick }: MediaCardProps) => {
  return (
    <Card 
      onClick={onClick}
      className="group cursor-pointer overflow-hidden bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:scale-[1.02]"
    >
      {/* Visual Header */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {item.type === "movie" ? (
          <Film className="h-20 w-20 text-primary/40 group-hover:text-primary/60 transition-colors" />
        ) : (
          <BookOpen className="h-20 w-20 text-primary/40 group-hover:text-primary/60 transition-colors" />
        )}
        <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm">
          {item.type === "movie" ? "Movie" : "Book"}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-bold text-xl mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{item.year}</span>
            {item.genre && (
              <>
                <span>•</span>
                <span>{item.genre}</span>
              </>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center gap-1 text-primary">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-semibold">{item.rating.toFixed(1)}</span>
          <span className="text-muted-foreground text-sm">/10</span>
        </div>
      </div>
    </Card>
  );
};
