<script>
	import { onMount } from 'svelte';
	import Modal from './Modal.svelte';

	let { events, initialView } = $props();

	let calendarEl;
	let calendar;
	let loading = $state(true);
	let modal = $state({ events: [], position: {}, open: false });

	onMount(async () => {
		const { Calendar } = await import('@fullcalendar/core');
		const dayGridPlugin = (await import('@fullcalendar/daygrid')).default;
		const listPlugin = (await import('@fullcalendar/list')).default;
		const interactionPlugin = (await import('@fullcalendar/interaction')).default;

		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, interactionPlugin, listPlugin],
			initialView,
			events,
			height: 'auto',
			locale: 'de',
			firstDay: 1,
			fixedWeekCount: false,
			dayMaxEvents: 1,
			headerToolbar: {
				left: '',
				center: 'prev,title,next',
				right: 'today'
			},
			buttonText: {
				today: 'Heute'
			},
			eventContent(arg) {
				const eventDate = arg.event.start.toLocaleDateString('en-CA');

				const time = arg.event.start.toLocaleTimeString('de-DE', {
					hour: '2-digit',
					minute: '2-digit'
				});

				return {
					html: `<div>
					<span class="event-time">${time}</span><br/>
					<span class="event-title">${arg.event.title}</span>
           			</div>`
				};
			},
			dateClick(info) {
				const clickedDay = events.filter((e) => e.start.startsWith(info.dateStr));

				if (clickedDay.length) {
					const rect = info.dayEl.getBoundingClientRect();
					const row = info.dayEl.parentElement.rowIndex + 1;
					const column = info.dayEl.cellIndex + 1;

					if (modal.open && modal.events[0]?.start.startsWith(info.dateStr)) {
						modal = { ...modal, open: false, events: [] };
					} else {
						modal = {
							open: true,
							events: clickedDay,
							position: {
								row,
								column,
								rect
							}
						};
					}
				}
			},
			datesSet() {
				modal = {
					...modal,
					open: false,
					events: []
				};
			},
			dayCellClassNames(info) {
				const dateStr = info.date.toLocaleDateString('en-CA');

				const event = events.find((e) => e.start.startsWith(dateStr));

				if (!event) return [];

				return event.thumbnail ? ['has-event-thumbnail'] : ['has-event'];
			},
			dayCellDidMount(info) {
				const dateStr = info.date.toLocaleDateString('en-CA');

				const event = events.find((e) => e.start.startsWith(dateStr));

				if (event?.thumbnail) {
					info.el.style.setProperty('--day-bg', `url(${event.thumbnail})`);
				}
			},
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

{#if modal.open}
	<Modal
		events={modal.events}
		position={modal.position}
		modalClose={() => {
			modal = { ...modal, open: false };
		}} />
{/if}

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
	margin: 0 auto

:global(.fc)
	color: $black
	--fc-border-color: black

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

:global(.fc .fc-view-harness)	
	margin-top: 26px

:global(.fc .fc-prev-button),
:global(.fc .fc-next-button)
	font-size: 12px

:global(.fc .fc-toolbar-title)
	min-width: 173px
	text-align: center
	font-size: 18px
	line-height: 27px

:global(.fc .fc-col-header)
	font-size: 14px

:global(.fc .fc-scrollgrid-sync-inner)
	text-align: left
	font-weight: 400

:global(.fc .fc-scrollgrid)
	border-top-style: hidden
	border-left-style: hidden

:global(.fc th[role="presentation"])
	border-right-style: hidden
	background-color: inherit

:global(.fc td)
	border: none
	
:global(.fc td[role="presentation"]) 
	border-left: 1px solid black
	
:global(.fc .fc-col-header-cell)
	padding: 0px 10px 10px 10px
	border-left-style: hidden
	
:global(.fc .fc-daygrid-day-top)
	flex-direction: row
	font-size: 24px

:global(.fc .fc-daygrid-body-natural .fc-daygrid-day-events)
	margin: 0

:global(.fc .fc-daygrid-day-number)
	padding: 0

:global(.fc .fc-daygrid-day-frame)
	padding: 12px 15px 8px 15px

:global(.fc .fc-daygrid-event-dot)
	display: none

:global(.fc .fc-daygrid-event)
	margin: 0
	pointer-events: none	
	font-size: 14px

:global(.event-time)
	color: rgb(80, 79, 77)

:global(.fc .fc-event)
	display: block

:global(.fc .fc-event .event-title)
	display: block
	overflow: hidden
	text-overflow: ellipsis

:global(.fc .fc-daygrid-day)
	height: 224px
	position: relative
	overflow: hidden
	background: linear-gradient(to right, transparent calc(100% - 1px), black calc(100% - 1px)), linear-gradient(to bottom, transparent calc(100% - 1px), black calc(100% - 1px))
	background-repeat: no-repeat
	background-clip: padding-box
	

:global(.fc .fc-daygrid-dot-event)
	padding: 0
	background: inherit

:global(.fc-direction-ltr .fc-daygrid-event.fc-event-end)
	margin: 0

:global(.fc .fc-daygrid-day.has-event-thumbnail)
	cursor: pointer
	transition: background-color 0.28s linear
	&::after
		content: ''
		position: absolute
		bottom: 4px
		left: 4px
		right: 4px
		height: 50%
		background-image: var(--day-bg)
		background-size: cover
		background-position: top
		pointer-events: none
	&::before
		content: ''
		position: absolute
		left: 4px
		right: 4px
		bottom: 4px
		height: 50%
		background: rgba(0,0,0,0.2)
		pointer-events: none
		z-index: 1
	&:hover
		background-color: rgba(24, 24, 24, 0.2)

:global(.fc .fc-daygrid-day.has-event)
	cursor: pointer
	transition: background-color 0.28s linear
	&:hover
		background-color: rgba(24, 24, 24, 0.2)

:global(.fc .fc-daygrid-more-link)
	pointer-events: none

</style>
