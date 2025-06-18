<!-- 
  This is a complete SvelteKit page component.
  To use it:
  1. Create a new SvelteKit project if you haven't already: `npm create svelte@latest my-app`
  2. In your project, replace the entire content of `src/routes/+page.svelte` with this code.
  3. Run your development server: `npm run dev`
  4. Open your browser to `http://localhost:5173`.
-->
<script>
	import { onMount } from 'svelte';

	// --- Reactive State ---
	// These variables will hold the status of our API call.
	// The UI will automatically update whenever their values change.
	let apiStatus = 'checking'; // Can be 'checking', 'online', or 'offline'
	let apiMessage = ''; // To store the success message from the API
	let errorMessage = ''; // To store any error messages

	// The URL of your Python API running on your home server via Cloudflare Tunnel
	const API_URL = 'https://fashionserver.timdobras.com/';

	// --- Data Fetching ---
	// `onMount` is a Svelte lifecycle function that runs once, right after the
	// component is first added to the page. It's the perfect place to fetch initial data.
	onMount(async () => {
		try {
			// We use fetch() to make a GET request to our API's root URL.
			const response = await fetch(API_URL);

			// Check if the HTTP response status is OK (e.g., 200).
			if (!response.ok) {
				// If not OK, create a specific error message.
				throw new Error(`Server responded with status: ${response.status}`);
			}

			// If the response is OK, parse the JSON body.
			const data = await response.json();

			// Update our state variables with the data from the API.
			apiStatus = 'online';
			apiMessage = data.Hello || 'No message received';
		} catch (error) {
			// If any part of the `try` block fails (network error, server down, etc.),
			// we catch the error here.
			console.error('Failed to fetch API status:', error);
			apiStatus = 'offline';
			errorMessage = error.message;
		}
	});
</script>

<!-- 
  This is the main container for our app.
  It uses Tailwind CSS classes for styling.
  - `min-h-screen`: Makes the container at least the full height of the screen.
  - `flex`, `items-center`, `justify-center`: Centers the content vertically and horizontally.
  - `bg-gray-900`: Sets a dark background color.
  - `text-white`: Sets the default text color to white.
  - `font-sans`: Uses a clean, sans-serif font.
-->
<div class="flex min-h-screen items-center justify-center bg-gray-900 p-4 font-sans text-white">
	<!-- This is the main card for the status display -->
	<div class="w-full max-w-md rounded-xl border border-gray-700 bg-gray-800 p-8 shadow-lg">
		<h1 class="mb-6 text-center text-2xl font-bold text-cyan-400">API Status Checker</h1>

		<!-- 
      We use Svelte's {#if ...} blocks to conditionally render different UI
      based on the value of the `apiStatus` variable.
    -->

		{#if apiStatus === 'checking'}
			<!-- The initial state while we are waiting for the fetch() call to complete -->
			<div class="flex items-center justify-center rounded-lg bg-gray-700 p-4">
				<svg
					class="mr-3 -ml-1 h-5 w-5 animate-spin text-cyan-400"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				<span class="text-lg font-medium">Checking API status...</span>
			</div>
		{/if}

		{#if apiStatus === 'online'}
			<!-- The success state when the API call was successful -->
			<div class="rounded-lg border border-green-500 bg-green-900/50 p-6 text-center">
				<div class="mb-3 flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-3 h-8 w-8 text-green-400"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="text-2xl font-bold text-green-300">API Online</span>
				</div>
				<p class="text-gray-300">Successfully connected to the server.</p>
				<div class="mt-4 rounded bg-gray-900/50 p-3 text-left">
					<span class="font-semibold text-cyan-400">Message:</span>
					<span class="font-mono text-gray-200">"{apiMessage}"</span>
				</div>
			</div>
		{/if}

		{#if apiStatus === 'offline'}
			<!-- The error state when the API call failed -->
			<div class="rounded-lg border border-red-600 bg-red-900/50 p-6 text-center">
				<div class="mb-3 flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-3 h-8 w-8 text-red-400"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="text-2xl font-bold text-red-300">API Offline</span>
				</div>
				<p class="text-gray-300">Could not connect to the server.</p>
				<div class="mt-4 rounded bg-gray-900/50 p-3 text-left text-sm">
					<span class="font-semibold text-red-400">Error Details:</span>
					<span class="font-mono text-gray-200">{errorMessage}</span>
				</div>
			</div>
		{/if}
	</div>
</div>
