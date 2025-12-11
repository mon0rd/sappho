// +page.server.js
export async function load() {
	try {
		const res = await fetch('https://sapphostudio.shop/_functions/events');

		if (!res.ok) {
			console.error('Fetch failed', res.status, res.statusText);
			return { events: [] };
		}

		const events = await res.json(); // parse JSON directly
		// console.log('Server fetched events:', events);

		return { events };
	} catch (err) {
		console.error('Failed to fetch events', err);
		return { events: [] };
	}
}
