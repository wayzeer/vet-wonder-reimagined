import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  category?: string;
  published_at?: string | null;
  featured_image_url?: string | null;
}

export function BlogPostCard({ post }: { post: BlogPost }) {
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Salud': return 'bg-red-500';
      case 'Prevención': return 'bg-blue-500';
      case 'Nutrición': return 'bg-amber-500';
      case 'Consejos': return 'bg-green-500';
      case 'Noticias': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Link to={`/blog/${post.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="aspect-video bg-muted relative">
          {post.featured_image_url ? (
            <img
              src={post.featured_image_url}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl">
              🐾
            </div>
          )}
          {post.category && (
            <Badge className={`absolute top-2 left-2 ${getCategoryColor(post.category)}`}>
              {post.category}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
          {post.excerpt && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{post.excerpt}</p>
          )}
          {post.published_at && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: es })}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
