<script>
	// Links arr for mapping
	const links = [
		{ href: '/events', text: 'Events' },
		{ href: '/candles', text: 'Candles' },
		{ href: '/ceramics', text: 'Ceramics' },
		{ href: '/merch', text: 'Merch' },
		{ href: '/gift-card', text: 'Gift Card' }
	];

	// MorphingHeader by scroll
	let { progress } = $props(); // scroll increment
	const lerp = (a, b, t) => a + (b - a) * t; // interpolation
	let headerHeight = $derived(lerp(178, 22, progress)); // header height resize
	let paddingTop = $derived(lerp(40, 8, progress)); // header top padding resize
	let logoFont = $derived(lerp(40, 16, progress)); // main logo font resize
	let navFont = $derived(lerp(18, 16, progress)); // links font resize
	let navLinkPadding = $derived(lerp(10, 7, progress)); // links clickable area resize
	let verticalOffset = $derived(lerp(0, 27, progress)); // move links up
	let horizontalOffset = $derived(lerp(0, 170, progress)); // spread logo & links left and right
</script>

<header style="--headerHeight: {headerHeight}px; --paddingTop: {paddingTop}px">
	<a class="main_logo" href="/"
		><h1
			class="title_h1"
			style="--logoFont: {logoFont}px;      
            --horizontalOffset:-{horizontalOffset}px"
		>
			SAPPHO STUDIO
		</h1></a
	>
	<nav>
		<ul
			class="navbar"
			style="            
        --navFont: {navFont}px;
        --verticalOffset: -{verticalOffset}px;
        --horizontalOffset: {horizontalOffset}px;
    "
		>
			{#each links as link}
				<li><a style="--navLinkPadding: {navLinkPadding}px;" href={link.href}>{link.text}</a></li>
			{/each}
		</ul>
	</nav>
</header>

<style lang="sass">
@import '../../styles/base/_variables.sass'

header
    position: fixed
    display: grid
    justify-content: center
    align-items: center
    width: 100%
    height: var(--headerHeight)
    top: 0
    background-color: $beige
    padding-top: var(--paddingTop) 
    padding-bottom: calc(var(--paddingTop)/4)
    transition: all 0.1s linear

.main_logo
    display: flex
    text-align: center
    justify-content: center
    margin: 0 auto
    width: 370px
    text-decoration: none
    color: inherit
    .title_h1
        transition: all 0.1s linear
        transform: translateX(var(--horizontalOffset))
        font-size: var(--logoFont)
        text-align: center

nav
    display: flex
    text-align: center
    margin: 0 auto
    width: max-content
    transition: all 0.1s linear
    .navbar
        display: flex
        text-align: center
        list-style: none
        padding: 0
        height: max-content
        transform: translate(var(--horizontalOffset), var(--verticalOffset))
        font-size: var(--navFont)
        line-height: calc(var(--navFont)*1.5)
        a        
            text-decoration: none
            color: inherit
            padding: var(--navLinkPadding) 10px
</style>
