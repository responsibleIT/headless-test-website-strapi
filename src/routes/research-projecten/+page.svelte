<script>
  let { data } = $props();

  // Strapi's UID field could be `Slug` (like student-projecten) or `slug`.
  // We don't know yet for this collection, so we coalesce both.
  function getSlug(item) {
    return item.Slug ?? item.slug;
  }

  function getTitle(item) {
    return (
      item.ProjectTitel ??
      item.Titel ??
      item.title ??
      item.Title ??
      getSlug(item) ??
      `#${item.id}`
    );
  }
</script>

<main>
  <h1>Research Projects</h1>
  <p>
    Showing {data.researchPages.length} of {data.pagination.total ?? '?'} project(s)
  </p>

  {#if data.researchPages.length === 0}
    <p><em>No research projects in Strapi yet.</em></p>
  {:else}
    <ul>
      {#each data.researchPages as project (project.id)}
        {@const slug = getSlug(project)}
        <li>
          {#if slug}
            <a href="/research-projecten/{slug}">{getTitle(project)}</a>
          {:else}
            <span>{getTitle(project)} (no slug)</span>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}

  <p><a href="/">← Home</a></p>
</main>
