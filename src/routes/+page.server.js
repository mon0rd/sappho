export function load({ fetch }) {
	return {
		upcomingEvents: fetch('https://sapphostudio.shop/_functions/events?mode=upcoming', {
			headers: {
				accept: 'application/json'
			}
		})
			.then((res) => {
				if (!res.ok) return [];
				return res.json();
			})
			.catch(() => [])
	};
}
