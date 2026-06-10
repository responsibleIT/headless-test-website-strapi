<script>
  import SectionCard from '$lib/components/SectionCard/SectionCard.svelte';
  import { PUBLIC_STRAPI_API_URL } from '$env/static/public';
  import '../styles/pages/home.module.css'

  let { data } = $props();
  const homePage = $derived(data.homePage);
</script>

<svelte:head>
  {#if homePage?.title}
    <title>{homePage.title}</title>
  {/if}
  {#if homePage?.metaDescription}
    <meta name="description" content={homePage.metaDescription} />
  {/if}
</svelte:head>

<main>
  {#if homePage}
    <h1>{homePage.title}</h1>

    {#if homePage.metaDescription}
      <p>{homePage.metaDescription}</p>
    {/if}

    {#if homePage.video?.url}
      <video src={PUBLIC_STRAPI_API_URL + homePage.video.url} controls>
        <track kind="captions" />
      </video>
    {/if}

    {#if homePage.sections.length > 0}
      <section>
        <h2>Sections</h2>
        {#each homePage.sections as section, i (section.id ?? i)}
          <SectionCard data={section} index={i} />
        {/each}
      </section>
    {/if}
  {:else}
    <h1>Pages</h1>
    <p><em>No "home" page found in Strapi.</em></p>
  {/if}

  <hr />

  <h2>All pages</h2>
  <ul>
    {#each data.pages as page (page.id)}
      <li>
        {#if page.slug}
          <a href="/{page.slug}">{page.title ?? page.slug}</a>
        {:else}
          <span>{page.title ?? `#${page.id}`} (no slug)</span>
        {/if}
      </li>
    {/each}
    <li>
          <a href="/student-projecten">student-projecten</a>
    </li>
    <li>
          <a href="/research-projecten">research-projecten</a>
    </li>
  </ul>
</main>
