<script>
	import '/src/styles/index.sass';
	import favicon from '$lib/assets/favicon.ico';
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';

	let progress = $state(0);
	const maxHeight = 218;
	const scrollRange = 40;
	const scrollDelay = 150;
	function handleScroll() {
		const y = window.scrollY;
		progress = Math.min(Math.max((y - scrollDelay) / scrollRange, 0), 1);
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta
		name="description"
		content="Handmade candles and ceramics made in Vienna. Visit one of our 'Candles & Wine' and 'Clay & Vino' workshops || xoxo Sappho Studio"
	/>
	<meta name="author" content="Tetiana" />
	<title>Candles, Keramik und Workshops | Sappho Studio</title>
</svelte:head>

<Header {progress} />

<main style="padding-top: {maxHeight}px;">
	{@render children()}
</main>

<!-- <style lang="sass">
	.page-content
		// padding-top: 200px
</style> -->
