<script lang="ts">
	import { serverHealth } from '$lib/stores/serverHealth.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import type { IServerHealth } from '../types/ServerHealth';

	let { children } = $props();
	const API_URL = 'https://fashionserver.timdobras.com';

	async function checkHealth() {
		try {
			const res = await fetch(`${API_URL}/health`);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			serverHealth.data = (await res.json()) as IServerHealth;
			return true;
		} catch {
			serverHealth.data = null;
			return false;
		}
	}

	const health = $derived(serverHealth.data);
	let apiStatus = $state('checking');

	onMount(async () => {
		await checkHealth();
		apiStatus = health?.status || 'offline';
	});
</script>

<div class="bg-background-50 flex h-[100svh] w-screen flex-col overflow-hidden">
	<nav class="flex flex-shrink-0 flex-col shadow-lg">
		<!-- Status Bar -->
		<div
			class="bg-background-100 border-background-200 flex h-10 w-full items-center justify-center border-b text-sm"
		>
			{#if apiStatus === 'checking'}
				<div class="flex items-center gap-2">
					<svg class="h-4 w-4 animate-spin text-orange-600" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					<span class="text-foreground-700 font-medium">Checking API status...</span>
				</div>
			{:else if apiStatus === 'healthy'}
				<div class="flex items-center gap-2">
					<div class="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
					<span class="font-medium text-green-400">Connected to server</span>
				</div>
			{:else}
				<div class="flex items-center gap-2">
					<svg class="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
						></path>
					</svg>
					<span class="font-medium text-red-400">Server Offline</span>
				</div>
			{/if}
		</div>

		<!-- Main Navigation -->
		<div class="bg-background-200 border-background-300 border-b px-6 py-4">
			<div class="mx-auto flex w-full max-w-7xl items-center justify-between">
				<!-- Logo/Brand -->
				<div class="flex items-center gap-3">
					<div class="rounded-lg bg-orange-500/20 p-2">
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
						<h1 class="text-foreground-950 text-lg font-bold">FashionSearch</h1>
						<p class="text-foreground-600 text-xs">Retrieval System</p>
					</div>
				</div>

				<!-- Navigation Links -->
				<nav class="flex items-center gap-2">
					<a
						href="/"
						class="group text-foreground-700 hover:bg-background-300 hover:text-foreground-950 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
					>
						<svg
							class="h-4 w-4 transition-colors group-hover:text-orange-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
							></path>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 21l4-7 4 7"
							></path>
						</svg>
						<span>Gallery</span>
					</a>

					<a
						href="/upload"
						class="group text-foreground-700 hover:bg-background-300 hover:text-foreground-950 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
					>
						<svg
							class="h-4 w-4 transition-colors group-hover:text-orange-600"
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
						<span>Upload</span>
					</a>

					<a
						href="/stats"
						class="group text-foreground-700 hover:bg-background-300 hover:text-foreground-950 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
					>
						<svg
							class="h-4 w-4 transition-colors group-hover:text-orange-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							></path>
						</svg>
						<span>System</span>
					</a>

					<a
						href="https://github.com/timdobras"
						class="group text-foreground-700 hover:bg-background-300 hover:text-foreground-950 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
					>
						<svg
							class="h-4 w-4 transition-colors group-hover:text-orange-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
							></path>
						</svg>
						<span>GitHub</span>
					</a>
				</nav>

				<!-- Health Indicator -->
				<div class="flex items-center gap-2">
					{#if apiStatus === 'healthy'}
						<div class="rounded-full bg-green-500/20 px-3 py-1">
							<div class="flex items-center gap-2">
								<div class="h-2 w-2 rounded-full bg-green-400"></div>
								<span class="text-xs font-medium text-green-600">Online</span>
							</div>
						</div>
					{:else if apiStatus === 'checking'}
						<div class="rounded-full bg-orange-500/20 px-3 py-1">
							<div class="flex items-center gap-2">
								<div class="h-2 w-2 animate-pulse rounded-full bg-orange-400"></div>
								<span class="text-xs font-medium text-orange-600">Checking</span>
							</div>
						</div>
					{:else}
						<div class="rounded-full bg-red-500/20 px-3 py-1">
							<div class="flex items-center gap-2">
								<div class="h-2 w-2 rounded-full bg-red-400"></div>
								<span class="text-xs font-medium text-red-600">Offline</span>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</nav>

	<main class="bg-background-50 min-h-0 flex-1 overflow-y-auto">
		{@render children()}
	</main>
</div>
