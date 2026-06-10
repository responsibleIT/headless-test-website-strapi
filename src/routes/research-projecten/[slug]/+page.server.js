import { error } from '@sveltejs/kit';
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

// We don't yet know whether the slug field is `Slug` or `slug` for this
// collection. Read whichever is present.
function readSlug(item) {
	return item?.Slug ?? item?.slug;
}

export async function entries() {
	const json = await fetchWithFallback('/api/research-detail-pages', {
		'pagination[pageSize]': '100'
	});

	const items = json?.data ?? [];

	return items
		.map((item) => readSlug(item))
		.filter((slug) => {
			if (!slug) {
				console.warn('[prerender] research item without slug — skipping');
				return false;
			}
			return true;
		})
		.map((slug) => ({ slug }));
}

export async function load({ params }) {
	const { slug } = params;

	// Try both casings of the filter, since we don't yet know which field name
	// the content type uses.
	let json = await fetchWithFallback('/api/research-detail-pages', {
		'filters[Slug][$eq]': slug,
		populate: '*'
	});

	if (!json?.data?.length) {
		json = await fetchWithFallback('/api/research-detail-pages', {
			'filters[slug][$eq]': slug,
			populate: '*'
		});
	}

	const item = json?.data?.[0];

	if (!item) {
		throw error(404, `Research project "${slug}" not found`);
	}

	// 🔎 Log the full item structure so we can type it precisely.
	console.log(
		`[research-projecten/${slug}] Raw item structure:\n` + JSON.stringify(item, null, 2)
	);

	return { researchPage: item };
}
