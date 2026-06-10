import { API_TOKEN, LOCAL_API_TOKEN } from '$env/static/private';
import { PUBLIC_STRAPI_API_URL, PUBLIC_LOCAL_API_URL } from '$env/static/public';

export const prerender = true;

const base = PUBLIC_STRAPI_API_URL.replace(/\/$/, '');
const baseLocal = PUBLIC_LOCAL_API_URL.replace(/\/$/, '');

async function fetchFromApi(url, token) {
	const response = await fetch(url.toString(), {
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!response.ok) {
		const body = await response.text();
		console.error(`[API] ${response.status} ${response.statusText} ${url.toString()}`);
		console.error('[API] Response body:', body);
		throw new Error(`HTTP ${response.status}`);
	}

	return response.json();
}

async function fetchWithFallback(path, search = {}) {
	const build = (origin) => {
		const url = new URL(`${origin}${path}`);
		for (const [k, v] of Object.entries(search)) url.searchParams.set(k, v);
		return url;
	};

	try {
		return await fetchFromApi(build(base), API_TOKEN);
	} catch (e) {
		console.warn('[API] Primary unreachable, falling back to local:', e.message);
		return await fetchFromApi(build(baseLocal), LOCAL_API_TOKEN);
	}
}

export async function load() {
	const json = await fetchWithFallback('/api/research-detail-pages', {
		'pagination[pageSize]': '100'
	});

	const items = json?.data ?? [];

	// 🔎 Inspect the first entry so we can derive a precise interface.
	// Once you've pasted the structure back, you can delete this log.
	if (items[0]) {
		console.log(
			'[research-projecten] First item raw structure:\n' + JSON.stringify(items[0], null, 2)
		);
	} else {
		console.log('[research-projecten] Collection is empty — create one entry to log its shape.');
	}

	return {
		researchPages: items,
		pagination: json?.meta?.pagination ?? {}
	};
}
