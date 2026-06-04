import type { PageServerLoad } from './$types';
import { API_TOKEN, LOCAL_API_TOKEN } from '$env/static/private';
import { PUBLIC_STRAPI_API_URL, PUBLIC_LOCAL_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

type StudentDetailPage = {
  id: number;
  documentId: string;
  LesJaar: number;
  ProjectTitel: string;
  ProjectBeschrijving: string;
  AantalStudenten: number;
  SchoolJaar: string[];
  Niveau: string[];
  Slug: string;
  Doorlooptijd: string;
  VideoEmbed: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  Onderwijseenheid?: {
    id: number;
    label: string;
    URL: string;
  } | null;
  Bronnen?: Array<{
    id: number;
    Bron: string;
  }>;
  Foto?: {
    id: number;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats?: {
      thumbnail?: any;
      small?: any;
      medium?: any;
      large?: any;
    };
    url: string;
  } | null;
  Audio?: Array<{
    id: number;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    url: string;
  }>;
  Partners?: Array<{
    id: number;
    documentId: string;
    PartnerNaam: string;
    PartnerBeschrijving: string;
    Logo?: {
      id: number;
      name: string;
      url: string;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
  }>;
};

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

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  const path = `/api/student-detail-page/${slug}`;
  const params_obj: Record<string, string> = {};

  const buildUrl = (base: string) => {
    const cleanBase = base.replace(/\/$/, ''); // Remove trailing slash
    const url = new URL(`${cleanBase}${path}`);
    Object.entries(params_obj).forEach(([k, v]) => url.searchParams.set(k, v));
    return url;
  };

  const json = await fetchFromApi(buildUrl(PUBLIC_STRAPI_API_URL), API_TOKEN);

  const item: StudentDetailPage | undefined = json?.data;

  if (!item) {
    throw error(404, 'Student detail page not found');
  }

  const studentPage: StudentDetailPage = {
    id: item.id,
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
    Partners: item.Partners ?? [],
  };

  return { studentPage };
};
