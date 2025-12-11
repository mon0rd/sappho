<script>
	import { onMount } from 'svelte';
	import SapphoService from '$lib/services/SapphoService';

	let events = []; // <-- accept events as prop
	// export let initialView = 'dayGridMonth';
	let { initialView } = $props();
	let { fetchEvents } = SapphoService();
	let calendarEl;
	let calendar;
	let loaded = false;

	async function initCalendar() {
		if (loaded) return;
		loaded = true;

		const { Calendar } = await import('@fullcalendar/core');
		const dayGridPlugin = (await import('@fullcalendar/daygrid')).default;
		const listPlugin = (await import('@fullcalendar/list')).default;
		const interactionPlugin = (await import('@fullcalendar/interaction')).default;

		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, interactionPlugin, listPlugin],
			initialView,
			events: [],
			eventClick: (info) => alert(`Event: ${info.event.start}`)
		});

		calendar.render();

		events = await fetchEvents();
		events.forEach((e) =>
			calendar.addEvent({
				title: e.title,
				start: e.start,
				end: e.end
			})
		);
	}

	onMount(() => {
		initCalendar();
	});

	// onMount(async () => {
	// 	// console.log(events); // likely empty at this point

	// 	calendar = new Calendar(calendarEl, {
	// 		plugins: [dayGridPlugin, interactionPlugin, listPlugin],
	// 		initialView,
	// 		events: [],
	// 		eventClick: (info) => alert(`Event: ${info.event.start}`)
	// 	});

	// 	calendar.render();

	// 	events = await fetchEvents();
	// 	events.forEach((e) =>
	// 		calendar.addEvent({
	// 			title: e.title,
	// 			start: e.start,
	// 			end: e.end
	// 		})
	// 	);
	// });
</script>

<div bind:this={calendarEl} style="max-width: 900px; margin: auto;"></div>

<!-- <script>
  import { onMount } from 'svelte';
  export let events = [];
  export let initialView = 'dayGridMonth';

  let calendarEl;
  let calendar;
  let loaded = false;

  async function initCalendar() {
    if (loaded) return;
    loaded = true;

    const { Calendar } = await import('@fullcalendar/core');
    const dayGridPlugin = (await import('@fullcalendar/daygrid')).default;
    const listPlugin = (await import('@fullcalendar/list')).default;
    const interactionPlugin = (await import('@fullcalendar/interaction')).default;

    calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin, listPlugin],
      initialView,
      events,
      eventClick: info => alert(`Event: ${info.event.title}`)
    });

    calendar.render();
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          initCalendar();
          observer.disconnect(); // no need to observe anymore
        }
      },
      { rootMargin: '200px' } // preload a bit before it's visible
    );

    observer.observe(calendarEl);
  });
</script>

<div style="max-width:900px; margin:auto; min-height:400px;">
  <!-- optional placeholder skeleton -->
<!-- {!loaded && <p>Loading calendar...</p>}
  <div bind:this={calendarEl}></div>
</div> --> -->
