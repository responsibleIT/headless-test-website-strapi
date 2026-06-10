import { error } from '@sveltejs/kit';
import { API_TOKEN, LOCAL_API_TOKEN } from '$env/static/private';
import { PUBLIC_STRAPI_API_URL, PUBLIC_LOCAL_API_URL } from '$env/static/public';

// Reserved top-level paths that must NOT be hijacked by [slug]:
//   - "student-projecten" / "research-projecten" are sibling static routes
//   - "home" is rendered directly by src/routes/+page.svelte
const RESERVED_SLUGS = new Set(['student-projecten', 'research-projecten', 'home']);

const base = PUBLIC_STRAPI_API_URL.replace(/\/$/, '');
const baseLocal = PUBLIC_LOCAL_API_URL.replace(/\/$/, '');

export const prerender = true;
export const trailingSlash = 'never';

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

export async function entries() {
	const json = await fetchWithFallback('/api/pages', {
		'pagination[pageSize]': '100'
	});

	const pages = json?.data ?? [];

	return pages
		.filter((p) => {
			if (!p.slug) {
				console.warn('[prerender] Skipping page with empty slug:', p.id);
				return false;
			}
			if (RESERVED_SLUGS.has(p.slug)) {
				console.warn(`[prerender] Skipping reserved slug "${p.slug}"`);
				return false;
			}
			return true;
		})
		.map((p) => ({ slug: p.slug }));
}

export async function load({ params }) {
	const { slug } = params;

	if (RESERVED_SLUGS.has(slug)) {
		throw error(404, 'Not found');
	}

	const json = await fetchWithFallback('/api/pages', {
		'filters[slug][$eq]': slug,
		'populate[sections][populate]': '*',
		'populate[video]': 'true'
	});

	const item = json?.data?.[0];

	if (!item) {
		throw error(404, `Page "${slug}" not found`);
	}

	const page = {
		id: item.id,
		documentId: item.documentId,
		title: item.title,
		slug: item.slug,
		metaDescription: item.metaDescription,
		publishedAt: item.publishedAt,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
		video: item.video ?? null,
		sections: item.sections ?? []
	};

	return { page };
}
