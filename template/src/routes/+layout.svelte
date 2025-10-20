<script lang="ts">
  import { browser } from '$app/environment';
  import { PUBLIC_CONVEX_URL, PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
  import { setupConvex } from 'convex-svelte';
  import { ClerkProvider } from 'svelte-clerk';
  import '../app.css';

  const { children } = $props();

  if (browser) {
    setupConvex(PUBLIC_CONVEX_URL);
  }
</script>

<ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}>
  {@render children()}
</ClerkProvider>
