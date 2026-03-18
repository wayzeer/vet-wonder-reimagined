/** Shared blog post type matching the Supabase blog_posts table schema */
export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    category: string | null;
    featured_image_url: string | null;
    published: boolean;
    published_at: string | null;
    created_at: string | null;
}

/** Convert plain text to HTML paragraphs if content has no HTML tags.
 *  Needed for backward compat with posts created before the rich text editor. */
export function ensureHtml(content: string): string {
    if (/<(p|h[1-6]|ul|ol|li|div|blockquote|br)\b/i.test(content)) {
        return content;
    }
    return content
        .split(/\n{2,}/)
        .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
        .join("");
}

/** Validate that a URL uses http(s) protocol (guards against javascript: URIs) */
export function isValidImageUrl(url: string): boolean {
    return /^https?:\/\//i.test(url);
}
