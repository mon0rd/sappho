<script>
	import Calendar from '$lib/components/Calendar.svelte';
	import Map from '$lib/components/Map.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
</script>

<section class="promo">
	<div class="promo_wrapper">
		<a href="https://fb.me/e/6g8VfM1pV" class="promo_wrapper_img" target="_blank">
			<img src="/images/NewYearHorse.avif" alt="NewYearHorse" />
		</a>
		<div class="promo_wrapper_descr">
			<a href="https://fb.me/e/6g8VfM1pV" target="_blank">
				<h2 class="title_h2">Kreativer Pop-Up:<br />Kerzen & Keramik</h2>
			</a>
			<a href="https://fb.me/e/6g8VfM1pV" target="_blank">
				<h3 class="title_h3">
					8.-12. Dezember<br />12:00 - 19:00<br />Wiener Straße 13, St. Pölten
				</h3>
			</a>
		</div>
	</div>
</section>
<section class="pages">
	<div class="pages_wrapper">
		<a href="/all" class="pages_all">
			<img src="/images/redwhitecubes.avif" alt="redwhitecubes" class="pages_all_img" />
			<span class="pages_all_text">Alle Produkte</span>
		</a>
		<div class="pages_double_wrapper">
			<a href="/candles" class="pages_candles">
				<img src="/images/CandleInHand.jpg" alt="CandleInHand" class="pages_candles_img" />
				<span class="pages_candles_text">Duftkerzen</span>
			</a>
			<a href="/ceramics" class="pages_ceramics">
				<img src="/images/NakedPhalanx.jpg" alt="NakedPhalanx" class="pages_ceramics_img" />
				<span class="pages_ceramics_text">Keramik</span>
			</a>
		</div>
		<a href="/gift" class="pages_gift">
			<img src="/images/CandleBowKnot.avif" alt="CandleBowKnot" class="pages_gift_img" />
			<span class="pages_gift_text">Gutschein</span>
		</a>
	</div>
</section>
<section class="info">
	<div class="info_wrapper">
		<h2 class="title_h2">Was wir für dich zaubern</h2>
		<p class="info_text">
			Sappho Studio ist ein in Wien ansässiger Kreativraum, der sich auf Home-Décor und
			künstlerischen Ausdruck spezialisiert. <br />
			Von inspirierenden Firmenworkshops bis hin zu liebevoll handgefertigten Geschenken - entdecken Sie
			echte Ästhetik in jedem Detail. <br />
			Wir bieten auch B2B-Lösungen und Großhandelsmöglichkeiten an.
		</p>
		<div class="info_grid_wrapper">
			<div class="info_candlemaking">
				<img
					src="/images/RichBitchEnergy.jpg"
					alt="RichBitchEnergy"
					class="info_candlemaking_img" />
				<h3 class="title_h3">Candlemaking</h3>
				<p class="info_candlemaking_text">
					Kaufe eine handgefertigte Kerze aus lokalem Rapswachs - veredelt mit Glitzer und
					verschiedenen wundervollen Düften. <br />Außerdem kannst du eine individuell gestaltete
					Kerze für dein Unternehmen, dein Event oder jeden besonderen Anlass bestellen.
				</p>
			</div>
			<div class="info_workshops">
				<img src="/images/Workshop.jpg" alt="RichBitchEnergy" class="info_workshops_img" />
				<h3 class="title_h3">Creative Workshops</h3>
				<p class="info_workshops_text">
					Nimm an unseren kreativen Erlebnissen teil - „Candles & Wine“ oder „Clay & Vino“ - perfekt
					für Gruppen von Freund:innen, Kolleg:innen oder Familie. <br />Sieh dir unseren Kalender
					für kommende Termine an oder buche einen privaten Workshop für Gruppen ab 5 Personen.
				</p>
			</div>
			<div class="info_ceramics">
				<img src="/images/WhiteCups.jpg" alt="WhiteCups" class="info_ceramics_img" />
				<h3 class="title_h3">Handmade Ceramics</h3>
				<p class="info_ceramics_text">
					Vasen, inspiriert von der antiken griechischen, sowie handgefertigte Tassen und Becher.<br />
					Jedes Stück ist individuell geformt und glasiert - zeitlose Handwerkskunst für deinen Alltag.
					<br />Auf Wunsch können die Keramiken auch mit dem Logo und Stil deines Unternehmens
					produziert werden.
				</p>
			</div>
		</div>
	</div>
