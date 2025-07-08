<script>
	import { serverHealth } from '$lib/stores/serverHealth.svelte';
	import { onMount } from 'svelte';

	const health = $derived(serverHealth.data);
	// Upload and search state
	let selectedFile = $state(null);
	let uploadResults = $state(null);
	let classificationResults = $state(null);
	let isUploading = $state(false);
	let isClassifying = $state(false);
	let searchProgress = $state('');

	// UI state
	let activeMode = $state('upload'); // 'upload' or 'classify'

	const API_URL = 'https://fashionserver.timdobras.com';

	// --- API Functions ---
	async function uploadAndSearch(file) {
		isUploading = true;
		uploadResults = null;
		searchProgress = 'Uploading image...';

		try {
			const formData = new FormData();
			formData.append('file', file);

			searchProgress = 'Processing with ML models...';
			const response = await fetch(`${API_URL}/upload-fashion-image`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.detail || `HTTP ${response.status}`);
			}

			searchProgress = 'Generating results...';
			uploadResults = await response.json();
			searchProgress = '';
		} catch (error) {
			console.error('Upload failed:', error);
			uploadResults = { success: false, error: error.message };
			searchProgress = '';
		} finally {
			isUploading = false;
		}
	}

	async function classifyImage(file) {
		isClassifying = true;
		classificationResults = null;

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch(`${API_URL}/classify-image`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.detail || `HTTP ${response.status}`);
			}

			classificationResults = await response.json();
		} catch (error) {
			console.error('Classification failed:', error);
			classificationResults = { success: false, error: error.message };
		} finally {
			isClassifying = false;
		}
	}

	// --- Event Handlers ---
	function handleFileSelect(event) {
		const file = event.target.files[0];
		if (file && file.type.startsWith('image/')) {
			selectedFile = file;
			// Clear previous results when new file is selected
			uploadResults = null;
			classificationResults = null;
		} else {
			alert('Please select a valid image file');
		}
	}

	function handleUploadAndSearch() {
		if (selectedFile) {
			uploadAndSearch(selectedFile);
		}
	}

	function handleClassifyOnly() {
		if (selectedFile) {
			classifyImage(selectedFile);
		}
	}
</script>

