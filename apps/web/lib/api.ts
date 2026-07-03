const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const mergedOptions: RequestInit = {
    ...options,
    credentials: 'include', // Mandatorio para enviar y recibir cookies HttpOnly
    headers: {
      ...options.headers,
    },
  };
  
  return fetch(url, mergedOptions);
}