</section>
<section class="events">
	<a href="/events"><h2 class="title_h2">Bevorstehende Veranstaltungen</h2></a>
	<div class="calendar">
		{#await data.upcomingEvents}
			<div class="spinner"></div>
		{:then upcomingEvents}
			<Calendar {upcomingEvents} initialView={'listMonth'} validRange={{ start: new Date() }} />
		{:catch}
			<p style="text-align: center; font-size: 24px">Failed to load events</p>
		{/await}
	</div>
</section>
<section class="contact">
	<div class="contact_wrapper">
		<h2 class="title_h2">Contact Us</h2>
		<div class="contact_inner_wrapper">
			<div>
				<h3 class="title_h3">Address</h3>
				<span class="contact_address">Berggasse 16, 1090, Vienna, Austria</span>
			</div>
			<div>
				<h3 class="title_h3">Contact</h3>
				<a href="mailto:office@sapphostudio.shop" class="contact_email">office@sapphostudio.shop</a>
			</div>
			<div>
				<h3 class="title_h3">Follow us</h3>
				<div class="contact_socials">
					<a
						href="https://www.instagram.com/sappho_studio/"
						target="_blank"
						rel="noopener noreferrer">
						<img src="/icons/InstagramColored.svg" alt="instagram" class="contact_socials_insta" />
					</a>
					<a
						href="https://www.facebook.com/sappho.studio/"
						target="_blank"
						rel="noopener noreferrer">
						<img src="/icons/FacebookColored.svg" alt="facebook" class="contact_socials_fb" />
					</a>
				</div>
			</div>
		</div>
		<div class="contact_map">
			<Map />
		</div>
	</div>
</section>

<style lang="sass">
@use '../styles/base/_variables.sass' as *;	

.promo
	padding-right: 292px
	&_wrapper
		pointer-events: none
		display: flex
		width: 100%   
		justify-content: center
		&_img
			pointer-events: auto
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
			a
				pointer-events: auto
				text-decoration: none
				color: inherit
				width: max-content
				background-color: $beige

.pages
	margin-top: 100px
	display: flex	
	justify-content: center
	&_wrapper
		display: flex
		flex-direction: column
		gap: 30px
		min-width: 1420px
	a
		position: relative
		img
			object-fit: cover
			width: 100%
			height: 100%
	span
		position: absolute
		left: 50%
		top: 50%
		transform: translate(-50%, -50%)
		z-index: 899
		color: white
	&_double_wrapper
		display: flex
		gap: 20px
		width: 100%
		height: 400px
		font-size: 66px
		a
			width: 50%
			overflow: hidden
	&_ceramics
		&_img
			transform: (translateX(-3%) scale(1.2))
			object-position: 0 106%
	&_all, &_gift
		overflow: hidden
		height: 335px
		&_text			
			font-size: 88px
	&_all
		&_img
			object-position: 0 55%
	&_gift
		&_img
			object-position: 0 43%

.info
	margin-top: 100px
	text-align: center
	display: flex
	justify-content: center
	&_wrapper
		display: flex
		flex-direction: column
		width: 1420px
		min-width: 1420px
	&_text
		font-size: 20px
		line-height: 33px
		width: max-content
		margin: 0 auto
	&_grid_wrapper
		margin-top: 20px
		display: grid
		grid-template-columns: repeat(3, 1fr)
		gap: 20px
		img
			height: 388px
			width: 100%
			object-fit: cover
	.title_h3
		text-align: left
		margin-top: 30px
		font-size: 36px
		line-height: 43px
	&_candlemaking, &_workshops, &_ceramics
		&_text
			text-align: justify
			font-size: 18px
			line-height: 30px
	&_workshops
		&_img
			object-position: 0 20%

.events
	margin-top: 100px
	a
		text-align: center
		text-decoration: none
		color: inherit

.contact
	margin-top: 100px
	display: flex
	justify-content: center
	.title_h2
		text-align: center
	&_inner_wrapper
		margin: 60px auto 0 auto
		display: flex
		width: 924px
		gap: 105px
		:nth-child(3)
			margin-left: 50px
		.title_h3
			font-size: 26px	
	&_address, &_email, &_socials
		display: block
		margin-top: 27px
		text-decoration: none
		color: inherit
	&_socials
		display: flex
		align-items: center
		gap: 20px
		&_insta
			width: 1.125rem
			height: 1.125rem
		&_fb
			width: 1.375rem
			height: 1.25rem
	&_map
		margin: 35px auto 0 auto
		width: 980px
		height: 350px

</style>
