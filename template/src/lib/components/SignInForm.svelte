<script lang="ts">
  import { SignIn } from 'svelte-clerk';
</script>

<div class="w-full flex justify-center">
  <SignIn
    appearance={{
      elements: {
        rootBox: "w-full",
        card: "shadow-none"
      }
    }}
  />
</div>
