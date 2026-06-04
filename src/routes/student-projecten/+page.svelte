<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<main>
  <h1>Student Projects</h1>
  <p>Showing {data.studentPages.length} of {data.pagination.total ?? '?'} project(s)</p>

  <ul>
    {#each data.studentPages as project (project.id)}
      <li>
        <a href="/student-detail/{project.Slug}">
          {project.ProjectTitel}
        </a>
      </li>
    {/each}
  </ul>
</main>