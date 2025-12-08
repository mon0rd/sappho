<script>
	// Links arr for mapping
	const links = [
		{ href: '/events', text: 'Events' },
		{ href: '/candles', text: 'Candles' },
		{ href: '/ceramics', text: 'Ceramics' },
		{ href: '/merch', text: 'Merch' },
		{ href: '/gift', text: 'Gift Card' }
	];

	// MorphingHeader by scroll
	let { progress } = $props(); // scroll increment
	const lerp = (a, b, t) => a + (b - a) * t; // interpolation
	let headerHeight = $derived(lerp(178, 22, progress)); // header height resize
	let paddingTop = $derived(lerp(32, 8, progress)); // header top padding resize
	let logoWidth = $derived(lerp(370, 550, progress)); // logo width to unwrap
	let logoScale = $derived(lerp(1, 16 / 40, progress)); // main logo font rescale
	let navScale = $derived(lerp(1, 16 / 18, progress)); // links font resize
	let navLinkPadding = $derived(lerp(10, 7, progress)); // links clickable area resize
	let verticalOffset = $derived(lerp(0, 60, progress) * -1); // move links up
	let horizontalOffset = $derived(lerp(0, 225, progress)); // spread logo & links left and right
</script>

<header
	style="
    --headerHeight: {headerHeight}px; 
    --logoWidth: {logoWidth}px; 
    --paddingTop:{paddingTop}px">
	<a
		class="main_logo"
		href="/"
		style="--logoScale: {logoScale}; --horizontalOffset:{horizontalOffset}px;">
		<h1 class="title_h1">SAPPHO STUDIO</h1>
	</a>
	<nav style="--horizontalOffset: {horizontalOffset}px; --verticalOffset: {verticalOffset}px;">
		<ul class="navbar" style=" --navScale: {navScale};">
			{#each links as link}
				<li><a style="--navLinkPadding: {navLinkPadding}px;" href={link.href}>{link.text}</a></li>
			{/each}
		</ul>
	</nav>
</header>

<style lang="sass">
@use '../../styles/base/_variables.sass' as *;

header
    position: fixed
    display: grid
    justify-content: center
    align-items: center
    height: var(--headerHeight)
    width: auto
    top: 0
    left: 0
    right: 0
    z-index: 999
    background-color: $beige
    padding-top: var(--paddingTop) 
    padding-bottom: calc(var(--paddingTop)/4)
    transition: all 0.1s linear    
    transform-origin: top center

.main_logo
    width: var(--logoWidth)
    text-decoration: none
    color: inherit
    transform-origin: top center
    transform: translateX(calc(var(--horizontalOffset)*-1)) scale(var(--logoScale))
    transition: all 0.1s linear

nav
    transition: all 0.1s linear        
    transform: translate(calc(var(--horizontalOffset)*1.4), var(--verticalOffset))
    .navbar
        display: flex
        list-style: none
        padding: 0
        font-size: 18px
        transform: scale(var(--navScale))
        line-height: calc(var(--navScale)*1.5)
        a        
            text-decoration: none
            color: inherit
            padding: var(--navLinkPadding) 10px
</style>
