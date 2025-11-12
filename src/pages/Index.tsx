import { useState } from "react";
import { Hero } from "@/components/Hero";
import { MediaCard, MediaItem } from "@/components/MediaCard";
import { MediaDialog } from "@/components/MediaDialog";
import { mediaData } from "@/data/mediaData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, BookOpen } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [explanation, setExplanation] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredMedia = mediaData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    toast.success(`Searching for "${searchQuery}"`);
  };

  const handleCardClick = (item: MediaItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
    setRecommendations([]);
    setExplanation("");
  };

  const handleGetRecommendations = async () => {
    if (!selectedItem) return;
    
    setIsLoadingRecommendations(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-recommendations', {
        body: { 
          title: selectedItem.title,
          type: selectedItem.type
        }
      });

      if (error) throw error;

      const formattedRecommendations = data.recommendations.map((rec: any, index: number) => ({
        id: 100 + index,
        title: rec.title,
        year: rec.year,
        rating: rec.rating,
        description: rec.description,
        type: selectedItem.type,
        genre: rec.genre
      }));

      setRecommendations(formattedRecommendations);
      setDialogOpen(false);
      toast.success("Got 5 similar recommendations!");
      
      // Scroll to recommendations
      setTimeout(() => {
        document.getElementById('recommendations')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast.error("Failed to get recommendations");
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleExplain = async () => {
    if (!selectedItem) return;
    
    setIsLoadingExplanation(true);
    try {
      const { data, error } = await supabase.functions.invoke('explain-recommendation', {
        body: { 
          title: selectedItem.title,
          type: selectedItem.type,
          description: selectedItem.description,
          genre: selectedItem.genre
        }
      });

      if (error) throw error;

      setExplanation(data.explanation);
      toast.success("Generated explanation!");
    } catch (error) {
      console.error('Error getting explanation:', error);
      toast.error("Failed to generate explanation");
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      <main className="container px-4 py-12">
        {/* Main Collection */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Browse Collection</h2>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="bg-card border border-border/50">
                <TabsTrigger value="all" className="gap-2">
                  All
                </TabsTrigger>
                <TabsTrigger value="movie" className="gap-2">
                  <Film className="h-4 w-4" />
                  Movies
                </TabsTrigger>
                <TabsTrigger value="book" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Books
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <MediaCard 
                key={item.id} 
                item={item} 
                onClick={() => handleCardClick(item)}
              />
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div id="recommendations" className="pt-8 border-t border-border/50">
            <h2 className="text-3xl font-bold mb-2">
              Similar to <span className="text-primary">{selectedItem?.title}</span>
            </h2>
            <p className="text-muted-foreground mb-8">AI-powered recommendations just for you</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((item) => (
                <MediaCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => handleCardClick(item)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <MediaDialog
        item={selectedItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onGetRecommendations={handleGetRecommendations}
        onExplain={handleExplain}
        isLoadingRecommendations={isLoadingRecommendations}
        isLoadingExplanation={isLoadingExplanation}
      />

      {/* Explanation Toast-like Display */}
      {explanation && selectedItem && (
        <div className="fixed bottom-6 right-6 max-w-md bg-card border border-primary/50 rounded-xl p-6 shadow-glow animate-in slide-in-from-bottom-5">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Why you'd like {selectedItem.title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
          <button 
            onClick={() => setExplanation("")}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
