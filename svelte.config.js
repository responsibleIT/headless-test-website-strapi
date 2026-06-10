import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		prerender: {
			// A dynamic route whose entries() returns an empty array (e.g. an
			// empty Strapi collection) shouldn't fail the build.
			handleUnseenRoutes: 'warn'
		}
	}
};

export default config;
