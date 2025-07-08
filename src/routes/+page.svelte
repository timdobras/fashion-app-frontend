<script lang="ts">
	import { serverHealth } from '$lib/stores/serverHealth.svelte';
	import { onMount } from 'svelte';

	let allImages = $state([]);
	let imageStats = $state(null);
	let isDiscoveringImages = $state(false);
	let discoveryError = $state('');

	$inspect(allImages);

	const health = $derived(serverHealth.data);

	const API_URL = 'https://fashionserver.timdobras.com';

	const fallbackImages = [
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

	async function discoverAllImages() {
		isDiscoveringImages = true;
		discoveryError = '';

		try {
			const response = await fetch(`${API_URL}/discover-images`);
			if (!response.ok) throw new Error(`HTTP ${response.status}`);

			const data = await response.json();
			allImages = data.images || [];
			imageStats = data.breakdown || { validation: 0, training: 0, uploaded: 0 };

			console.log(`📸 Discovered ${data.total_images} total images:`, data.breakdown);

			// If no images discovered, use fallback
			if (allImages.length === 0) {
				console.warn('No images discovered, using fallback images');
				allImages = fallbackImages.map((filename) => ({
					filename,
					type: 'validation',
					url: `/images/${filename}`,
					directory: '/mnt/truenas/fashion-app-ml/data/validation/image'
				}));
				imageStats = { validation: fallbackImages.length, training: 0, uploaded: 0 };
			}
		} catch (error) {
			console.error('Failed to discover images:', error);
			discoveryError = error.message;

			// Use fallback images
			allImages = fallbackImages.map((filename) => ({
				filename,
				type: 'validation',
				url: `/images/${filename}`,
				directory: '/mnt/truenas/fashion-app-ml/data/validation/image'
			}));
			imageStats = { validation: fallbackImages.length, training: 0, uploaded: 0 };
		} finally {
			isDiscoveringImages = false;
		}
	}

	function refreshImages() {
		discoverAllImages();
	}

	let imageFilter = $state('all'); // 'all', 'validation', 'training', 'uploaded'

	// Filter images based on type
	let filteredImages = $derived(
		imageFilter === 'all' ? allImages : allImages.filter((img) => img.type === imageFilter)
	);

	// Initialize on mount
	onMount(async () => {
		try {
			// Load all data
			await discoverAllImages();
		} catch (error) {
			console.log(error);
		}
	});
</script>

<div class="bg-background-50 min-h-screen p-6">
	<div class="mx-auto h-full w-full max-w-7xl">
		{#if health?.status === 'healthy'}
			<!-- Header -->
			<div class="mb-8">
				<div class="mb-6 flex items-center justify-between">
					<div class="flex items-center gap-4">
						<div class="rounded-lg bg-orange-500/20 p-3">
							<svg
								class="h-6 w-6 text-orange-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								></path>
							</svg>
						</div>
						<div>
							<h1 class="text-foreground-950 text-3xl font-bold">Fashion Gallery</h1>
							<p class="text-foreground-600">Browse and explore fashion items in our database</p>
						</div>
					</div>

					<button
						onclick={refreshImages}
						disabled={isDiscoveringImages}
						class="text-foreground-950 disabled:bg-background-400 disabled:text-foreground-500 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-orange-700 focus:ring-2 focus:ring-orange-500/50 focus:outline-none disabled:cursor-not-allowed"
					>
						{#if isDiscoveringImages}
							<span class="flex items-center gap-2">
								<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
										fill="none"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Discovering...
							</span>
						{:else}
							<span class="flex items-center gap-2">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									></path>
								</svg>
								Refresh Images
							</span>
						{/if}
					</button>
				</div>

				<!-- Discovery Error -->
				{#if discoveryError}
					<div class="mb-6 rounded-xl border border-yellow-200 bg-yellow-500/10 p-4">
						<div class="flex items-center gap-3">
							<div class="rounded-full bg-yellow-500/20 p-2">
								<svg
									class="h-5 w-5 text-yellow-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
									></path>
								</svg>
							</div>
							<div>
								<p class="font-medium text-yellow-800">Image discovery issue: {discoveryError}</p>
								<p class="text-sm text-yellow-700">
									Using fallback images. Check your TrueNAS connection.
								</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Statistics and Filter -->
				{#if imageStats}
					<div class="mb-6 space-y-4">
						<!-- Statistics Cards -->
						<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
							<div class="bg-background-100 border-background-200 rounded-lg border p-4">
								<div class="flex items-center gap-3">
									<div class="rounded-lg bg-blue-500/20 p-2">
										<svg
											class="h-5 w-5 text-blue-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
											></path>
										</svg>
									</div>
									<div>
										<p class="text-foreground-600 text-sm">Validation</p>
										<p class="text-foreground-950 text-xl font-bold">{imageStats.validation}</p>
									</div>
								</div>
							</div>

							<div class="bg-background-100 border-background-200 rounded-lg border p-4">
								<div class="flex items-center gap-3">
									<div class="rounded-lg bg-green-500/20 p-2">
										<svg
											class="h-5 w-5 text-green-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
											></path>
										</svg>
									</div>
									<div>
										<p class="text-foreground-600 text-sm">Training</p>
										<p class="text-foreground-950 text-xl font-bold">{imageStats.training}</p>
									</div>
								</div>
							</div>

							<div class="bg-background-100 border-background-200 rounded-lg border p-4">
								<div class="flex items-center gap-3">
									<div class="rounded-lg bg-purple-500/20 p-2">
										<svg
											class="h-5 w-5 text-purple-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
											></path>
										</svg>
									</div>
									<div>
										<p class="text-foreground-600 text-sm">Uploaded</p>
										<p class="text-foreground-950 text-xl font-bold">{imageStats.uploaded}</p>
									</div>
								</div>
							</div>

							<div class="bg-background-100 border-background-200 rounded-lg border p-4">
								<div class="flex items-center gap-3">
									<div class="rounded-lg bg-orange-500/20 p-2">
										<svg
											class="h-5 w-5 text-orange-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
											></path>
										</svg>
									</div>
									<div>
										<p class="text-foreground-600 text-sm">Total</p>
										<p class="text-foreground-950 text-xl font-bold">{allImages.length}</p>
									</div>
								</div>
							</div>
						</div>

						<!-- Filter Buttons -->
						<div class="flex justify-center">
							<div class="bg-background-100 border-background-200 flex rounded-xl border p-1">
								<button
									class="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 {imageFilter ===
									'all'
										? 'text-foreground-950 bg-orange-600 shadow-sm'
										: 'text-foreground-600 hover:text-foreground-800 hover:bg-background-200'}"
									onclick={() => (imageFilter = 'all')}
								>
									All ({allImages.length})
								</button>
								<button
									class="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 {imageFilter ===
									'validation'
										? 'text-foreground-950 bg-blue-600 shadow-sm'
										: 'text-foreground-600 hover:text-foreground-800 hover:bg-background-200'}"
									onclick={() => (imageFilter = 'validation')}
								>
									Validation ({imageStats.validation})
								</button>
								<button
									class="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 {imageFilter ===
									'training'
										? 'text-foreground-950 bg-green-600 shadow-sm'
										: 'text-foreground-600 hover:text-foreground-800 hover:bg-background-200'}"
									onclick={() => (imageFilter = 'training')}
								>
									Training ({imageStats.training})
								</button>
								<button
									class="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 {imageFilter ===
									'uploaded'
										? 'text-foreground-950 bg-purple-600 shadow-sm'
										: 'text-foreground-600 hover:text-foreground-800 hover:bg-background-200'}"
									onclick={() => (imageFilter = 'uploaded')}
								>
									Uploaded ({imageStats.uploaded})
								</button>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Image Grid -->
			{#if filteredImages.length > 0}
				<div class="space-y-6">
					<!-- Current Filter Info -->
					{#if imageFilter !== 'all'}
						<div class="flex items-center justify-center">
							<div class="bg-background-100 border-background-200 rounded-full border px-4 py-2">
								<span class="text-foreground-700 text-sm font-medium">
									Showing {filteredImages.length}
									{imageFilter} images
								</span>
							</div>
						</div>
					{/if}

					<!-- Grid -->
					<div class="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
						{#each filteredImages.slice(0, 50) as imageInfo (imageInfo.filename)}
							<a
								href="/find/{imageInfo.id}"
								class="group bg-background-100 border-background-200 relative overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:scale-105 hover:border-orange-300 hover:shadow-lg"
							>
								<div class="">
									<img
										src="{API_URL}{imageInfo.url}"
										alt="Fashion item {imageInfo.filename}"
										class="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
										loading="lazy"
										onerror={(e) => {
											console.warn(`Failed to load image: ${imageInfo.filename}`);
											e.target.src =
												'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23374151"/><text x="100" y="100" text-anchor="middle" dy="0.3em" fill="%239CA3AF" font-family="Arial" font-size="12">Image Not Found</text></svg>';
										}}
									/>

									<!-- Type Badge -->
									<!-- <div class="absolute top-3 left-3">
										<span
											class="rounded-full px-2 py-1 text-xs font-medium backdrop-blur-sm {imageInfo.type ===
											'validation'
												? 'text-foreground-950 bg-blue-600'
												: imageInfo.type === 'training'
													? 'text-foreground-950 bg-green-600'
													: 'text-foreground-950 bg-purple-600'}"
										>
											{imageInfo.type}
										</span>
									</div> -->

									<!-- Hover Overlay -->
									<div
										class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
									>
										<div class="absolute right-0 bottom-0 left-0 p-4">
											<div class="flex items-center justify-between">
												<span class="text-xs font-medium text-white"> View Similar </span>
												<svg
													class="h-4 w-4 text-white transition-transform group-hover:translate-x-1"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M9 5l7 7-7 7"
													></path>
												</svg>
											</div>
										</div>
									</div>
								</div>

								<!-- Image Info -->
								<div class="p-3">
									<p
										class="text-foreground-800 truncate text-sm font-medium"
										title="Fashion item {imageInfo.filename}"
									>
										{imageInfo.filename}
									</p>
									{#if imageInfo.id}
										<p class="text-foreground-500 text-xs">ID: {imageInfo.id}</p>
									{/if}
								</div>
							</a>
						{/each}
					</div>

					<!-- Load More Info -->
					{#if filteredImages.length > 50}
						<div class="bg-background-100 border-background-200 rounded-lg border p-4 text-center">
							<p class="text-foreground-600 text-sm">
								Showing first 50 of {filteredImages.length}
								{imageFilter === 'all' ? '' : imageFilter} images
							</p>
						</div>
					{/if}
				</div>
			{:else}
				<!-- Empty State -->
				<div
					class="bg-background-100 border-background-200 rounded-xl border p-12 text-center shadow-lg"
				>
					<div class="flex flex-col items-center">
						<div class="mb-4 rounded-full bg-orange-500/20 p-4">
							<svg
								class="h-8 w-8 text-orange-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								></path>
							</svg>
						</div>
						<h3 class="text-foreground-800 mb-2 text-lg font-medium">
							No {imageFilter === 'all' ? '' : imageFilter} images found
						</h3>
						<p class="text-foreground-600 mb-4">Try adjusting your filter or refresh the gallery</p>
						{#if imageFilter !== 'all'}
							<button
								onclick={() => (imageFilter = 'all')}
								class="text-foreground-950 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-orange-700 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
							>
								Show All Images
							</button>
						{/if}
					</div>
				</div>
			{/if}
		{:else}
			<!-- Server Unhealthy State -->
			<div class="bg-background-100 rounded-xl border border-red-200 p-12 text-center shadow-lg">
				<div class="flex flex-col items-center">
					<div class="mb-4 rounded-full bg-red-500/20 p-4">
						<svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
							></path>
						</svg>
					</div>
					<h2 class="text-foreground-800 mb-2 text-xl font-semibold">Server Not Available</h2>
					<p class="text-foreground-600">Please check the system status and try again</p>
				</div>
			</div>
		{/if}
	</div>
</div>
