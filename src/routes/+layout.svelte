<script>
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import '../styles/general.css';

	let { children } = $props();

	// Hidden shortcut: press Enter, then Enter, then Backspace to strip the
	// decorative body::before / body::after overlays defined in
	// styles/pages/home.module.css. CSS does the actual hiding via
	// `body.revealed::before/after`; we just toggle the class here.
	// The "revealed" state is persisted in localStorage for REVEAL_TTL_MS so
	// the gesture only needs to be performed once per browser per period.
	const REVEAL_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

	onMount(() => {
		const SEQUENCE = ['Enter', 'Enter', 'Backspace'];
		let progress = 0;

		function reveal() {
			document.body.classList.add('revealed');
			try {
				localStorage.setItem(
					'body-revealed-until',
					String(Date.now() + REVEAL_TTL_MS)
				);
			} catch (_) {
				/* localStorage unavailable — ignore */
			}
		}

		// @ts-ignore
		function handleKeydown(e) {
			if (e.key === SEQUENCE[progress]) {
				progress++;
				if (progress === SEQUENCE.length) {
					reveal();
					progress = 0;
				}
			} else {
				// Allow the wrong key to also be the first key of a new attempt.
				progress = e.key === SEQUENCE[0] ? 1 : 0;
			}
		}

		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<main>
	{@render children()}
</main>
