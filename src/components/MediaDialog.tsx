import { Star, BookOpen, Film, Sparkles, Lightbulb } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaItem } from "./MediaCard";

interface MediaDialogProps {
  item: MediaItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGetRecommendations: () => void;
  onExplain: () => void;
  isLoadingRecommendations?: boolean;
  isLoadingExplanation?: boolean;
}

export const MediaDialog = ({ 
  item, 
  open, 
  onOpenChange, 
  onGetRecommendations,
  onExplain,
  isLoadingRecommendations = false,
  isLoadingExplanation = false
}: MediaDialogProps) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-card border-border/50">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold mb-2">
                {item.title}
              </DialogTitle>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span>{item.year}</span>
                {item.genre && (
                  <>
                    <span>•</span>
                    <span>{item.genre}</span>
                  </>
                )}
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {item.type === "movie" ? (
                <><Film className="h-3 w-3 mr-1" /> Movie</>
              ) : (
                <><BookOpen className="h-3 w-3 mr-1" /> Book</>
              )}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary fill-current" />
            <span className="text-2xl font-bold">{item.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">/10</span>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* AI Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
            <Button
              onClick={onGetRecommendations}
              disabled={isLoadingRecommendations}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isLoadingRecommendations ? "Loading..." : "Get Similar Recommendations"}
            </Button>
            <Button
              onClick={onExplain}
              disabled={isLoadingExplanation}
              variant="secondary"
              className="flex-1 gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              {isLoadingExplanation ? "Loading..." : "Why Would I Like This?"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
