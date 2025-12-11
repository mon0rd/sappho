<script>
	import Calendar from '$lib/components/Calendar.svelte';
	let { data } = $props();
	const events = $derived(data.events);
</script>

<h2 class="title_h2">events page</h2>
<Calendar {events} />

<!-- <script>
	import Calendar from '$lib/components/Calendar.svelte';

	export let data;
	let events = data.events || [];
</script>

<h2 class="title_h2">events page</h2>
<Calendar {events} /> -->
