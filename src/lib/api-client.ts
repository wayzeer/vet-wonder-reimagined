// API Client for vetshelter-pro backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('portal_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
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

  // Auth endpoints
  async register(email: string, password: string, name: string, phone?: string) {
    return this.request<{ token: string; user: any }>('/api/portal/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/api/portal/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async googleAuth(credential: string) {
    return this.request<{ token: string; user: any; isNewUser: boolean }>('/api/portal/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  }

  async getMe() {
    return this.request<{ user: any }>('/api/portal/auth/me');
  }

  // Profile endpoints
  async getProfile() {
    return this.request<{ profile: any }>('/api/portal/profile');
  }

  async updateProfile(data: { name?: string; phone?: string; address?: string; city?: string; postalCode?: string }) {
    return this.request<{ profile: any; message: string }>('/api/portal/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Pets endpoints
  async getPets() {
    return this.request<{ pets: any[] }>('/api/portal/pets');
  }

  async getPet(id: string) {
    return this.request<{ pet: any }>(`/api/portal/pets/${id}`);
  }

  async createPet(data: {
    name: string;
    species: 'perro' | 'gato' | 'otro';
    breed?: string;
    color?: string;
    sex?: 'macho' | 'hembra' | 'desconocido';
    birthDate?: string;
    weight?: number;
    notes?: string;
  }) {
    return this.request<{ pet: any; message: string }>('/api/portal/pets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePet(id: string, data: {
    name?: string;
    breed?: string;
    color?: string;
    sex?: 'macho' | 'hembra' | 'desconocido';
    birthDate?: string;
    weight?: number;
    notes?: string;
  }) {
    return this.request<{ pet: any; message: string }>(`/api/portal/pets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePet(id: string) {
    return this.request<{ message: string }>(`/api/portal/pets/${id}`, {
      method: 'DELETE',
    });
  }

  // Appointments endpoints
  async getAppointments(options?: { status?: string; upcoming?: boolean }) {
    const params = new URLSearchParams();
    if (options?.status) params.set('status', options.status);
    if (options?.upcoming) params.set('upcoming', 'true');
    const queryString = params.toString() ? `?${params}` : '';
    return this.request<{ appointments: any[] }>(`/api/portal/appointments${queryString}`);
  }

  async getAppointment(id: string) {
    return this.request<{ appointment: any }>(`/api/portal/appointments/${id}`);
  }

  async createAppointment(data: {
    animalId: string;
    scheduledAt: string;
    type: 'consulta' | 'vacunacion' | 'cirugia' | 'revision' | 'urgencia' | 'otro';
    notes?: string;
  }) {
    return this.request<{ appointment: any; message: string }>('/api/portal/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelAppointment(id: string) {
    return this.request<{ message: string }>(`/api/portal/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Medical history endpoint (read-only)
  async getMedicalHistory(petId?: string) {
    const params = petId ? `?petId=${petId}` : '';
    return this.request<{ medicalHistory: any }>(`/api/portal/medical-history${params}`);
  }

  // Availability endpoint - get available time slots for a date
  async getAvailability(date: string) {
    return this.request<{
      date: string;
      closed: boolean;
      message?: string;
      hours?: { open: string; close: string };
      availableSlots: string[];
      bookedSlots: string[];
      totalSlots: number;
      availableCount: number;
    }>(`/api/portal/availability?date=${date}`);
  }
}

export const api = new ApiClient();
