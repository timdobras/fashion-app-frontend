<script lang="ts">
	import { serverHealth } from '$lib/stores/serverHealth.svelte';

	const health = $derived(serverHealth.data);
</script>

<div class="mx-auto h-full w-full max-w-4xl p-6">
	<div class="mb-8 flex items-center justify-between">
		<h2 class="text-foreground-950 text-3xl font-bold">System Status</h2>
		<div class="flex items-center gap-2">
			<div class="h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
			<span class="text-foreground-800 text-sm">Live</span>
		</div>
	</div>

	{#if health}
		<div class="space-y-6">
			<!-- Models Status -->
			<div class="bg-background-100 border-background-200 rounded-xl border p-6 shadow-lg">
				<div class="mb-6 flex items-center gap-3">
					<div class="rounded-lg bg-cyan-500/20 p-2">
						<svg
							class="h-5 w-5 text-cyan-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							></path>
						</svg>
					</div>
					<h3 class="text-foreground-950 text-xl font-semibold">ML Models</h3>
				</div>
				<div class="space-y-4">
					<div class="bg-background-200 flex items-center justify-between rounded-lg p-4">
						<div class="flex items-center gap-3">
							<div class="bg-foreground-300 h-2 w-2 rounded-full"></div>
							<span class="text-foreground-900 font-medium">Embedding Model</span>
						</div>
						<span
							class={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
								health.models_loaded.embedding_model
									? 'bg-green-500/20 text-green-400'
									: 'bg-red-500/20 text-red-400'
							}`}
						>
							{health.models_loaded.embedding_model ? 'Loaded' : 'Not Loaded'}
						</span>
					</div>
					<div class="bg-background-200 flex items-center justify-between rounded-lg p-4">
						<div class="flex items-center gap-3">
							<div class="bg-foreground-300 h-2 w-2 rounded-full"></div>
							<span class="text-foreground-900 font-medium">Classification Model</span>
						</div>
						<span
							class={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
								health.models_loaded.classification_model
									? 'bg-green-500/20 text-green-400'
									: 'bg-red-500/20 text-red-400'
							}`}
						>
							{health.models_loaded.classification_model ? 'Loaded' : 'Not Loaded'}
						</span>
					</div>
				</div>
			</div>

			<!-- System Components -->
			<div class="bg-background-100 border-background-200 rounded-xl border p-6 shadow-lg">
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
								d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
							></path>
						</svg>
					</div>
					<h3 class="text-foreground-950 text-xl font-semibold">System Components</h3>
				</div>
				<div class="space-y-4">
					<div class="bg-background-200 flex items-center justify-between rounded-lg p-4">
						<div class="flex items-center gap-3">
							<div class="bg-foreground-300 h-2 w-2 rounded-full"></div>
							<span class="text-foreground-900 font-medium">Database</span>
						</div>
						<span
							class={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
								health.database_accessible
									? 'bg-green-500/20 text-green-400'
									: 'bg-red-500/20 text-red-400'
							}`}
						>
							{health.database_accessible ? 'Connected' : 'Disconnected'}
						</span>
					</div>
					<div class="bg-background-200 flex items-center justify-between rounded-lg p-4">
						<div class="flex items-center gap-3">
							<div class="bg-foreground-300 h-2 w-2 rounded-full"></div>
							<span class="text-foreground-900 font-medium">TensorFlow</span>
						</div>
						<span
							class={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
								health.imports_working.tensorflow
									? 'bg-green-500/20 text-green-400'
									: 'bg-red-500/20 text-red-400'
							}`}
						>
							{health.imports_working.tensorflow ? 'Working' : 'Error'}
						</span>
					</div>
					<div class="bg-background-200 flex items-center justify-between rounded-lg p-4">
						<div class="flex items-center gap-3">
							<div class="bg-foreground-300 h-2 w-2 rounded-full"></div>
							<span class="text-foreground-900 font-medium">Image Processing</span>
						</div>
						<span
							class={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
								health.imports_working.pil
									? 'bg-green-500/20 text-green-400'
									: 'bg-red-500/20 text-red-400'
							}`}
						>
							{health.imports_working.pil ? 'Working' : 'Error'}
						</span>
					</div>
				</div>
			</div>

			<!-- System Information -->
			<div class="bg-background-100 border-background-200 rounded-xl border p-6 shadow-lg">
				<div class="mb-6 flex items-center gap-3">
					<div class="rounded-lg bg-blue-500/20 p-2">
						<svg
							class="h-5 w-5 text-blue-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</div>
					<h3 class="text-foreground-950 text-xl font-semibold">System Information</h3>
				</div>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="bg-background-200 border-background-300 rounded-lg border p-6 text-center">
						<div class="mb-3 flex items-center justify-center">
							<div class="rounded-full bg-green-500/20 p-3">
								<svg
									class="h-6 w-6 text-green-400"
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
						</div>
						<p class="text-foreground-700 mb-1 text-sm">API Status</p>
						<p class="text-xl font-bold text-green-400">Online</p>
					</div>
					<div class="bg-background-200 border-background-300 rounded-lg border p-6 text-center">
						<div class="mb-3 flex items-center justify-center">
							<div class="rounded-full bg-blue-500/20 p-3">
								<svg
									class="h-6 w-6 text-blue-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									></path>
								</svg>
							</div>
						</div>
						<p class="text-foreground-700 mb-1 text-sm">Last Updated</p>
						<p class="text-foreground-950 text-xl font-bold">
							{new Date(health.timestamp).toLocaleTimeString()}
						</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div
			class="bg-background-100 border-background-200 rounded-xl border p-12 text-center shadow-lg"
		>
			<div class="mb-4 flex items-center justify-center">
				<div class="rounded-full bg-orange-500/20 p-4">
					<svg
						class="h-8 w-8 text-orange-400"
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
			<p class="text-foreground-800 mb-2 text-lg font-medium">No Health Data Available</p>
			<p class="text-foreground-600 text-sm">Unable to retrieve system health information</p>
		</div>
	{/if}
	<div class="h-32 w-full"></div>
</div>