<div class="bg-background-50 min-h-screen p-6">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="text-foreground-950 mb-4 text-4xl font-bold">Fashion Image Analysis</h1>
			<p class="text-foreground-700 text-lg">
				Upload and analyze fashion images with ML-powered similarity search and classification
			</p>
		</div>

		<!-- Mode Selection -->
		<div class="mb-8 flex justify-center">
			<div class="bg-background-100 border-background-200 flex rounded-xl border p-1">
				<button
					class="rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 {activeMode ===
					'upload'
						? 'text-foreground-950 bg-orange-600 shadow-sm'
						: 'text-foreground-600 hover:text-foreground-800'}"
					onclick={() => (activeMode = 'upload')}
				>
					<div class="flex items-center gap-2">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							></path>
						</svg>
						Upload & Search
					</div>
				</button>
				<button
					class="rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 {activeMode ===
					'classify'
						? 'text-foreground-950 bg-purple-500 shadow-sm'
						: 'text-foreground-600 hover:text-foreground-800'}"
					onclick={() => (activeMode = 'classify')}
				>
					<div class="flex items-center gap-2">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
							></path>
						</svg>
						Classify Only
					</div>
				</button>
			</div>
		</div>

		{#if health?.status === 'healthy'}
			<!-- Upload & Search Mode -->
			{#if activeMode === 'upload'}
				<div class="space-y-8">
					<div class="text-center">
						<h2 class="text-foreground-950 mb-2 text-2xl font-semibold">
							Upload & Find Similar Items
						</h2>
						<p class="text-foreground-600">
							Upload a fashion image to find visually similar items in our database
						</p>
					</div>

					<!-- File Upload Section -->
					<div
						class="bg-background-100 border-background-200 mx-auto max-w-lg rounded-xl border p-8 shadow-lg"
					>
						<div class="mb-6 flex items-center gap-3">
							<div class="rounded-lg bg-orange-600/20 p-2">
								<svg
									class="h-5 w-5 text-orange-400"
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
							<label class="text-foreground-950 text-lg font-medium">Select Fashion Image</label>
						</div>

						<input
							type="file"
							accept="image/*"
							onchange={handleFileSelect}
							class="border-background-300 bg-background-200 text-foreground-800 file:text-foreground-950 mb-6 w-full rounded-lg border p-3 transition-colors file:mr-4 file:rounded-lg file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:font-medium file:hover:bg-orange-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none"
						/>

						{#if selectedFile}
							<div class="bg-background-200 border-background-300 mb-6 rounded-lg border p-4">
								<div class="text-center">
									<div class="mb-3 flex items-center justify-center gap-2">
										<svg
											class="h-4 w-4 text-green-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											></path>
										</svg>
										<span class="text-sm font-medium text-green-400"
											>{selectedFile.name} selected</span
										>
									</div>
									<img
										src={URL.createObjectURL(selectedFile)}
										alt="Preview"
										class="border-background-300 mx-auto max-h-40 rounded-lg border shadow-sm"
									/>
								</div>
							</div>
						{/if}

						<button
							onclick={handleUploadAndSearch}
							disabled={!selectedFile || isUploading}
							class="text-foreground-950 disabled:bg-background-400 disabled:text-foreground-500 w-full rounded-lg bg-orange-600 px-6 py-3 font-medium transition-all duration-200 hover:bg-orange-600 focus:ring-2 focus:ring-orange-400/50 focus:outline-none disabled:cursor-not-allowed"
						>
							{#if isUploading}
								<span class="flex items-center justify-center gap-2">
									<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
									{searchProgress || 'Processing...'}
								</span>
							{:else}
								<span class="flex items-center justify-center gap-2">
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										></path>
									</svg>
									Upload & Search Similar Items
								</span>
							{/if}
						</button>
					</div>

					<!-- Upload Results -->
					{#if uploadResults}
						<div class="bg-background-100 border-background-200 rounded-xl border p-8 shadow-lg">
							{#if uploadResults.success}
								<div class="mb-6 flex items-center gap-3">
									<div class="rounded-lg bg-green-500/20 p-2">
										<svg
											class="h-5 w-5 text-green-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											></path>
										</svg>
									</div>
									<h3 class="text-foreground-950 text-xl font-semibold">Analysis Complete</h3>
								</div>

								<!-- Uploaded Image Display -->
								<div class="mb-8 text-center">
									<h4 class="text-foreground-900 mb-4 text-lg font-medium">Uploaded Image</h4>
									<div
										class="border-background-300 bg-background-200 inline-block rounded-lg border p-2"
									>
										<img
											src="{API_URL}{uploadResults.uploaded_image_url}"
											alt="Uploaded fashion item"
											class="max-h-64 rounded-lg shadow-sm"
										/>
									</div>
								</div>

								<!-- Classification Result -->
								<div class="bg-background-200 border-background-300 mb-8 rounded-lg border p-6">
									<h4 class="text-foreground-950 mb-4 text-lg font-medium">
										Classification Result
									</h4>
									<div class="flex items-center justify-between">
										<div>
											<p class="text-foreground-950 text-xl font-bold">
												{uploadResults.predicted_category}
											</p>
											<p class="text-foreground-600 text-sm">
												{(uploadResults.confidence * 100).toFixed(1)}% confidence
											</p>
										</div>
										<div class="text-right">
											<p class="text-foreground-600 text-sm">Processing time</p>
											<p class="text-foreground-800 font-medium">
												{uploadResults.processing_time.toFixed(2)}s
											</p>
										</div>
									</div>
								</div>

								<!-- Similar Items -->
								{#if uploadResults.similar_items && uploadResults.similar_items.length > 0}
									<div>
										<h4 class="text-foreground-950 mb-6 text-lg font-medium">
											Similar Items ({uploadResults.similar_items.length} found)
										</h4>
										<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
											{#each uploadResults.similar_items as item (item.id)}
												<a
													href="/find/{item.id}"
													class="group bg-background-200 border-background-300 overflow-hidden rounded-lg border shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
												>
													<div class="relative">
														<img
															src="{API_URL}{item.image_url}"
															alt={item.category}
															class="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110"
															loading="lazy"
															onerror={(e) => {
																e.target.src =
																	'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23374151"/><text x="100" y="100" text-anchor="middle" dy="0.3em" fill="%239CA3AF" font-family="Arial" font-size="12">Not Found</text></svg>';
															}}
														/>
														<div
															class="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-3"
														>
															<p class="truncate text-xs font-medium text-white">{item.category}</p>
															<p class="text-xs text-green-300">
																{(item.similarity_score * 100).toFixed(1)}% similar
															</p>
														</div>
													</div>
												</a>
											{/each}
										</div>
									</div>
								{:else}
									<div
										class="bg-background-200 border-background-300 rounded-lg border p-8 text-center"
									>
										<div class="mb-4 flex items-center justify-center">
											<div class="rounded-full bg-orange-600/20 p-3">
												<svg
													class="h-6 w-6 text-orange-400"
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
										</div>
										<p class="text-foreground-700 mb-2 text-lg font-medium">
											No similar items found
										</p>
										<p class="text-foreground-500 text-sm">
											This might be the first item of its kind in our database!
										</p>
									</div>
								{/if}
							{:else}
								<div class="text-center">
									<div class="mb-4 flex items-center justify-center">
										<div class="rounded-full bg-red-500/20 p-3">
											<svg
												class="h-6 w-6 text-red-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M6 18L18 6M6 6l12 12"
												></path>
											</svg>
										</div>
									</div>
									<h3 class="mb-2 text-xl font-semibold text-red-400">Upload Failed</h3>
									<p class="text-foreground-600 mb-2">{uploadResults.error}</p>
									<p class="text-foreground-500 text-sm">
										Please try again or check your image file.
									</p>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Classify Only Mode -->
			{#if activeMode === 'classify'}
				<div class="space-y-8">
					<div class="text-center">
						<h2 class="text-foreground-950 mb-2 text-2xl font-semibold">Image Classification</h2>
						<p class="text-foreground-600">
							Get detailed classification results for your fashion image
						</p>
					</div>

					<!-- File Upload Section -->
					<div
						class="bg-background-100 border-background-200 mx-auto max-w-lg rounded-xl border p-8 shadow-lg"
					>
						<div class="mb-6 flex items-center gap-3">
							<div class="rounded-lg bg-purple-500/20 p-2">
								<svg
									class="h-5 w-5 text-purple-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
									></path>
								</svg>
							</div>
							<label class="text-foreground-950 text-lg font-medium">Select Fashion Image</label>
						</div>

						<input
							type="file"
							accept="image/*"
							onchange={handleFileSelect}
							class="border-background-300 bg-background-200 text-foreground-800 file:text-foreground-950 mb-6 w-full rounded-lg border p-3 transition-colors file:mr-4 file:rounded-lg file:border-0 file:bg-purple-500 file:px-4 file:py-2 file:font-medium file:hover:bg-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none"
						/>

						{#if selectedFile}
							<div class="bg-background-200 border-background-300 mb-6 rounded-lg border p-4">
								<div class="text-center">
									<div class="mb-3 flex items-center justify-center gap-2">
										<svg
											class="h-4 w-4 text-green-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											></path>
										</svg>
										<span class="text-sm font-medium text-green-400"
											>{selectedFile.name} selected</span
										>
									</div>
									<img
										src={URL.createObjectURL(selectedFile)}
										alt="Preview"
										class="border-background-300 mx-auto max-h-40 rounded-lg border shadow-sm"
									/>
								</div>
							</div>
						{/if}

						<button
							onclick={handleClassifyOnly}
							disabled={!selectedFile || isClassifying}
							class="text-foreground-950 disabled:bg-background-400 disabled:text-foreground-500 w-full rounded-lg bg-purple-500 px-6 py-3 font-medium transition-all duration-200 hover:bg-purple-600 focus:ring-2 focus:ring-purple-400/50 focus:outline-none disabled:cursor-not-allowed"
						>
							{#if isClassifying}
								<span class="flex items-center justify-center gap-2">
									<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
									Classifying...
								</span>
							{:else}
								<span class="flex items-center justify-center gap-2">
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
										></path>
									</svg>
									Classify Image
								</span>
							{/if}
						</button>
					</div>

					<!-- Classification Results -->
					{#if classificationResults}
						<div class="bg-background-100 border-background-200 rounded-xl border p-8 shadow-lg">
							{#if classificationResults.success}
								<div class="mb-6 flex items-center gap-3">
									<div class="rounded-lg bg-green-500/20 p-2">
										<svg
											class="h-5 w-5 text-green-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											></path>
										</svg>
									</div>
									<h3 class="text-foreground-950 text-xl font-semibold">Classification Results</h3>
								</div>

								<!-- Top Prediction -->
								<div class="bg-background-200 border-background-300 mb-6 rounded-lg border p-6">
									<h4 class="text-foreground-950 mb-4 text-lg font-medium">
										Primary Classification
									</h4>
									<div class="flex items-center justify-between">
										<div>
											<p class="text-foreground-950 text-2xl font-bold">
												{classificationResults.predicted_category}
											</p>
											<p class="text-foreground-600 text-sm">
												{(classificationResults.confidence * 100).toFixed(1)}% confidence
											</p>
										</div>
										<div class="text-right">
											<div
												class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
											>
												<span class="text-foreground-950 text-lg font-bold">
													{(classificationResults.confidence * 100).toFixed(0)}%
												</span>
											</div>
										</div>
									</div>
								</div>

								<!-- All Predictions -->
								{#if classificationResults.all_predictions}
									<div>
										<h4 class="text-foreground-950 mb-4 text-lg font-medium">All Predictions</h4>
										<div class="space-y-3">
											{#each classificationResults.all_predictions as prediction, index}
												<div
													class="bg-background-200 border-background-300 flex items-center justify-between rounded-lg border p-4"
												>
													<div class="flex items-center gap-3">
														<span
															class="bg-background-300 text-foreground-700 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium"
														>
															{index + 1}
														</span>
														<span class="text-foreground-900 font-medium"
															>{prediction.category}</span
														>
													</div>
													<div class="flex items-center gap-3">
														<div class="bg-background-300 h-3 w-32 overflow-hidden rounded-full">
															<div
																class="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
																style="width: {prediction.confidence * 100}%"
															></div>
														</div>
														<span class="text-foreground-700 w-12 text-right text-sm font-medium">
															{(prediction.confidence * 100).toFixed(1)}%
														</span>
													</div>
												</div>
											{/each}
										</div>
									</div>
								{/if}
							{:else}
								<div class="text-center">
									<div class="mb-4 flex items-center justify-center">
										<div class="rounded-full bg-red-500/20 p-3">
											<svg
												class="h-6 w-6 text-red-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M6 18L18 6M6 6l12 12"
												></path>
											</svg>
										</div>
									</div>
									<h3 class="mb-2 text-xl font-semibold text-red-400">Classification Failed</h3>
									<p class="text-foreground-600 mb-2">{classificationResults.error}</p>
									<p class="text-foreground-500 text-sm">
										Please try again or check your image file.
									</p>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		{:else}
			<div
				class="bg-background-100 border-background-200 rounded-xl border p-12 text-center shadow-lg"
			>
				<div class="mb-4 flex items-center justify-center">
					<div class="rounded-full bg-red-500/20 p-4">
						<svg class="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
							></path>
						</svg>
					</div>
				</div>
				<h2 class="text-foreground-800 mb-2 text-xl font-semibold">API Currently Offline</h2>
				<p class="text-foreground-500">Please check your connection and try again</p>
			</div>
		{/if}
	</div>
</div>
