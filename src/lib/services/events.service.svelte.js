import { SvelteSet, SvelteMap, SvelteDate } from 'svelte/reactivity';

const API_URL = 'https://sapphostudio.shop/_functions/events';

function formatDate(date) {
	return date.toISOString().slice(0, 10);
}

let state = $state({
	events: [],
	loading: true
});

const cache = new SvelteSet();

function mergeEvents(newEvents) {
	const map = new SvelteMap(state.events.map((e) => [e.id, e]));
	newEvents.forEach((e) => map.set(e.id, e));
	state.events = Array.from(map.values());
}

async function fetchRange(start, end) {
	const key = `${formatDate(start)}_${formatDate(end)}`;
	if (cache.has(key)) return [];
	const res = await fetch(`${API_URL}?start=${formatDate(start)}&end=${formatDate(end)}`);
	if (!res.ok) return [];

	const data = await res.json();
	if (state.events.length < 1) state.loading = false;

	mergeEvents(data);
	cache.add(key);
	return data;
}

export function getMonthGridRange(date) {
	const firstOfMonth = new SvelteDate(date.getFullYear(), date.getMonth(), 1);
	const start = new SvelteDate(firstOfMonth);
	start.setDate(firstOfMonth.getDate() - ((firstOfMonth.getDay() + 6) % 7));

	const lastOfMonth = new SvelteDate(date.getFullYear(), date.getMonth() + 1, 0);
	const end = new SvelteDate(lastOfMonth);
	end.setDate(lastOfMonth.getDate() + ((8 - lastOfMonth.getDay()) % 7) + 1); // exclusive

	return { start, end };
}

export async function loadCalendarGrids(dates) {
	const grids = dates.map(getMonthGridRange);

	const gridsToFetch = grids.filter(({ start, end }) => {
		const key = `${formatDate(start)}_${formatDate(end)}`;
		return !cache.has(key);
	});

	await Promise.all(gridsToFetch.map(({ start, end }) => fetchRange(start, end)));

	return gridsToFetch.length > 0;
}

export function useEvents() {
	return state;
}
