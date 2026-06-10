<script>
  import SectionCard from '$lib/components/SectionCard/SectionCard.svelte';
  import { PUBLIC_STRAPI_API_URL } from '$env/static/public';

  let { data } = $props();
  const page = $derived(data.page);
</script>

<svelte:head>
  <title>{page.title}</title>
  {#if page.metaDescription}
    <meta name="description" content={page.metaDescription} />
  {/if}
</svelte:head>

<main>
  <p><a href="/">← Home</a></p>

  <h1>{page.title}</h1>

  {#if page.metaDescription}
    <p>{page.metaDescription}</p>
  {/if}

  {#if page.video?.url}
    <video src={PUBLIC_STRAPI_API_URL + page.video.url} controls>
      <track kind="captions" />
    </video>
  {/if}

  {#if page.sections.length > 0}
    <section>
      <h2>Sections</h2>
      {#each page.sections as section, i (section.id ?? i)}
        <SectionCard data={section} index={i} />
      {/each}
    </section>
  {/if}
</main>
