import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "./RichTextEditor";
import { toast } from "sonner";
import {
    Loader2,
    Save,
    Send,
    Trash2,
    Edit,
    RefreshCw,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isValidImageUrl } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";

export const BlogManager = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("editor");

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featured_image: "",
        category: "Consejos",
    });
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

    // Fetch posts from Supabase
    const { data: posts, isLoading: loadingPosts } = useQuery({
        queryKey: ["blogPosts"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            return (data || []) as BlogPost[];
        },
    });

    // Create post mutation
    const createMutation = useMutation({
        mutationFn: async ({ isPublish }: { isPublish: boolean }) => {
            const { data, error } = await supabase
                .from("blog_posts")
                .insert({
                    title: formData.title,
                    slug: formData.slug,
                    excerpt: formData.excerpt || null,
                    content: formData.content,
                    category: formData.category,
                    featured_image_url: formData.featured_image || null,
                    published: isPublish,
                    published_at: isPublish ? new Date().toISOString() : null,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, { isPublish }) => {
            toast.success(isPublish ? "¡Post publicado!" : "Borrador guardado");
            queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
            resetForm();
            setActiveTab("posts");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    // Update post mutation
    const updateMutation = useMutation({
        mutationFn: async ({ isPublish }: { isPublish: boolean }) => {
            if (!editingPost) throw new Error("No post selected");

            const { data, error } = await supabase
                .from("blog_posts")
                .update({
                    title: formData.title,
                    slug: formData.slug,
                    excerpt: formData.excerpt || null,
                    content: formData.content,
                    category: formData.category,
                    featured_image_url: formData.featured_image || null,
                    published: isPublish,
                    published_at: isPublish && !editingPost.published
                        ? new Date().toISOString()
                        : editingPost.published_at,
                })
                .eq("id", editingPost.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, { isPublish }) => {
            toast.success(isPublish ? "¡Post actualizado y publicado!" : "Cambios guardados");
            queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
            resetForm();
            setActiveTab("posts");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    // Delete post mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("blog_posts")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Post eliminado");
            queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
        },
        onError: () => {
            toast.error("Error al eliminar el post");
        },
    });

    const resetForm = () => {
        setFormData({
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            featured_image: "",
            category: "Consejos",
        });
        setEditingPost(null);
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || "",
            content: post.content,
            featured_image: post.featured_image_url || "",
            category: post.category,
        });
        setActiveTab("editor");
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };

    const handleSave = (isPublish: boolean) => {
        if (editingPost) {
            updateMutation.mutate({ isPublish });
        } else {
            createMutation.mutate({ isPublish });
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="editor">
                        {editingPost ? "Editar Post" : "Nuevo Post"}
                    </TabsTrigger>
                    <TabsTrigger value="posts">Mis Posts</TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {editingPost ? "Editar Post" : "Contenido del Post"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label>Título</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                                slug: generateSlug(e.target.value),
                                            });
                                        }}
                                        className="mt-1"
                                        placeholder="Título del artículo"
                                    />
                                </div>
                                <div>
                                    <Label>Slug (URL)</Label>
                                    <Input
                                        value={formData.slug}
                                        onChange={(e) =>
                                            setFormData({ ...formData, slug: e.target.value })
                                        }
                                        className="mt-1"
                                        placeholder="url-del-articulo"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Extracto</Label>
                                <Textarea
                                    value={formData.excerpt}
                                    onChange={(e) =>
                                        setFormData({ ...formData, excerpt: e.target.value })
                                    }
                                    className="mt-1"
                                    placeholder="Breve descripción del artículo..."
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label>Imagen destacada (URL)</Label>
                                <Input
                                    value={formData.featured_image}
                                    onChange={(e) =>
                                        setFormData({ ...formData, featured_image: e.target.value })
                                    }
                                    placeholder="https://..."
                                    className="mt-1"
                                />
                                {formData.featured_image && isValidImageUrl(formData.featured_image) && (
                                    <img
                                        src={formData.featured_image}
                                        alt="Preview"
                                        className="mt-2 rounded-lg max-h-48 object-cover"
                                    />
                                )}
                            </div>

                            <div>
                                <Label>Contenido</Label>
                                <div className="mt-1">
                                    <RichTextEditor
                                        content={formData.content}
                                        onChange={(content) =>
                                            setFormData({ ...formData, content })
                                        }
                                        placeholder="Escribe el contenido del artículo..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-4 border-t">
                                {editingPost && (
                                    <Button variant="ghost" onClick={resetForm}>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Nuevo Post
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => handleSave(false)}
                                    disabled={isPending || !formData.title || !formData.content}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar borrador
                                </Button>
                                <Button
                                    onClick={() => handleSave(true)}
                                    disabled={isPending || !formData.title || !formData.content}
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    Publicar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="posts">
                    <Card>
                        <CardHeader>
                            <CardTitle>Posts del Blog</CardTitle>
                            <CardDescription>
                                Gestiona todos los artículos publicados y borradores
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingPosts ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : posts && posts.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Título</TableHead>
                                            <TableHead>Categoría</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {posts.map((post) => (
                                            <TableRow key={post.id}>
                                                <TableCell className="font-medium">
                                                    {post.title}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{post.category}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={post.published ? "default" : "secondary"}
                                                    >
                                                        {post.published ? "Publicado" : "Borrador"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(post.created_at).toLocaleDateString("es-ES")}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(post)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (confirm("¿Eliminar este post?")) {
                                                                deleteMutation.mutate(post.id);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No hay posts todavía. ¡Crea uno nuevo!
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BlogManager;
