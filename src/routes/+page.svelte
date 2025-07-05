<script>
	import { onMount } from 'svelte';

	// --- Reactive State ---
	let apiStatus = 'checking'; // 'checking', 'online', or 'offline'
	let images = []; // An array to hold the list of image filenames
	let errorMessage = '';

	const API_URL = 'https://fashionserver.timdobras.com';

	// --- NEW: Hardcoded list of image filenames ---
	// You must manually list the exact filenames of the images you want to show.
	const knownImageNames = [
		'031195.jpg',
		'031218.jpg',
		'031223.jpg',
		'031229.jpg',
		'031234.jpg',
		'031250.jpg',
		'031253.jpg',
		'031257.jpg',
		'031272.jpg',
		'031285.jpg'
	];

	// --- Data Fetching ---
	onMount(async () => {
		try {
			// We still ping the server to make sure it's online.
			const statusResponse = await fetch(API_URL);
			if (!statusResponse.ok) {
				throw new Error(`Server responded with status: ${statusResponse.status}`);
			}

			// If the server is online, we use our hardcoded list.
			apiStatus = 'online';
			images = knownImageNames;
		} catch (error) {
			console.error('API Error:', error);
			apiStatus = 'offline';
			errorMessage = error.message;
		}
	});
</script>

<div class="min-h-screen bg-gray-900 p-4 font-sans text-white">
	<div class="mx-auto max-w-4xl">
		<h1 class="mb-6 text-center text-3xl font-bold text-cyan-400">Fashion Retrieval System</h1>

		<div
			class="mx-auto mb-8 w-full max-w-md rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-lg"
		>
			<h2 class="mb-4 text-center text-xl font-bold text-cyan-400">API Status</h2>
			{#if apiStatus === 'checking'}
				<div class="flex items-center justify-center rounded-lg bg-gray-700 p-4">
					<svg
						class="mr-3 h-5 w-5 animate-spin text-cyan-400"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						><circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						></circle><path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path></svg
					>
					<span>Checking API status...</span>
				</div>
			{/if}
			{#if apiStatus === 'online'}
				<div class="text-center text-lg font-bold text-green-400">✅ Online</div>
			{/if}
			{#if apiStatus === 'offline'}
				<div class="text-center">
					<p class="text-lg font-bold text-red-400">❌ Offline</p>
					<p class="mt-2 font-mono text-sm text-gray-400">{errorMessage}</p>
				</div>
			{/if}
		</div>

		{#if apiStatus === 'online'}
			<div>
				<h2 class="mb-4 text-center text-2xl font-semibold">Image Showcase</h2>
				<div class="grid grid-cols-2 gap-4 md:grid-cols-5">
					{#each images as imageName (imageName)}
						<div class="overflow-hidden rounded-lg bg-gray-800 shadow-md">
							<img
								src="{API_URL}/images/{imageName}"
								alt="Fashion item {imageName}"
								class="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
								loading="lazy"
							/>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
