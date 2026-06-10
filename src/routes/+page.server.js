import { API_TOKEN, LOCAL_API_TOKEN } from '$env/static/private';
import { PUBLIC_STRAPI_API_URL, PUBLIC_LOCAL_API_URL } from '$env/static/public';

export const prerender = true;

const base = PUBLIC_STRAPI_API_URL.replace(/\/$/, '');
const baseLocal = PUBLIC_LOCAL_API_URL.replace(/\/$/, '');

const HOME_SLUG = 'home';

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

/**
 * Try the remote Strapi first, fall back to the local one. Returns null if
 * both fail so callers can decide how to degrade gracefully.
 */
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
		try {
			return await fetchFromApi(build(baseLocal), LOCAL_API_TOKEN);
		} catch (e2) {
			console.error('[API] Local fallback also failed:', e2.message);
			return null;
		}
	}
}

export async function load() {
	// Two requests in parallel: the link-list of all pages + the optional
	// "home" page that powers the landing content.
	const [listJson, homeJson] = await Promise.all([
		fetchWithFallback('/api/pages', { 'pagination[pageSize]': '100' }),
		fetchWithFallback('/api/pages', {
			'filters[slug][$eq]': HOME_SLUG,
			'populate[sections][populate]': '*',
			'populate[video]': 'true'
		})
	]);

	const homeItem = homeJson?.data?.[0];

	const homePage = homeItem
		? {
				id: homeItem.id,
				documentId: homeItem.documentId,
				title: homeItem.title,
				slug: homeItem.slug,
				metaDescription: homeItem.metaDescription,
				publishedAt: homeItem.publishedAt,
				createdAt: homeItem.createdAt,
				updatedAt: homeItem.updatedAt,
				video: homeItem.video ?? null,
				sections: homeItem.sections ?? []
			}
		: null;

	return {
		pages: listJson?.data ?? [],
		pagination: listJson?.meta?.pagination ?? {},
		homePage
	};
}
