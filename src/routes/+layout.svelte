<script>
	import '/src/styles/index.sass';
	import favicon from '$lib/assets/favicon.ico';

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

{@render children()}
