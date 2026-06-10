<script>
  let { data } = $props();
  const researchPage = $derived(data.researchPage);

  // Field-name shims (Slug vs slug, ProjectTitel vs title, …)
  // until we lock the interface down.
  const slug = $derived(researchPage?.Slug ?? researchPage?.slug);
  const title = $derived(
    researchPage?.ProjectTitel ??
      researchPage?.Titel ??
      researchPage?.title ??
      researchPage?.Title ??
      slug ??
      `#${researchPage?.id}`
  );
  const description = $derived(
    researchPage?.ProjectBeschrijving ??
      researchPage?.Beschrijving ??
      researchPage?.description ??
      researchPage?.metaDescription ??
      null
  );
</script>

<svelte:head>
  {#if title}
    <title>{title}</title>
  {/if}
  {#if description}
    <meta name="description" content={description} />
  {/if}
</svelte:head>

<main>
  <p><a href="/research-projecten">← Research projects</a></p>

  <h1>{title}</h1>

  {#if description}
    <p>{description}</p>
  {/if}

  <details>
    <summary>Raw item (dev)</summary>
    <pre>{JSON.stringify(researchPage, null, 2)}</pre>
  </details>
</main>
