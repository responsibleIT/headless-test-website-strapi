import { API_TOKEN, LOCAL_API_TOKEN } from '$env/static/private';
import { PUBLIC_STRAPI_API_URL, PUBLIC_LOCAL_API_URL } from '$env/static/public';

async function fetchFromApi(url, token) {
	console.log('[API] Fetching:', url.toString());
	console.log('[API] Token:', token ? `${token.slice(0, 8)}...` : 'MISSING');

	const response = await fetch(url.toString(), {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		const body = await response.text();
		console.error(`[API] ${response.status} ${response.statusText}`);
		console.error('[API] Response body:', body);
		throw new Error(`HTTP ${response.status}`);
	}

	return response.json();
}

const base = PUBLIC_STRAPI_API_URL.replace(/\/$/, '');
const baseLocal = PUBLIC_LOCAL_API_URL.replace(/\/$/, '');

export async function load() {
	const path = '/api/student-detail-pages';
	const params = {};

	const buildUrl = (baseURL) => {
		const url = new URL(`${baseURL}${path}`);
		Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
		return url;
	};

	try {
		const json = await fetchFromApi(buildUrl(base), API_TOKEN);
		return {
			studentPages: json?.data ?? [],
			pagination: json?.meta?.pagination ?? {}
		};
	} catch {
		const json = await fetchFromApi(buildUrl(baseLocal), LOCAL_API_TOKEN);

		return {
			studentPages: json?.data ?? [],
			pagination: json?.meta?.pagination ?? {}
		};
	}
}
