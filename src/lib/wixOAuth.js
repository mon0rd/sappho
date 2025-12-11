// import axios from 'axios';

// let cachedToken = null;
// let tokenExpiry = 0;

// async function getAccessToken() {
// 	const now = Date.now();

// 	if (cachedToken && now < tokenExpiry) {
// 		return cachedToken;
// 	}

// 	try {
// 		const params = new URLSearchParams();
// 		params.append('grant_type', 'client_credentials');
// 		params.append('client_id', process.env.WIX_APP_ID);
// 		params.append('client_secret', process.env.WIX_APP_SECRET);

// 		const response = await axios.post('https://www.wixapis.com/oauth/access', params.toString(), {
// 			headers: {
// 				'Content-Type': 'application/x-www-form-urlencoded' // axios won't append charset automatically
// 			}
// 		});

// 		cachedToken = response.data.access_token;
// 		tokenExpiry = now + response.data.expires_in * 1000 - 60000;

// 		return cachedToken;
// 	} catch (err) {
// 		console.error('Failed to get Wix OAuth token:', err.response?.data || err.message);
// 		throw new Error(`Failed to get Wix OAuth token: ${err.message}`);
// 	}
// }

// export { getAccessToken };
