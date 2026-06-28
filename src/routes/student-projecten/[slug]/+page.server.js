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

export const prerender = true;

const base = PUBLIC_STRAPI_API_URL.replace(/\/$/, '');
const baseLocal = PUBLIC_LOCAL_API_URL.replace(/\/$/, '');

export async function entries() {
	const json = await fetchFromApi(new URL(`${base}/api/student-detail-pages`), API_TOKEN);

	return json.data
		.filter((page) => {
			const isValid = page.Slug && page.Slug !== 'student-detail-page';
			if (!isValid) console.warn('[prerender] Skipping invalid slug:', page.Slug);
			return isValid;
		})
		.map((page) => ({ slug: page.Slug }));
}

export async function load({ params }) {
	const { slug } = params;

	console.log(slug, 'slug value is:', JSON.stringify(slug), 'length:', slug.length);
	try {
		const json = await fetchFromApi(
			new URL(`${base}/api/student-detail-pages?filters[Slug]=${encodeURIComponent(slug)}&populate=*`),
			API_TOKEN
		);
		const item = json?.data?.[0];

		if (!item) {
			return {};
		}

		const studentPage = {
			id: item.id,
			P5: item.P5 ?? null,
			documentId: item.documentId,
			LesJaar: item.LesJaar,
			ProjectTitel: item.ProjectTitel,
			ProjectBeschrijving: item.ProjectBeschrijving,
			AantalStudenten: item.AantalStudenten,
			SchoolJaar: item.SchoolJaar ?? [],
			Niveau: item.Niveau ?? [],
			Slug: item.Slug,
			Doorlooptijd: item.Doorlooptijd,
			VideoEmbed: item.VideoEmbed ?? null,
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
			publishedAt: item.publishedAt ?? null,
			Onderwijseenheid: item.Onderwijseenheid ?? null,
			Bronnen: item.Bronnen ?? [],
			Foto: item.Foto ?? null,
			Audio: item.Audio ?? [],
			Partners: item.Partners ?? []
		};
		return { studentPage };
	} catch (error) {
		const json = await fetchFromApi(
			new URL(`${baseLocal}/api/student-detail-pages?filters[Slug]=${encodeURIComponent(slug)}&populate=*`),
			LOCAL_API_TOKEN
		);
		const item = json?.data?.[0];

		if (!item) {
			return {};
		}

		const studentPage = {
			id: item.id,
			P5: item.P5 ?? null,
			documentId: item.documentId,
			LesJaar: item.LesJaar,
			ProjectTitel: item.ProjectTitel,
			ProjectBeschrijving: item.ProjectBeschrijving,
			AantalStudenten: item.AantalStudenten,
			SchoolJaar: item.SchoolJaar ?? [],
			Niveau: item.Niveau ?? [],
			Slug: item.Slug,
			Doorlooptijd: item.Doorlooptijd,
			VideoEmbed: item.VideoEmbed ?? null,
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
			publishedAt: item.publishedAt ?? null,
			Onderwijseenheid: item.Onderwijseenheid ?? null,
			Bronnen: item.Bronnen ?? [],
			Foto: item.Foto ?? null,
			Audio: item.Audio ?? [],
			Partners: item.Partners ?? []
		};
		return { studentPage };
	}
}
