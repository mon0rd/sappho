<script>
	import { onMount, onDestroy } from 'svelte';
	import {
		startOfMonth,
		endOfMonth,
		subMonths,
		addMonths,
		formatISO,
		startOfWeek,
		endOfWeek
	} from 'date-fns';
	import Modal from './Modal.svelte';

	let { upcomingEvents, initialView } = $props();

	let eventsCache = {};
	let events = $derived(initialView === 'listMonth' ? upcomingEvents : []);

	let calendar;
	let calendarEl;
	let selectedDay = null;
	let selectedDayEl = null;
	let modal = $state({ events: [], position: {}, open: false });
	let modalEl = $state();
	let loading = $state(true);

	function monthKey(date) {
		const d = new Date(date);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
	}

	function mergeEvents(newEvents) {
		events = [
			...events.filter(
				(e) => !newEvents.find((ne) => ne.start === e.start && ne.title === e.title)
			),
			...newEvents
		];
	}

	function formatDateForBackend(date) {
		const d = new Date(date);
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, '0');
		const dd = String(d.getDate()).padStart(2, '0');
		return `${yyyy}-${mm}-${dd}`;
	}

	async function fetchMonthEvents(startDate, endDate) {
		const start = formatDateForBackend(startDate);
		const end = formatDateForBackend(endDate);

		const res = await fetch(
			`https://sapphostudio.shop/_functions/events?start=${start}&end=${end}`
		);
		if (!res.ok) return [];
		return res.json();
	}

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

		if (initialView !== 'listMonth') {
			const today = new Date();
			const firstMonth = subMonths(today, 1);
			const lastMonth = addMonths(today, 1);

			// Single fetch for the full range
			const start = formatISO(startOfWeek(startOfMonth(firstMonth), { weekStartsOn: 1 }));
			const end = formatISO(endOfWeek(endOfMonth(lastMonth), { weekStartsOn: 1 }));
			const allEvents = await fetchMonthEvents(start, end);

			// Cache per month
			for (let month = firstMonth; month <= lastMonth; month = addMonths(month, 1)) {
				const key = monthKey(month);
				eventsCache[key] = allEvents.filter((e) =>
					e.start.startsWith(formatDateForBackend(month).slice(0, 7))
				);
			}

			// Merge all events
			mergeEvents(allEvents);
		}

		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, interactionPlugin, listPlugin],
			initialView,
			events,
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
			eventContent(arg) {
				const thumbnail = arg.event.extendedProps.thumbnail;
				const time = arg.event.start.toLocaleTimeString('de-DE', {
					hour: '2-digit',
					minute: '2-digit'
				});

				return {
					html: `
						<div class="event-wrapper" style="--thumbnail: url('${thumbnail || ''}')">
							<span class="event-time">${time}</span><br/>
							<span class="event-title">${arg.event.title}</span>
						</div>`
				};
			},
			dateClick(info) {
				const clickedDay = events.filter((e) => e.start.startsWith(info.dateStr));
				if (!clickedDay.length) return;

				const row = info.dayEl.parentElement.rowIndex + 1;
				const column = info.dayEl.cellIndex + 1;

				if (modal.open && selectedDay === info.dateStr) {
					closeModal();
					return;
				}

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
			dayCellDidMount(info) {
				const dateStr = info.date.toLocaleDateString('en-CA');

				const event = events.find((e) => e.start.startsWith(dateStr));

				// if (event?.thumbnail) {
				// 	info.el.style.setProperty('--day-bg', `url(${event.thumbnail})`);
				// }
			},
			datesSet: async (info) => {
				if (initialView === 'listMonth') return;

				const startMonth = startOfMonth(info.start);
				const endMonth = endOfMonth(info.end);

				const monthsToCheck = [
					subMonths(startMonth, 1),
					...Array.from({ length: info.end.getMonth() - info.start.getMonth() + 1 }, (_, i) =>
						addMonths(startMonth, i)
					)
				];

				for (const month of monthsToCheck) {
					const key = monthKey(month);
					if (!eventsCache[key]) {
						const start = formatDateForBackend(startOfMonth(month));
						const end = formatDateForBackend(endOfMonth(month));
						const monthEvents = await fetchMonthEvents(start, end);
						eventsCache[key] = monthEvents;
						mergeEvents(monthEvents);
						calendar.removeAllEventSources();
						calendar.addEventSource(events);
					}
				}
			},
			noEventsText: 'Keine bevorstehenden Veranstaltungen'
		});

		calendar.render();
		loading = false;

		document.addEventListener('mousedown', handleClick);
		window.addEventListener('keydown', handleKey);
	});

	onDestroy(() => {
		document.removeEventListener('mousedown', handleClick);
		window.removeEventListener('keydown', handleKey);
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
	flex-direction: row
	font-size: 24px

:global(.fc .fc-daygrid-body-natural .fc-daygrid-day-events)
	margin: 0
	min-height: 100%

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
	
:global(.fc .fc-event .event-wrapper)
	position: relative
	height: 100%
	width: 100%
	background-image: var(--thumbnail)
	background-size: cover
	background-position: center top
	display: flex
	flex-direction: column
	justify-content: flex-end

:global(.fc .fc-h-event)
	background-color: inherit
	border: none

:global(.fc .fc-event .event-title)
	display: block
	overflow: hidden
	text-overflow: ellipsis
	color: $black

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
	// &::after
	// 	content: ''
	// 	position: absolute
	// 	bottom: 4px
	// 	left: 4px
	// 	right: 4px
	// 	height: 50%
	// 	background-image: var(--day-bg)
	// 	background-size: cover
	// 	background-position: top
	// 	pointer-events: none
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
		
:global(.fc .selected)
		background-color: rgba(24, 24, 24, 0.2)

:global(.fc .fc-daygrid-day.has-event)
	cursor: pointer
	transition: background-color 0.28s linear
	&:hover
		background-color: rgba(24, 24, 24, 0.2)

:global(.fc .fc-daygrid-more-link)
	pointer-events: none

</style>
