import { createClient, OAuthStrategy } from '@wix/sdk';
import { wixEventsV2 } from '@wix/events';

function SapphoService() {
	const wixClient = createClient({
		modules: { wixEventsV2 },
		auth: OAuthStrategy({ clientId: '0dc71794-5239-40c3-952d-3a0f25831949' })
	});

	async function fetchEvents() {
		try {
			const response = await wixClient.wixEventsV2
				.queryEvents()
				.limit(20)
				.hasSome('status', ['UPCOMING', 'ENDED'])
				.find();

			console.log('Fetched Events:', response.items || []);
			return transformEvents(response.items || []);
		} catch (err) {
			console.error('Error fetching events:', err);
			return [];
		}
	}

	function transformEvents(arr) {
		arr.sort(
			(a, b) =>
				new Date(a.dateAndTimeSettings.startDate) - new Date(b.dateAndTimeSettings.startDate)
		);

		const events = arr.map((event) => ({
			title: event.title,
			image: event.mainImage
				? 'https://static.wixstatic.com/media/' + event.mainImage.match(/v1\/([^?#]+)\b/)[1]
				: null,
			descr: event.shortDescription,
			address: event.location.address.formatted,
			start: event.dateAndTimeSettings.startDate,
			end: event.dateAndTimeSettings.endDate
		}));

		return events;
	}

	return { fetchEvents };
}

export default SapphoService;
