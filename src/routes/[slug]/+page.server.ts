// src/routes/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { API_TOKEN } from '$env/static/private';
import { PUBLIC_STRAPI_API_URL } from '$env/static/public';

import { error } from '@sveltejs/kit';

type StrapiPage = {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  video?: { url: string | null } | null;
  sections?: any[] | null;
};

export const load: PageServerLoad = async ({ fetch, params }) => {
  const { slug } = params;

  const url =
    `${PUBLIC_STRAPI_API_URL}/api/student-detail-pages` +
    `?filters[slug][$eq]=${encodeURIComponent(slug)}` +
    `&populate=*`; // 👈 valid in Strapi v5

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Strapi error', res.status, body);
    throw error(res.status, 'Failed to load page from Strapi');
  }

  const json = await res.json();
  const item: StrapiPage | undefined = json.data?.[0];

  if (!item) {
    throw error(404, 'Page not found');
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
    sections: item.sections ?? [],
  };

  console.log(page, "SERVER")
  return { page };
};