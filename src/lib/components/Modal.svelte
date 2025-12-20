<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let { events, position, modalClose } = $props();

	let selectedEvent = $state(null);

	function showEvent(event) {
		selectedEvent = event;
	}

	function showEventList() {
		selectedEvent = null;
	}

	const formattedEvents = $derived(() => {
		if (!events || !events.length) return [];
		return [...events]
			.sort((a, b) => new Date(a.start) - new Date(b.start))
			.map((event) => {
				const start = new Date(event.start);
				const end = new Date(event.end);

				const dateFormatter = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long' });
				const fullDateFormatter = new Intl.DateTimeFormat('de-DE', {
					day: '2-digit',
					month: 'short',
					year: 'numeric'
				});
				const timeFormatter = new Intl.DateTimeFormat('de-DE', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: false
				});

				return {
					...event,
					date: dateFormatter.format(start),
					dateTime: `${fullDateFormatter.format(start)}, ${timeFormatter.format(start)} - ${timeFormatter.format(end)}`,
					dateStartTime: `${fullDateFormatter.format(start)}, ${timeFormatter.format(start)}`
				};
			});
	});

	$effect(() => {
		events;
		selectedEvent = null;
	});

</script>

<div
	class="modal"
	style="
		top: {position.top}px;
		left: {position.left}px;
		width: {position.width * 2 - 41}px;
		height: {position.height * 3 - 41}px;
	"
	role="dialog"
	aria-modal="true"
	in:fade={{ duration: 280 }}
	out:fade={{ duration: 280 }}>
	<button class="modal_close" onclick={modalClose} aria-label="Close modal">
		<svg viewBox="0 0 24 24">
			<path
				d="M17 6 12.001 10.999 7 6 6 7 11.001 11.999 6 17 7 18 12.001 12.999 17 18 18 17 13 11.999 18 7z">
			</path>
		</svg>
	</button>
	{#key events}
		<div class="modal_wrapper" in:fade={{ duration: 280, delay: 280 }} out:fade={{ duration: 280 }}>
			{#if selectedEvent}
				<button class="modal_date" onclick={showEventList}>
					<div class="modal_date_wrapper">
						<svg class="modal_date_chevron" viewBox="0 0 24 24">
							<path
								d="M14.8597212,8.14512634 C15.0549834,8.34038849 15.0549834,8.65697098 14.8597212,8.85223312 L11.2137854,12.5 L14.8597212,16.1465919 C15.0549834,16.3418541 15.0549834,16.6584366 14.8597212,16.8536987 C14.6644591,17.0489609 14.3478766,17.0489609 14.1526144,16.8536987 L9.79957183,12.5 L14.1526144,8.14512634 C14.3478766,7.9498642 14.6644591,7.9498642 14.8597212,8.14512634 Z">
							</path>
						</svg>
						{selectedEvent.date}
					</div>
				</button>
			{:else}
				<button class="modal_date" onclick={showEventList} style="pointer-events: none;">
					{formattedEvents()[0]?.date}</button>
			{/if}

			{#if !selectedEvent && formattedEvents().length > 1}
				<ul class="modal_preview">
					{#each formattedEvents() as event}
						<li>
							<button class="modal_preview_event" onclick={() => showEvent(event)}>
								<span class="modal_preview_event_time">{event.dateStartTime}</span>
								<span href="/events" class="modal_preview_event_title">{event.title}</span>

								<svg class="modal_preview_event_chevron" viewBox="0 0 24 24" aria-hidden="true">
									<path
										d="M9.14644661,8.14512634 C9.34170876,7.9498642 9.65829124,7.9498642 9.85355339,8.14512634 L14.206596,12.5 L9.85355339,16.8536987 C9.65829124,17.0489609 9.34170876,17.0489609 9.14644661,16.8536987 C8.95118446,16.6584366 8.95118446,16.3418541 9.14644661,16.1465919 L12.7923824,12.5 L9.14644661,8.85223312 C8.95118446,8.65697098 8.95118446,8.34038849 9.14644661,8.14512634 Z" />
								</svg>
							</button>
						</li>
					{/each}
				</ul>
			{:else}
				{#each selectedEvent ? [selectedEvent] : formattedEvents() as event}
					<div class="modal_event">
						{#if event.thumbnail}
							<img src={event.thumbnail} alt="thumbnail" class="modal_event_img" />
						{/if}
						<div class="modal_event_status">Mehrere Termine</div>
						<a href="/events" class="modal_event_title">{event.title}</a>
						<span class="modal_event_time">{event.dateTime}</span>
						<span class="modal_event_address">{event.address}</span>
						<p class="modal_event_descr">{event.descr}</p>
						<a href="/events" class="modal_event_details">Details</a>
					</div>
				{/each}
			{/if}
		</div>
	{/key}
</div>

<style lang="sass">
@use '../../styles/base/_variables.sass' as *;
.modal
	border: none
	z-index: 899
	padding: 20px
	position: absolute
	background: $beige
	font-size: 14px
	color: $black
	text-align: left
	&_close
		position: absolute
		top: 8px
		right: 8px
		padding: 0
		background: none
		border: none
		font-family: inherit
		cursor: pointer
		fill: currentColor
		svg			
			width: 16px
			height: 16px
			align-items: center
	&_date
		background: none
		border: none
		padding: 0
		text-align: left
		font-family: inherit
		font-size: 14px
		line-height: 24px
		cursor: pointer
		&_wrapper
			margin-left: -10px
			display: flex
			align-items: center
		&_chevron
			width: 22px
			height: 22px
			fill: currentColor
	&_preview
		list-style-type: none
		padding: 0
		margin-top: 8px
		li
			border-bottom: 1px solid black
			&:last-child
				border-bottom: none
		&_event
			position: relative
			cursor: pointer  
			padding: 8px 0
			background: none
			border: none
			width: 100%
			text-align: left
			font-family: inherit
			font-size: 14px
			&_chevron
				position: absolute
				right: -10px
				top: 50%
				transform: translateY(-50%)
				width: 22px
				height: 22px
				fill: currentColor
				opacity: 0
			&:hover &_chevron,
			&:focus-visible &_chevron
				opacity: 1
			&_time
				display: block	
				opacity: .6
			&_title
				display: block
	&_event
		&_img
			border: 1px solid black
			margin-top: 12px
		&_status
			margin-top: 32px
			border: 1px solid black
			width: max-content
			line-height: 19.6px
			padding: 0 16px
		&_title
			display: block
			margin-top: 20px
			font-size: 16px
			width: max-content
			text-decoration: none
			color: inherit
		&_time
			display: block
			margin-top: 8px
		&_address			
			opacity: .6
		&_descr
			margin-top: 20px
		&_details
			position: absolute
			bottom: 20px
			left: 20px
			display: inline-flex
			color: white
			background-color: black
			padding: 6px 22px
			font-size: 16px
			line-height: 22.4px
			text-decoration: none
			&:hover
				text-decoration: underline

</style>
