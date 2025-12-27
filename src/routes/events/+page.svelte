<!-- +page.svelte: -->
<script>
	import Calendar from '$lib/components/Calendar.svelte';
	let { data } = $props();
</script>

<h2 class="title_h2">Bevorstehende Veranstaltungen</h2>
<div class="calendar">
	<Calendar initialEvents={data.initialEvents} />
</div>

<style lang="sass">
.title_h2
	text-align: center
.calendar
	margin-top: 50px
	text-align: center
</style>
