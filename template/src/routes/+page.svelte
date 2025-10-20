<script lang="ts">
  import { SignedIn, SignedOut, UserButton } from 'svelte-clerk';
  import SignInForm from '$lib/components/SignInForm.svelte';
  import { Toaster } from 'sonner';
</script>

<div class="min-h-screen flex flex-col bg-gray-50">
  <header class="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
    <h2 class="text-xl font-semibold text-primary">Chef</h2>
    <SignedIn>
      <UserButton afterSignOutUrl="/" />
    </SignedIn>
  </header>

  <main class="flex-1 flex items-center justify-center p-8">
    <div class="w-full max-w-md mx-auto">
      <div class="flex flex-col gap-section">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-primary mb-4">Cook with Chef</h1>
          <SignedIn let:user>
            <p class="text-xl text-secondary">
              Welcome back, {user.primaryEmailAddress?.emailAddress ?? user.firstName ?? "friend"}!
            </p>
          </SignedIn>
          <SignedOut>
            <p class="text-xl text-secondary">Sign in to get started</p>
          </SignedOut>
        </div>

        <SignedOut>
          <SignInForm />
        </SignedOut>
      </div>
    </div>
  </main>

  <Toaster />
</div>
