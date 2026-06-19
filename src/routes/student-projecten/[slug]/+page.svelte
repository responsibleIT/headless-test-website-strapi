<script>
 import { PUBLIC_STRAPI_API_URL } from '$env/static/public';

  let { data } = $props();
  const studentPage = $derived(data.studentPage);

  // Ensure we don't end up with "//uploads"
  const STRAPI_BASE = PUBLIC_STRAPI_API_URL.replace(/\/$/, '');
</script>

<main>
  {#if studentPage?.ProjectTitel}
    <h1>{studentPage?.ProjectTitel}</h1>
  {/if}

  {#if studentPage?.ProjectBeschrijving}
    <section>
      <h2>Description</h2>
      <p>{studentPage?.ProjectBeschrijving}</p>
    </section>
  {/if}

  {#if studentPage?.VideoEmbed}
    <section>
      <h2>Video</h2>
      <div class="video-embed">
        <iframe
          src={studentPage?.VideoEmbed}
          title="Project video"
          allowfullscreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    </section>
  {/if}

  <section class="project-info">
    {#if studentPage?.AantalStudenten}
      <div>
        <strong>Number of Students:</strong> {studentPage?.AantalStudenten}
      </div>
    {/if}

    {#if studentPage?.SchoolJaar && studentPage?.SchoolJaar.length > 0}
      <div>
        <strong>School Year:</strong> {studentPage?.SchoolJaar.join(', ')}
      </div>
    {/if}

    {#if studentPage?.Niveau && studentPage?.Niveau.length > 0}
      <div>
        <strong>Level:</strong> {studentPage?.Niveau.join(', ')}
      </div>
    {/if}

    {#if studentPage?.Doorlooptijd}
      <div>
        <strong>Duration:</strong> {studentPage?.Doorlooptijd}
      </div>
    {/if}

    {#if studentPage?.LesJaar}
      <div>
        <strong>Academic Year:</strong> {studentPage?.LesJaar}
      </div>
    {/if}
  </section>

  {#if studentPage?.Onderwijseenheid}
    <section>
      <h2>Educational Unit</h2>
      <p>
        {#if studentPage?.Onderwijseenheid.URL}
          <a href={studentPage?.Onderwijseenheid.URL} target="_blank" rel="noopener noreferrer">
            {studentPage?.Onderwijseenheid.label}
          </a>
        {:else}
          {studentPage?.Onderwijseenheid.label}
        {/if}
      </p>
    </section>
  {/if}

  {#if studentPage?.Foto}
    <section>
      <h2>Project Image</h2>
      <img
        src={STRAPI_BASE + studentPage.Foto.url}
        alt={studentPage.Foto.alternativeText || studentPage.ProjectTitel}
        title={studentPage.Foto.caption}
      />
    </section>
  {/if}

  {#if studentPage?.Audio && studentPage.Audio.length > 0}
    <section>
      <h2>Audio</h2>
      <div class="audio-list">
        {#each studentPage.Audio as audio (audio.id)}
          <div class="audio-item">
            <p>{audio.alternativeText || audio.name}</p>
            <audio controls>
              <source src={STRAPI_BASE + audio.url} />
            </audio>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  {#if studentPage?.Bronnen && studentPage?.Bronnen.length > 0}
    <section>
      <h2>Sources & Resources</h2>
      <ul>
        {#each studentPage?.Bronnen as bron (bron.id)}
          <li>
            <a href={bron.Bron} target="_blank" rel="noopener noreferrer">
              {bron.Bron}
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if studentPage?.Partners && studentPage.Partners.length > 0}
    <section>
      <h2>Partners</h2>
      <div class="partners-list">
        {#each studentPage.Partners as partner (partner.id)}
          <div class="partner-item">
            {#if partner.Logo}
              <img src={STRAPI_BASE + partner.Logo.url} alt={partner.PartnerNaam} />
            {/if}
            <h3>{partner.PartnerNaam}</h3>
            {#if partner.PartnerBeschrijving}
              <p>{partner.PartnerBeschrijving}</p>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/if}
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  section {
    margin: 2rem 0;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.5rem;
    margin: 1rem 0 0.5rem 0;
  }

  h3 {
    margin: 0.5rem 0;
  }

  .project-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
  }

  .video-embed {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
  }

  .video-embed iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  .audio-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .audio-item {
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 4px;
  }

  .audio-item audio {
    width: 100%;
    margin-top: 0.5rem;
  }

  .partners-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .partner-item {
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 4px;
    text-align: center;
  }

  .partner-item img {
    max-width: 100%;
    height: auto;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  ul li {
    margin: 0.5rem 0;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
</style>
