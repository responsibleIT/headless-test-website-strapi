import PageCard from './components/PageCard';

const fetchData = async () => {
  const reqOptions = {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  };

  const url = new URL(`${process.env.STRAPI_API_URL}/api/pages`);
  url.searchParams.set('populate[sections][populate]', '*');
  url.searchParams.set('populate[video]', 'true');

  const request = await fetch(url.toString(), reqOptions);
  const response = await request.json();

  console.log('API response:', JSON.stringify(response, null, 2));

  return response;
};

const Home = async () => {
  const response = await fetchData();
  const data = response?.data ?? [];
  const pagination = response?.meta?.pagination ?? {};

  return (
    <main className="pages-container">
      <h1 className="pages-heading">Pages</h1>
      <p className="pages-pagination">
        Showing {data.length} of {pagination.total ?? '?'} page(s) &middot; Page {pagination.page ?? 1}/{pagination.pageCount ?? 1}
      </p>

      <div className="cards-grid">
        {data.map((page) => (
          <PageCard key={page.id} page={page} />
        ))}
      </div>
    </main>
  );
};

export default Home;
