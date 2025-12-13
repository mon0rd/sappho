<script>
	import { onMount } from 'svelte';
	let { events, initialView } = $props();

	let calendarEl;
	let calendar;
	let loading = $state(true);

	onMount(async () => {
		const { Calendar } = await import('@fullcalendar/core');
		const dayGridPlugin = (await import('@fullcalendar/daygrid')).default;
		const listPlugin = (await import('@fullcalendar/list')).default;
		const interactionPlugin = (await import('@fullcalendar/interaction')).default;

		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, interactionPlugin, listPlugin],
			initialView,
			events,
			height: initialView === 'listMonth' ? 'auto' : null,
			headerToolbar: {
				left: '',
				center: 'prev,title,next',
				right: 'today'
			},
			buttonText: {
				today: 'Heute'
			},
			eventClick: (info) => alert(`Event: ${info.event.title}\n${info.event.start}`),
			noEventsText: 'Keine bevorstehenden Veranstaltungen'
		});

		calendar.render();
		loading = false;
	});
</script>

{#if loading}
	<div class="spinner"></div>
{/if}

<div
	bind:this={calendarEl}
	style="visibility: {loading ? 'hidden' : 'visible'}; max-width: 1436px; margin: auto;">
</div>

<style lang="sass">
@use '../../styles/base/_variables.sass' as *;

:global(.fc .fc-toolbar)
	position: relative

:global(.fc-toolbar-chunk > div)
	position: absolute
	left: 50%
	top: 10%
	transform: translateX(-50%)
	display: flex
	align-items: center
	justify-content: center
	justify-self: center
	gap: 32px
	margin: 0 auto

:global(.fc)
	color: $black

:global(.fc .fc-button-primary)	
	color: $black
	background-color: inherit
	border-color: transparent
	&:hover,&:focus
		color: $black
		background-color: inherit
		border-color: transparent
		box-shadow: none
	&:not(:disabled)
		&:active
			color: $black
			background-color: inherit
			border-color: transparent
			&:focus
				box-shadow: none

:global(.fc .fc-today-button)
	&:disabled
		font-size: 14px
		border: 1px solid transparent
		color: $black
		background-color: inherit
		line-height: 19.6px
		padding: 6px 16px
		&:hover
			border: 1px solid transparent			
			text-decoration: none
	&:not(disabled)
		font-size: 14px
		border: 1px solid $black
		border-radius: 0
		line-height: 19.6px
		padding: 6px 16px		
		&:hover
			color: $black
			background-color: inherit
			border-color: transparent
			border: 1px solid $black
			text-decoration: underline

:global(.fc .fc-prev-button),
:global(.fc .fc-next-button)
	font-size: 12px
	// background-color: red
	// margin: 0
	// padding: 0.25em 0.75em
	// cursor: pointer  

:global(.fc .fc-toolbar-title)
	font-size: 18px
	line-height: 27px

</style>
