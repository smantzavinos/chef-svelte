import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    sveltekit(),
    // The code below enables dev tools like taking screenshots
    // while being developed on chef.convex.dev.
    mode === "development"
      ? {
          name: "inject-chef-dev",
          transform(code: string, id: string) {
            if (id.includes("+page.svelte") || id.includes("+layout.svelte")) {
              return {
                code: `${code}

<svelte:head>
  <script>
    window.addEventListener('message', async (message) => {
      if (message.source !== window.parent) return;
      if (message.data.type !== 'chefPreviewRequest') return;

      const worker = await import('https://chef.convex.dev/scripts/worker.bundled.mjs');
      await worker.respondToMessage(message);
    });
  </script>
</svelte:head>
                `,
                map: null,
              };
            }
            return null;
          },
        }
      : null,
  ].filter(Boolean),
}));
