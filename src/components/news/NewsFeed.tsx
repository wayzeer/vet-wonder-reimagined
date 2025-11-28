import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image_url: string | null;
  published_at: string;
  category: string | null;
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, excerpt, image_url, published_at, category')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted" />
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-full" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay noticias disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {news.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
          {item.image_url && (
            <div className="h-48 overflow-hidden">
              <img 
                src={item.image_url} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              {item.category && (
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(item.published_at).toLocaleDateString('es-ES')}
              </div>
            </div>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription className="line-clamp-3">
              {item.excerpt}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
