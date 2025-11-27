const API_BASE = 'http://localhost:8080';

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    let msg = `API GET ${path} failed: ${res.status}`;
    try {
      const body = await res.text();
      msg = body || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = `API POST ${path} failed: ${res.status}`;
    try {
      const bodyText = await res.text();
      msg = bodyText || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = `API PATCH ${path} failed: ${res.status}`;
    try {
      const bodyText = await res.text();
      msg = bodyText || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const DonationsAPI = {
  listAvailable: () => apiGet<{ donations: any[] }>(`/api/donations/available`),
  listByRestaurant: (restaurantId: string) => apiGet<{ donations: any[] }>(`/api/donations/by-restaurant/${restaurantId}`),
  create: (payload: any) => apiPost<{ donation: any }>(`/api/donations/create`, payload),
  accept: (payload: any) => apiPost<{ donation: any; full: boolean }>(`/api/donations/accept`, payload),
  fulfill: (id: string) => apiPatch<{ donation: any }>(`/api/donations/${id}/fulfill`, {}),
};

export const MatchesAPI = {
  listByNGO: (ngoId: string) => apiGet<{ matches: any[] }>(`/api/matches/by-ngo/${ngoId}`),
  updateStatus: (id: string, status: 'scheduled' | 'picked_up' | 'cancelled') =>
    apiPatch<{ match: any }>(`/api/matches/${id}/status`, { status }),
};

export const ProfilesAPI = {
  register: (payload: {
    full_name: string;
    email: string;
    role: 'restaurant' | 'ngo';
    organization_name?: string;
    phone?: string;
    location?: string;
    address?: string;
  }) => apiPost<any>(`/api/profiles/register`, payload),
  login: (email: string, role?: 'restaurant' | 'ngo') => apiPost<any>(`/api/profiles/login`, { email, role }),
  getById: (id: string) => apiGet<any>(`/api/profiles/${id}`),
};
