<script>
</script>

<section class="promo">
	<div class="promo_wrapper">
		<a href="https://fb.me/e/6g8VfM1pV" class="promo_wrapper_img">
			<img src="/images/NewYearHorse.jpg" alt="NewYearHorse" />
		</a>
		<div class="promo_wrapper_descr">
			<h2 class="title_h2">Kreativer Pop-Up:<br />Kerzen & Keramik</h2>
			<h3 class="title_h3">
				8.-12. Dezember<br />12:00 - 19:00<br />Wiener Straße 13, St. Pölten
			</h3>
		</div>
	</div>
</section>
<section class="pages">
	<a href="/all" class="pages_all">
		<img src="/images/redwhitecubes.jpg" alt="redwhitecubes" class="pages_all_img" />
		<span class="pages_all_text">Alle Produkte</span>
	</a>
	<div class="pages_wrapper">
		<a href="https://fb.me/e/6g8VfM1pV" class="promo_w">
			<img src="/images/NewYearHorse.jpg" alt="NewYearHorse" />
			<span class="pages_all_t">Alle Produkte</span>
		</a>
		<a href="https://fb.me/e/6g8VfM1pV" class="promo_w">
			<img src="/images/NewYearHorse.jpg" alt="NewYearHorse" />
			<span class="pages_all_t">Alle Produkte</span>
		</a>
	</div>

	<a href="https://fb.me/e/6g8VfM1pV" class="promo_w">
		<img src="/images/NewYearHorse.jpg" alt="NewYearHorse" />
		<span class="pages_all_t">Alle Produkte</span>
	</a>
</section>

<style lang="sass">
@use '../styles/base/_variables.sass' as *;

.promo
	padding-right: 292px
	&_wrapper
		display: flex
		width: 100%   
		justify-content: center
		&_img
			min-width: 850px
			height: 515px
			overflow: hidden
			img
				flex-shrink: 0
				width: 100%
				height: 100%
				object-fit: cover
				object-position: 0 48%
		&_descr
			display: flex
			flex-direction: column
			justify-content: space-between
			padding: 38px 0
			margin-left: -100px
			.title
				&_h2, &_h3
					background-color: $beige
					width: max-content

.pages
	margin-top: 100px
	// max-width: 1518px
	display: flex
	flex-direction: column
	gap: 20px		
	a
		position: relative
		max-width: 100%
		img
			object-fit: cover
			max-width: 100%
	// margin-left: auto
	// margin-right: auto
	// grid-template-columns: repeat(2, 1fr)
	// gap: 24px
	&_wrapper
		display: flex
		gap: 20px
		margin: 0 auto
		width: 100%


		// 
	// a
	// 	max-width: 1518px
	// 	justify-self: center
	// a:nth-child(1),
	// a:nth-child(4)
	// 	grid-column: 1 / -1
	&_all
		display: block
		overflow: hidden
		height: 335px
	span
		position: absolute
		left: 50%
		top: 50%
		font-size: 50px
		transform: translate(-50%, -50%)
		z-index: 899
		color: white

</style>
