<script>
  import s from './SectionCard.module.css';
  import { PUBLIC_STRAPI_API_URL } from '$env/static/public';

  const IGNORED_KEYS = ['id', '__component', 'type', 'image', 'buttons'];

  let { data, index } = $props();

  const filteredFields = $derived(
    Object.entries(data).filter(
      ([key, value]) =>
        !IGNORED_KEYS.includes(key) &&
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !Array.isArray(value)
    )
  );
</script>

<div class={s.sectionCard}>
  <div class={s.sectionCardHeader}>
    <span class={s.sectionType}>
      {data.type ?? data.__component ?? `Section ${index + 1}`}
    </span>
    {#if data.id}
      <span class={s.cardId}>#{data.id}</span>
    {/if}
  </div>

  {#if data.image?.url}
    <div class={s.imageWrapper}>
      <img
        src={PUBLIC_STRAPI_API_URL + data.image.url}
        alt={data.image.alternativeText ?? data.heading ?? 'Section image'}
        width={data.image.width ?? 600}
        height={data.image.height ?? 400}
        class={s.image}
      />
    </div>
  {/if}

  <div class={s.sectionFields}>
    {#each filteredFields as [key, value]}
      <div class={s.sectionField}>
        <span class={s.sectionFieldKey}>{key}</span>
        <span class={s.sectionFieldValue}>
          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
        </span>
      </div>
    {/each}
  </div>
</div>