<script>
	import { onMount } from 'svelte';
	let map;
	onMount(async () => {
		const L = await import('leaflet');
		await import('leaflet/dist/leaflet.css');

		map = L.map('map', { scrollWheelZoom: false }).setView([48.218, 16.363], 13);

		L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
			subdomains: 'abcd',
			maxZoom: 19
		}).addTo(map);

		map.getContainer().addEventListener(
			'wheel',
			(e) => {
				if (e.ctrlKey) {
					e.preventDefault(); // prevent page scroll

					// calculate zoom delta manually
					const delta = e.deltaY > 0 ? -1 : 1; // scroll up → zoom in, down → zoom out
					const currentZoom = map.getZoom();
					map.setZoom(currentZoom + delta);

					// optionally enable scrollWheelZoom temporarily for smooth scroll
					// map.scrollWheelZoom.enable();
				}
			},
			{ passive: false }
		);

		const redIcon = L.icon({
			iconUrl:
				'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-red.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});

		L.marker([48.218, 16.363], { icon: redIcon }).addTo(map).bindPopup('Berggasse 16');
	});
</script>

<div id="map"></div>

<style lang="sass">
#map
    height: 100%
</style>
