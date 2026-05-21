<script lang="ts">
  import SectionCard from '$lib/components/SectionCard/SectionCard.svelte';
import env from '$env/static/public';
  import s from './PageCard.module.css';

  interface Props {
    data: Record<string, any>;
  }

  let { data }: Props = $props();
  let open = $state(false);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div
  class={s.card + (open ? ' ' + s['card--open'] : '')}
  role="button"
  tabindex="0"
  onclick={() => (open = !open)}
  onkeydown={(e) => e.key === 'Enter' && (open = !open)}
>
  {#if data.video?.url}
    <div class={s.cardVideoWrapper} onclick={(e) => e.stopPropagation()}>
      <video
        src={env.PUBLIC_STRAPI_API_URL + data.video.url}
        controls
        class={s.cardVideo}
      >
        <track kind="captions" />
      </video>
    </div>
  {/if}

  <div class={s.cardHeader}>
    {#if data.slug}
      <a
        href={'/' + data.slug}
        class={s.cardTitle}
        onclick={(e) => e.stopPropagation()}
      >
        {data.title}
      </a>
    {:else}
      <span class={s.cardTitle}>{data.title}</span>
    {/if}
    <div class={s.cardHeaderRight}>
      <span class={s.cardId}>#{data.id}</span>
      <span class={s.cardChevron}>{open ? '▲' : '▼'}</span>
    </div>
  </div>

  <p class={s.cardMeta}>
    {#if data.metaDescription}
      {data.metaDescription}
    {:else}
      <em>No description</em>
    {/if}
  </p>

  <div class={s.cardBadges}>
    <span class={s.badge + ' ' + s.badgeSections}>
      {data.sections.length} section{data.sections.length !== 1 ? 's' : ''}
    </span>
    {#if data.video}
      <span class={s.badge + ' ' + s.badgeVideo}>▶ Video</span>
    {/if}
    {#if data.publishedAt}
      <span class={s.badge + ' ' + s.badgePublished}>✓ Published</span>
    {/if}
  </div>

  <hr class={s.cardDivider} />

  <div class={s.cardFooter}>
    <span>
      <strong>Slug:</strong>
      {#if data.slug}
        {data.slug}
      {:else}
        <span class={s.slugMissing}>—</span>
      {/if}
    </span>
    <span><strong>Created:</strong> {formatDate(data.createdAt)}</span>
    <span><strong>Updated:</strong> {formatDate(data.updatedAt)}</span>
    <span title={data.documentId}>
      <strong>Doc ID:</strong> {data.documentId.slice(0, 12)}…
    </span>
  </div>

  {#if open}
    <button class={s.cardSections} onclick={(e) => e.stopPropagation()}>
      <hr class={s.cardDivider} />
      <p class={s.sectionsHeading}>Sections</p>
      {#if data.sections.length === 0}
        <p class={s.noSections}>No sections on this page.</p>
      {:else}
        <div class={s.sectionsList}>
          {#each data.sections as section, i (section.id ?? i)}
            <SectionCard data={section} index={i} />
          {/each}
        </div>
      {/if}
    </button>
  {/if}
</div>