<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	const id = $derived(page.params.item_id);
	let data = $state(null);
	let loading = $state(false);
	let error = $state(null);
	$inspect(data);

	const API_URL = 'https://fashionserver.timdobras.com';

	async function searchSimilarById(
		imageId,
		limit = 50,
		minSimilarity = 0.0,
		categoryFilter = null
	) {
		try {
			let url = `${API_URL}/search-by-id/${imageId}?limit=${limit}&min_similarity=${minSimilarity}`;
			if (categoryFilter) {
				url += `&category_filter=${encodeURIComponent(categoryFilter)}`;
			}

			const response = await fetch(url);
			if (!response.ok) throw new Error(`HTTP ${response.status}`);

			return await response.json();
		} catch (error) {
			console.error('Search by ID failed:', error);
			throw error;
		}
	}

	// React to ID changes with $effect
	$effect(() => {
		async function fetchData() {
			if (!id) return;

			try {
				loading = true;
				error = null;
				data = null;

				const similar = await searchSimilarById(id);
				data = similar;
			} catch (err) {
				error = err.message;
				data = null;
			} finally {
				loading = false;
			}
		}

		fetchData();
	});
</script>

<div class="bg-background-50 min-h-screen p-6">
	<div class="mx-auto h-full w-full max-w-7xl">
		<!-- Header -->
		<div class="mb-8">
			<div class="mb-6 flex items-center gap-4">
				<a
					href="/"
					class="text-foreground-600 flex items-center gap-2 transition-colors hover:text-orange-600"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						></path>
					</svg>
					<span class="text-sm font-medium">Back to Gallery</span>
				</a>
			</div>

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
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path>
					</svg>
				</div>
				<div>
					<h1 class="text-foreground-950 text-3xl font-bold">Similar Items</h1>
					<p class="text-foreground-600">Items similar to #{id}</p>
				</div>
			</div>
		</div>

		<!-- Main Image -->
		{#if data?.image_info?.url}
			<div class="mb-12">
				<div class="mb-4 flex items-center gap-3">
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
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							></path>
						</svg>
					</div>
					<h2 class="text-foreground-950 text-xl font-semibold">Reference Image</h2>
				</div>

				<div class="flex justify-center">
					<div
						class="bg-background-100 border-background-200 relative rounded-xl border p-4 shadow-lg"
					>
						<img
							src="{API_URL}{data.image_info.url}"
							alt="Reference fashion item #{id}"
							class="max-h-96 max-w-md rounded-lg shadow-sm"
						/>
						<div class="absolute top-2 right-2">
							<span
								class="text-foreground-950 rounded-full bg-orange-600 px-3 py-1 text-xs font-medium"
							>
								#{id}
							</span>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Content Area -->
		{#if loading}
			<div class="flex flex-col items-center justify-center py-16">
				<div class="mb-4 flex items-center justify-center">
					<div class="rounded-full bg-orange-500/20 p-4">
						<svg class="h-8 w-8 animate-spin text-orange-600" fill="none" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</div>
				</div>
				<h3 class="text-foreground-800 mb-2 text-lg font-medium">Finding Similar Items</h3>
				<p class="text-foreground-600">Searching through our database...</p>
			</div>
		{:else if error}
			<div class="bg-background-100 rounded-xl border border-red-200 p-8 shadow-lg">
				<div class="flex flex-col items-center text-center">
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
					<h3 class="text-foreground-900 mb-2 text-lg font-medium">Search Error</h3>
					<p class="text-foreground-600 mb-4">{error}</p>
					<button
						on:click={() => window.location.reload()}
						class="text-foreground-950 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-orange-700 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
					>
						Try Again
					</button>
				</div>
			</div>
		{:else if data?.similar_items?.length === 0}
			<div class="bg-background-100 border-background-200 rounded-xl border p-12 shadow-lg">
				<div class="flex flex-col items-center text-center">
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
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							></path>
						</svg>
					</div>
					<h3 class="text-foreground-800 mb-2 text-lg font-medium">No Similar Items Found</h3>
					<p class="text-foreground-600 mb-4">This item appears to be unique in our database.</p>
					<a
						href="/"
						class="text-foreground-950 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-orange-700 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
					>
						Browse Gallery
					</a>
				</div>
			</div>
		{:else if data?.similar_items}
			<!-- Similar Items Grid -->
			<div>
				<div class="mb-6 flex items-center justify-between">
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
						<h2 class="text-foreground-950 text-xl font-semibold">Similar Items</h2>
					</div>
					<div class="bg-background-200 border-background-300 rounded-full border px-4 py-2">
						<span class="text-foreground-700 text-sm font-medium">
							{data.similar_items.length} items found
						</span>
					</div>
				</div>

				<div class="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{#each data.similar_items as imageInfo (imageInfo.id)}
						<a
							href="/find/{imageInfo.id}"
							class="group bg-background-100 border-background-200 overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:scale-105 hover:border-orange-300 hover:shadow-lg"
						>
							<div class="relative">
								<img
									src="{API_URL}{imageInfo.image_url}"
									alt="Fashion item {imageInfo.id}"
									class="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
									loading="lazy"
									on:error={(e) => {
										e.target.src =
											'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23374151"/><text x="100" y="100" text-anchor="middle" dy="0.3em" fill="%239CA3AF" font-family="Arial" font-size="12">Image Not Found</text></svg>';
									}}
								/>

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

								<!-- Similarity Score Badge -->
								<!-- <div class="absolute top-3 right-3">
									<div class="rounded-full bg-orange-600 px-2 py-1 backdrop-blur-sm">
										<span class="text-foreground-950 text-xs font-bold">
											{(imageInfo.similarity_score * 100).toFixed(0)}%
										</span>
									</div>
								</div>
							</div> -->

								<!-- Item Info -->
								<div class="p-4">
									<div class="flex items-center justify-between">
										<p
											class="text-foreground-800 truncate text-sm font-medium"
											title="Item {imageInfo.id}"
										>
											#{imageInfo.id}
										</p>
										<div class="flex items-center gap-1">
											<div class="h-2 w-2 rounded-full bg-orange-600"></div>
											<span class="text-foreground-600 text-xs">
												{(imageInfo.similarity_score * 100).toFixed(1)}%
											</span>
										</div>
									</div>

									<!-- Similarity Bar -->
									<div class="bg-background-300 mt-2 h-1 w-full overflow-hidden rounded-full">
										<div
											class="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-700"
											style="width: {imageInfo.similarity_score * 100}%"
										></div>
									</div>
								</div>
							</div></a
						>
					{/each}
				</div>

				<!-- Additional Info -->
				{#if data.similar_items.length > 0}
					<div class="bg-background-100 border-background-200 mt-8 rounded-lg border p-4">
						<div class="text-foreground-600 flex items-center justify-center gap-2 text-sm">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<span>Similarity scores are calculated using ML image embeddings</span>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
