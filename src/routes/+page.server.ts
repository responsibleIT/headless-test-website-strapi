import type { PageServerLoad } from './$types';
import {API_TOKEN, LOCAL_API_TOKEN} from '$env/static/private';
import {PUBLIC_STRAPI_API_URL, PUBLIC_LOCAL_API_URL} from '$env/static/public'

async function fetchFromApi(url: URL, token: string) {
  console.log('[API] Fetching:', url.toString());
  console.log('[API] Token:', token ? `${token.slice(0, 8)}...` : 'MISSING');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`[API] ${response.status} ${response.statusText}`);
    console.error('[API] Response body:', body);
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export const load: PageServerLoad = async () => {
  const path = '/api/pages';
  const params: Record<string, string> = {
    'populate[sections][populate]': '*',
    'populate[video]': 'true',
  };

  const buildUrl = (base: string) => {
    const url = new URL(`${base}${path}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    return url;
  };

  let json;

  try {
    console.log(buildUrl(PUBLIC_STRAPI_API_URL), API_TOKEN);
    
    json = await fetchFromApi(buildUrl(PUBLIC_STRAPI_API_URL), API_TOKEN);
  } catch {
    console.warn('Primary API unreachable, falling back to local');
    json = await fetchFromApi(buildUrl(PUBLIC_LOCAL_API_URL), LOCAL_API_TOKEN);
  }

  return {
    pages: json?.data ?? [],
    pagination: json?.meta?.pagination ?? {},
  };
};