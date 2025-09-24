const DEFAULT_API_URL = 'http://localhost:5000/api';
const ENV_API_URL = (import.meta as any)?.env?.VITE_API_URL;
const WINDOW_API_URL = (globalThis as any)?.__API_URL__;
const API_URL = (ENV_API_URL || WINDOW_API_URL || DEFAULT_API_URL) as string;

export function setAuthToken(token: string | null) {
	if (token) localStorage.setItem('token', token);
	else localStorage.removeItem('token');
}

function authHeaders() {
	const token = localStorage.getItem('token');
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
	if (!API_URL) {
		throw new Error('API base URL is not configured');
	}
	const url = path.startsWith('http') ? path : `${API_URL}${path}`;
	const res = await fetch(url, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...authHeaders(),
			...(init?.headers || {}),
		},
		credentials: 'include',
	});
	if (!res.ok) {
		let message = res.statusText;
		try {
			const body = await res.json();
			message = body?.message || message;
		} catch {
			// not JSON, keep default message
		}
		throw new Error(message);
	}
	return res.json();
}
