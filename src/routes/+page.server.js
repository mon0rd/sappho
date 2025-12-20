export function load({ fetch }) {
	return {
		events: fetch('https://sapphostudio.shop/_functions/events?mode=all', {
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
