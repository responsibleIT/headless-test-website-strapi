import type { PageServerLoad } from './$types';
import {API_TOKEN} from '$env/static/private';
import {PUBLIC_STRAPI_API_URL, PUBLIC_LOCAL_API_URL} from '$env/static/public';

export const load: PageServerLoad = async () => {
  const url = new URL(`${PUBLIC_STRAPI_API_URL}/api/research-detail-pages`);

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

const fetchAllPages = async () => {}