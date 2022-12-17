<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { signIn, signOut } from '@auth/sveltekit/client';
	export let data: PageData;
	const user = data.session?.user;
</script>

<h1 class="text-3xl font-bold underline">Welcome to Sveltkit</h1>

{#if !user}
	<button class="bg-blue-400" on:click={() => signIn()}>login</button>
{:else}
	<p>hi there, {user.name}</p>
	<button on:click={() => signOut()}>log out</button>
{/if}

<p class="">Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
