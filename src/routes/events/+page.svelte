<script>
	import Calendar from '$lib/components/Calendar.svelte';
	let { data } = $props();
</script>

<h2 class="title_h2">Bevorstehende Veranstaltungen</h2>
<div class="calendar">
	{#await data.events}
		<div class="spinner"></div>
	{:then events}
		<Calendar {events} />
	{:catch}
		<p style="text-align: center; font-size: 24px">Failed to load events</p>
	{/await}
</div>

<style lang="sass">
.title_h2
	text-align: center
.calendar
	margin-top: 50px
	text-align: center
</style>
