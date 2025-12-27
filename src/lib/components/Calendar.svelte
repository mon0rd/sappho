<!-- Calendar.svelte: -->
<script>
	import { onMount } from 'svelte';
	import {
		loadCalendarGrids,
		useEvents,
		hydrateEvents
	} from '$lib/services/events.service.svelte.js';
	import Modal from './Modal.svelte';

	let { initialEvents, upcomingEvents, initialView } = $props();

	const eventsState = $derived(initialView === 'listMonth' ? null : useEvents());

	$effect(() => {
		if (initialView !== 'listMonth') {
			hydrateEvents(initialEvents);
		}
	});

	let events = $derived(initialView === 'listMonth' ? upcomingEvents : eventsState.events);
	let loading = $derived(initialView === 'listMonth' ? false : eventsState.loading);

	let calendar;
	let calendarEl;
	let selectedDay = null;
	let selectedDayEl = null;
	let modal = $state({ events: [], position: {}, open: false });
	let modalEl = $state();

	function closeModal() {
		if (selectedDayEl) {
			selectedDayEl.classList.remove('selected');
			selectedDayEl = null;
		}
		modal = { ...modal, open: false, events: [] };
		selectedDay = null;
	}

	function handleClick(e) {
		if (modal.open && !modalEl?.contains(e.target) && !selectedDayEl?.contains(e.target))
			closeModal();
	}

	function handleKey(e) {
		if (e.key === 'Escape') {
			closeModal();
		}
	}

	onMount(async () => {
		const { Calendar } = await import('@fullcalendar/core');
		const dayGridPlugin = (await import('@fullcalendar/daygrid')).default;
		const listPlugin = (await import('@fullcalendar/list')).default;
		const interactionPlugin = (await import('@fullcalendar/interaction')).default;

		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, interactionPlugin, listPlugin],
			initialView,
			height: 'auto',
			locale: 'de',
			firstDay: 1,
			fixedWeekCount: false,
			dayMaxEvents: 1,
			headerToolbar:
				initialView === 'listMonth'
					? 'none'
					: {
							left: '',
							center: 'prev,title,next',
							right: 'today'
						},
			buttonText: {
				today: 'Heute'
			},
			eventSources:
				initialView === 'listMonth'
					? []
					: [
							{
								id: 'events',
								events: (info, success) => {
									success(eventsState.events);
								}
							}
						],
			datesSet: async (info) => {
				if (initialView === 'listMonth') return;
				const months = [
					new Date(info.view.currentStart.getFullYear(), info.view.currentStart.getMonth() - 1, 1),
					info.view.currentStart,
					new Date(info.view.currentStart.getFullYear(), info.view.currentStart.getMonth() + 1, 1)
				];

				const didLoad = await loadCalendarGrids(months);

				if (didLoad) {
					calendar.getEventSourceById('events')?.refetch();
				}
			},
			eventContent(arg) {
				const thumbnail =
					initialView !== 'listMonth' && arg.event.extendedProps.thumbnail
						? `	<div class="thumbnail-wrapper">
								<img src="${arg.event.extendedProps.thumbnail}" alt="thumbnail">
							</div>`
						: '';

				const time = arg.event.start.toLocaleTimeString('de-DE', {
					hour: '2-digit',
					minute: '2-digit'
				});

				return {
					html: `
						<div class="event-wrapper">
							<div>
								<span class="event-time">${time}</span><br/>
								<span class="event-title">${arg.event.title}</span>
							</div>
							${thumbnail}				
						</div>`
				};
			},
			dateClick(info) {
				if (modal.open && selectedDay === info.dateStr) return closeModal();
				const clickedDay = events.filter((e) => e.start.startsWith(info.dateStr));
				if (!clickedDay.length) return;

				const row = info.dayEl.parentElement.rowIndex + 1;
				const column = info.dayEl.cellIndex + 1;

				if (selectedDayEl) {
					selectedDayEl.classList.remove('selected');
				}

				info.dayEl.classList.add('selected');
				selectedDayEl = info.dayEl;
				selectedDay = info.dateStr;

				modal = {
					open: true,
					events: clickedDay,
					position: { row, column, dayEl: info.dayEl }
				};
			},
			dayCellClassNames(info) {
				const dateStr = info.date.toLocaleDateString('en-CA');

				const event = events.find((e) => e.start.startsWith(dateStr));

				if (!event) return [];

				const classes = [];
				classes.push(event.thumbnail ? 'has-event-thumbnail' : 'has-event');

				return classes;
			},
			noEventsText: 'Keine bevorstehenden Veranstaltungen'
		});
		calendar.render();

		document.addEventListener('mousedown', handleClick);
		window.addEventListener('keydown', handleKey);
		return () => {
			document.removeEventListener('mousedown', handleClick);
			window.removeEventListener('keydown', handleKey);
		};
	});
</script>

{#if initialView !== 'listMonth' && loading}
	<div class="spinner"></div>
{/if}

<div bind:this={calendarEl} style="max-width: 1436px; margin: auto;"></div>

{#if modal.open}
	<Modal bind:modalEl events={modal.events} position={modal.position} {closeModal} />
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
	padding: 0 9px
	flex-direction: row
	font-size: 24px

:global(.fc .fc-daygrid-body-natural .fc-daygrid-day-events)
	height: 100%
	margin: 0

:global(.fc .fc-daygrid-day-number)
	padding: 0

:global(.fc .fc-daygrid-day-frame)
	display: flex
	flex-direction: column
	height: 100%
	padding: 12px 6px 6px 6px

:global(.fc .fc-daygrid-event-dot)
	display: none

:global(.fc .fc-daygrid-event)
	margin: 0
	pointer-events: none	
	font-size: 14px

:global(.fc .fc-daygrid-event-harness)
	height: 100%

:global(.fc .fc-daygrid-event-harness-abs)
	top: 0 !important
	right: 0 !important
	left: 0 !important

:global(.event-time)
	padding: 0 9px
	color: rgb(80, 79, 77)

:global(.fc .fc-event)
	height: 100%

:global(.fc .fc-event-main)
	height: 100%

:global(.fc .fc-h-event)
	background-color: inherit
	border: none

:global(.fc .fc-event .event-title)
	padding: 0 9px
	display: block
	overflow: hidden
	text-overflow: ellipsis
	color: $black
	
:global(.fc .fc-event .event-wrapper)
	height: 100%
	width: 100%
	display: flex
	flex-direction: column
	justify-content: space-between

:global(.thumbnail-wrapper)
	position: relative
	min-height: 110px
	width: auto
	overflow: hidden
	object-fit: cover

:global(.thumbnail-wrapper img)
	height: 100%
	width: 100%
	object-fit: cover

:global(.fc .fc-daygrid-day-bottom)
	padding: 0 9px
	pointer-events: none
	margin: 0
	position: absolute
	top: 42px
	
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
	position: relative
	cursor: pointer
	transition: background-color 0.28s linear
	&::after
		content: ''
		position: absolute
		bottom: 6px
		right: 6px
		left: 6px
		min-height: 110px
		background: rgba(0,0,0,0.2)
		z-index: 10
	&:hover
		background-color: rgba(24, 24, 24, 0.2)

:global(.fc .fc-daygrid-day.has-event)
	cursor: pointer
	transition: background-color 0.28s linear
	&:hover
		background-color: rgba(24, 24, 24, 0.2)
		
:global(.fc .selected)
		background-color: rgba(24, 24, 24, 0.2)

</style>
