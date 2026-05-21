<script lang="ts">
  import PageCard from '$lib/components/PageCard/PageCard.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  console.log(data);
</script>

<main class="pages-container">
  <h1 class="pages-heading">Pages</h1>
  <p class="pages-pagination">
    Showing {data.pages.length} of {data.pagination.total ?? '?'} page(s)
    &middot; Page {data.pagination.page ?? 1}/{data.pagination.pageCount ?? 1}
  </p>

  <div class="cards-grid">
    {#each data.pages as page (page.id)}
      <PageCard data={page} />
    {/each}
  </div>
</main>