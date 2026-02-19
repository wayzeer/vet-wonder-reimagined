// API Client for vetshelter-pro backend (public endpoints only)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Error desconocido' };
      }

      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return { error: 'Error de conexión' };
    }
  }

  // Public endpoints (no auth required)
  async getPublicNews(options?: { limit?: number; page?: number }) {
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.page) params.set('page', options.page.toString());
    const queryString = params.toString() ? `?${params}` : '';
    return this.request<{
      data: Array<{
        id: string;
        title: string;
        excerpt: string;
        category: string | null;
        image_url: string | null;
        published_at: string;
      }>;
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/api/public/news${queryString}`);
  }

  async getPublicBlogPosts(options?: { limit?: number; page?: number; category?: string }) {
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.page) params.set('page', options.page.toString());
    if (options?.category) params.set('category', options.category);
    const queryString = params.toString() ? `?${params}` : '';
    return this.request<{
      data: Array<{
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        category: string | null;
        featured_image: string | null;
        is_published: boolean;
        published_at: string | null;
        created_at: string | null;
      }>;
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/api/public/blog${queryString}`);
  }

  async getPublicBlogPost(slug: string) {
    return this.request<{
      id: string;
      slug: string;
      title: string;
      excerpt: string | null;
      content: string;
      category: string | null;
      featured_image: string | null;
      is_published: boolean;
      published_at: string | null;
      created_at: string | null;
    }>(`/api/public/blog?slug=${encodeURIComponent(slug)}`);
  }
}

export const api = new ApiClient();
