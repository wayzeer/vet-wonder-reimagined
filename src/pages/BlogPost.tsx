import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Phone, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import logoVetWonder from "@/assets/logo-vetwonder.png";
import { ensureHtml } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    if (!slug) return;
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, content, category, featured_image_url, published, published_at, created_at")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) throw error;

      setPost(data as BlogPost | null);
    } catch {
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Artículo no encontrado</p>
        <Link to="/blog">
          <Button>Volver al blog</Button>
        </Link>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <img
                src={logoVetWonder}
                alt="VetWonder"
                className="h-12"
              />
            </Link>
            <nav className="flex gap-6">
              <Link to="/" className="hover:text-primary">Inicio</Link>
              <Link to="/blog" className="hover:text-primary">Blog</Link>
              <a href="tel:918574379" className="hover:text-primary flex items-center gap-1"><Phone className="h-4 w-4" />918 57 43 79</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <Link to="/blog">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Button>
        </Link>

        <article className="max-w-4xl mx-auto">
          {post.featured_image_url && (
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full aspect-video object-cover rounded-lg mb-6"
            />
          )}

          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <Badge className={getCategoryColor(post.category)}>
                {post.category}
              </Badge>
            )}
            {post.published_at && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: es })}
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>
          )}

          <div
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-primary/50 prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ensureHtml(post.content)) }}
          />

          <div className="mt-12 p-6 bg-primary/10 rounded-lg border border-primary/20">
            <h3 className="text-xl font-semibold mb-3">¿Necesitas consultar con un veterinario?</h3>
            <p className="mb-4 text-muted-foreground">
              En VetWonder estamos aquí para ayudarte. Reserva tu cita o llámanos para urgencias.
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <a href="tel:918574379" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Llámanos
                </a>
              </Button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
