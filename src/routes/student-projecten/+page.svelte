<script>
  let { data } = $props();
</script>

<main>
  <h1>Student Projects</h1>
  <p>Showing {data.studentPages.length} of {data.pagination.total ?? '?'} project(s)</p>

  <ul>
    {#each data.studentPages as project (project.id)}
      <li>
        <a href="/student-projecten/{project.Slug}">
          {project.ProjectTitel}
        </a>
      </li>
    {/each}
  </ul>
</main>