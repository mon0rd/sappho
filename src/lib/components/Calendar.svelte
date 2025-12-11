<script>
	import { onMount } from 'svelte';
	let { events, initialView } = $props(); // From +page.server.js
	// let { initialView } = $props();

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
			eventClick: (info) => alert(`Event: ${info.event.title}\n${info.event.start}`)
		});

		calendar.render();
		loading = false;
	});
</script>

{#if loading}
	<div class="wix-spinner"></div>
{/if}

<div
	bind:this={calendarEl}
	style="visibility: {loading ? 'hidden' : 'visible'}; max-width: 900px; margin: auto;">
</div>

<style>
	.wix-spinner {
		margin: 2rem auto;
		width: 32px;
		height: 32px;
		border: 4px solid transparent;
		border-top-color: #1a73e8; /* Wix blue-ish color */
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
