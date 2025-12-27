// +page.server.js:
import { getMonthGridRange } from '$lib/services/events.service.svelte.js';

const API_URL = 'https://sapphostudio.shop/_functions/events';

function formatDate(date) {
	return date.toISOString().slice(0, 10);
}

export async function load({ fetch }) {
	const now = new Date();

	const months = [
		new Date(now.getFullYear(), now.getMonth() - 1, 1),
		new Date(now.getFullYear(), now.getMonth(), 1),
		new Date(now.getFullYear(), now.getMonth() + 1, 1)
	];

	const grids = months.map(getMonthGridRange);

	const responses = await Promise.all(
		grids.map(({ start, end }) =>
			fetch(`${API_URL}?start=${formatDate(start)}&end=${formatDate(end)}`).then((r) => r.json())
		)
	);

	const events = responses.flat();

	return {
		initialEvents: events
	};
}
