import type { PageServerLoad } from './$types';
import {STRAPI_API_URL, API_TOKEN} from '$env/static/private';

export const load: PageServerLoad = async () => {
  const url = new URL(`${STRAPI_API_URL}/api/pages`);
  url.searchParams.set('populate[sections][populate]', '*');
  url.searchParams.set('populate[video]', 'true');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  const json = await response.json();

  return {
    pages: json?.data ?? [],
    pagination: json?.meta?.pagination ?? {},
  };
};