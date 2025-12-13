<script>
	import '/src/styles/index.sass';
	import favicon from '$lib/assets/favicon.ico';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let progress = $state(0);
	const maxHeight = 228;
	const scrollRange = 40;
	const scrollDelay = 0;
	
	function handleScroll() {
		const y = window.scrollY;
		progress = Math.min(Math.max((y - scrollDelay) / scrollRange, 0), 1);
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => window.removeEventListener('scroll', handleScroll);
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta
		name="description"
		content="Handmade candles and ceramics made in Vienna. Visit one of our 'Candles & Wine' and 'Clay & Vino' workshops || xoxo Sappho Studio" />
	<meta name="author" content="Tetiana" />
	<title>Candles, Keramik und Workshops | Sappho Studio</title>
</svelte:head>

<div class="wrapper">
	<Header {progress} />
	<main style="padding-top: {maxHeight}px;">
		{@render children()}
	</main>
	<Footer />
</div>

<style lang="sass">
.wrapper
	padding: 0 50px
</style>
