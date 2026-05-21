<!-- src/routes/[slug]/+page.svelte -->
<script lang="ts">
  import SectionCard from '$lib/components/SectionCard/SectionCard.svelte';
  import env from '$env/static/public';

  interface PageData {
    id: number;
    documentId: string;
    title: string;
    slug: string | null;
    metaDescription: string | null;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    video: { url: string | null } | null;
    sections: any[];
  }

  // SvelteKit passes a single `data` prop from +page.server.ts
  // +page.server.ts returns: { page }, so data.page is our PageData
  let { data }: { data: { page: PageData } } = $props();
  const page = $derived(data.page);

  $inspect(page, 'Page data');

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<svelte:head>
  <title>{page.title}</title>
  {#if page.metaDescription}
    <meta name="description" content={page.metaDescription} />
  {/if}
</svelte:head>

<main style="padding: 2rem; max-width: 960px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
  <!-- Header -->
  <header style="display: flex; flex-direction: column; gap: 0.75rem;">
    <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem;">
      <h1 style="font-size: 2rem; font-weight: 600; margin: 0;">
        {page.title}
      </h1>
      <span style="color: #999; font-size: 0.85rem;">#{page.id}</span>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; font-size: 0.9rem; color: #555;">
      <span><strong>Slug:</strong> {page.slug ?? '—'}</span>
      <span><strong>Created:</strong> {formatDate(page.createdAt)}</span>
      <span><strong>Updated:</strong> {formatDate(page.updatedAt)}</span>
      <span title={page.documentId}>
        <strong>Doc ID:</strong> {page.documentId.slice(0, 12)}…
      </span>
      {#if page.publishedAt}
        <span style="background:#e6f8ed; color:#2f855a; padding:0.1rem 0.4rem; border-radius:999px;">
          ✓ Published
        </span>
      {/if}
    </div>

    {#if page.metaDescription}
      <p style="margin: 0.25rem 0 0; color: #555;">
        {page.metaDescription}
      </p>
    {/if}
  </header>

  <!-- Video (optional) -->
  {#if page.video?.url}
    <section aria-label="Page video" style="border-radius: 8px; overflow: hidden; border: 1px solid #eee;">
      <video
        src={env.PUBLIC_STRAPI_API_URL + page.video.url}
        controls
        style="width: 100%; max-height: 480px; display: block; background: #000;"
      >
        <track kind="captions" />
      </video>
    </section>
  {/if}

  <!-- Sections -->
  <section style="display: flex; flex-direction: column; gap: 1rem;">
    <h2 style="font-size: 1.3rem; margin: 0;">
      Sections ({page.sections.length})
    </h2>

    {#if page.sections.length === 0}
      <p style="color:#777;">No sections on this page.</p>
    {:else}
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        {#each page.sections as section, i (section.id ?? i)}
          <SectionCard data={section} index={i} />
        {/each}
      </div>
    {/if}
  </section>
</main>