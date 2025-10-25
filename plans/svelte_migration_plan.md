# Chef Svelte Migration Plan

## Executive Summary

This document outlines a comprehensive plan to migrate Chef from generating React applications to generating Svelte 5 applications using SvelteKit. This migration focuses **exclusively** on the code that Chef generates for users, not the Chef application itself (which will remain built with React/Remix).

**Scope**: Convert the template, system prompts, and code generation examples from React to Svelte 5 with runes.

**Timeline Estimate**: 5-8 weeks

**Key Technologies**:

- Svelte 5 (with runes: $state, $derived, $effect, $props)
- SvelteKit (Svelte's full-stack framework)
- Vite (remains the same)
- Convex (has official Svelte support via `convex-svelte`)
- **Clerk** (for authentication via `svelte-clerk`) - **Note**: Using Clerk instead of Convex Auth because `@convex-dev/auth` only supports React
- TailwindCSS (remains the same)

---

## Table of Contents

1. [Background & Context](#background--context)
2. [Technical Overview](#technical-overview)
3. [React to Svelte 5 Pattern Mapping](#react-to-svelte-5-pattern-mapping)
4. [Clerk + Convex Integration](#clerk--convex-integration)
5. [Phase 1: Template Migration](#phase-1-template-migration)
6. [Phase 2: System Prompt Rewrite](#phase-2-system-prompt-rewrite)
7. [Phase 3: Build Configuration](#phase-3-build-configuration)
8. [Phase 4: Snapshot Generation](#phase-4-snapshot-generation)
9. [Phase 5: Testing & Validation](#phase-5-testing--validation)
10. [Implementation Checklist](#implementation-checklist)
11. [Risk Mitigation](#risk-mitigation)
12. [Success Metrics](#success-metrics)
13. [Rollback Plan](#rollback-plan)
14. [Post-Migration Tasks](#post-migration-tasks)
15. [Appendix A: Complete Example App](#appendix-a-complete-example-app)
16. [Appendix B: Quick Reference](#appendix-b-quick-reference)

---

## Background & Context

### What is Chef?

Chef is an AI-powered full-stack app builder that:

- Uses LLM-based code generation to create web applications
- Runs generated apps in WebContainer (browser-based Node.js environment)
- Integrates with Convex backend for database, auth, real-time, and functions
- Currently generates React + Vite applications

### Migration Goals

1. **Generate Svelte 5 applications instead of React**
2. **Use modern Svelte 5 runes** ($state, $derived, $effect, $props)
3. **Leverage SvelteKit** for full-stack capabilities
4. **Maintain Convex integration** using `convex-svelte` package
5. **Keep existing Chef UI unchanged** (React/Remix-based interface)

### Why Svelte 5?

- **Runes system**: Modern, reactive primitives that are compiler-based
- **Smaller bundle sizes**: Svelte compiles to vanilla JS
- **Built-in reactivity**: No need for hooks or complex state management
- **Better DX**: Simpler mental model, less boilerplate
- **Performance**: Faster runtime performance

---

## Technical Overview

### Current Architecture (React)

```
template/
├── src/
│   ├── main.tsx          # React entry point with providers
│   ├── App.tsx           # Main React component
│   ├── SignInForm.tsx    # Auth component using React hooks
│   └── SignOutButton.tsx # Button component
├── convex/               # Backend functions (unchanged)
├── package.json          # React dependencies
└── vite.config.ts        # Vite config with @vitejs/plugin-react
```

### Target Architecture (Svelte 5)

```
template/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte    # Root layout with Convex setup
│   │   └── +page.svelte      # Main page component
│   ├── lib/
│   │   ├── components/
│   │   │   ├── SignInForm.svelte
│   │   │   └── SignOutButton.svelte
│   │   └── index.ts
│   └── app.html          # HTML template
├── convex/               # Backend functions (unchanged)
├── package.json          # Svelte dependencies
├── vite.config.ts        # Vite config with @sveltejs/vite-plugin-svelte
└── svelte.config.js      # SvelteKit configuration
```

### Key Dependencies Changes

**Remove:**

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@vitejs/plugin-react": "^4.3.4",
  "@convex-dev/auth": "^0.0.80"
}
```

**Add:**

```json
{
  "svelte": "^5.0.0",
  "@sveltejs/kit": "^2.0.0",
  "@sveltejs/vite-plugin-svelte": "^4.0.0",
  "convex-svelte": "^0.1.0",
  "svelte-clerk": "^0.17.0",
  "@clerk/clerk-js": "^5.0.0"
}
```

**Add:**

```json
{
  "svelte": "^5.0.0",
  "@sveltejs/kit": "^2.0.0",
  "@sveltejs/vite-plugin-svelte": "^4.0.0",
  "convex-svelte": "^0.1.0"
}
```

---

## React to Svelte 5 Pattern Mapping

### 1. Component Structure

**React:**

```tsx
import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**Svelte 5:**

```svelte
<script lang="ts">
  let count = $state(0);
</script>

<div>
  <p>Count: {count}</p>
  <button onclick={() => count++}>
    Increment
  </button>
</div>
```

### 2. Props

**React:**

```tsx
interface Props {
  name: string;
  age?: number;
}

export default function Profile({ name, age = 18 }: Props) {
  return (
    <div>
      Hello {name}, age {age}
    </div>
  );
}
```

**Svelte 5:**

```svelte
<script lang="ts">
  interface Props {
    name: string;
    age?: number;
  }

  let { name, age = 18 }: Props = $props();
</script>

<div>Hello {name}, age {age}</div>
```

### 3. Computed Values

**React:**

```tsx
const [count, setCount] = useState(0);
const doubled = count * 2;
const quadrupled = doubled * 2;
```

**Svelte 5:**

```svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);
  let quadrupled = $derived(doubled * 2);
</script>
```

### 4. Effects / Side Effects

**React:**

```tsx
useEffect(() => {
  console.log('Count changed:', count);

  const interval = setInterval(() => {
    console.log('Current count:', count);
  }, 1000);

  return () => clearInterval(interval);
}, [count]);
```

**Svelte 5:**

```svelte
<script lang="ts">
  $effect(() => {
    console.log('Count changed:', count);

    const interval = setInterval(() => {
      console.log('Current count:', count);
    }, 1000);

    return () => clearInterval(interval);
  });
</script>
```

### 5. Convex Integration

**React:**

```tsx
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function Tasks() {
  const tasks = useQuery(api.tasks.list) || [];
  const addTask = useMutation(api.tasks.add);

  const [newTask, setNewTask] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await addTask({ text: newTask });
    setNewTask('');
  }

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>{task.text}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input value={newTask} onChange={(e) => setNewTask(e.target.value)} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
```

**Svelte 5:**

```svelte
<script lang="ts">
  import { useQuery, useMutation } from "convex-svelte";
  import { api } from "../convex/_generated/api";

  const tasksQuery = useQuery(api.tasks.list, {});
  const addTask = useMutation(api.tasks.add);

  let newTask = $state("");

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    await addTask({ text: newTask });
    newTask = "";
  }
</script>

<div>
  {#if tasksQuery.isLoading}
    <p>Loading...</p>
  {:else if tasksQuery.error}
    <p>Error: {tasksQuery.error}</p>
  {:else}
    <ul>
      {#each tasksQuery.data as task (task._id)}
        <li>{task.text}</li>
      {/each}
    </ul>
  {/if}

  <form onsubmit={handleSubmit}>
    <input bind:value={newTask} />
    <button type="submit">Add</button>
  </form>
</div>
```

### 6. Conditional Rendering

**React:**

```tsx
{
  user ? <p>Welcome {user.name}</p> : <p>Please sign in</p>;
}
```

**Svelte 5:**

```svelte
{#if user}
  <p>Welcome {user.name}</p>
{:else}
  <p>Please sign in</p>
{/if}
```

### 7. List Rendering

**React:**

```tsx
{
  items.map((item) => <div key={item.id}>{item.name}</div>);
}
```

**Svelte 5:**

```svelte
{#each items as item (item.id)}
  <div>{item.name}</div>
{/each}
```

### 8. Event Handlers

**React:**

```tsx
<button onClick={() => handleClick()}>Click</button>
<input onChange={e => handleChange(e.target.value)} />
<form onSubmit={handleSubmit}>
```

**Svelte 5:**

```svelte
<button onclick={() => handleClick()}>Click</button>
<input oninput={e => handleChange(e.target.value)} />
<form onsubmit={handleSubmit}>
```

### 9. Two-way Binding

**React:**

```tsx
const [value, setValue] = useState('');
<input value={value} onChange={(e) => setValue(e.target.value)} />;
```

**Svelte 5:**

```svelte
<script lang="ts">
  let value = $state("");
</script>

<input bind:value />
```

### 10. Authentication with Clerk

**React:**

```tsx
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';

export default function App() {
  return (
    <>
      <SignedIn>
        <p>Welcome!</p>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
```

**Svelte 5:**

```svelte
<script lang="ts">
  import { SignedIn, SignedOut, UserButton, SignInButton } from 'svelte-clerk';
</script>

<SignedIn>
  <p>Welcome!</p>
  <UserButton afterSignOutUrl="/" />
</SignedIn>

<SignedOut>
  <SignInButton mode="modal">
    <button>Sign In</button>
  </SignInButton>
</SignedOut>
```

---

## Clerk + Convex Integration

### Why Clerk Instead of Convex Auth?

**Original Plan**: Use `@convex-dev/auth` for authentication (React-based)

**Problem Discovered**: `@convex-dev/auth` **only supports React** and has no Svelte integration

**Solution**: Use **Clerk** for authentication, which has:

- Official Svelte 5 support via `svelte-clerk` package
- Mature, production-ready authentication
- Pre-built UI components for Svelte
- Seamless integration with Convex via JWT tokens
- Better developer experience and documentation

**Key Differences:**

| Feature              | Convex Auth  | Clerk                           |
| -------------------- | ------------ | ------------------------------- |
| Framework Support    | React only   | React, Svelte, Vue, and more    |
| Svelte 5 Support     | ❌ None      | ✅ Official via svelte-clerk    |
| Pre-built Components | React only   | Svelte components available     |
| Setup Complexity     | Medium       | Low (dashboard GUI)             |
| Cost                 | Free         | Free tier available             |
| OAuth Providers      | Manual setup | Built-in (Google, GitHub, etc.) |
| User Management      | DIY          | Full dashboard                  |

### Overview

Clerk provides authentication for the Svelte frontend, while Convex handles the backend logic and data. The integration works through Clerk's JWT tokens, which Convex validates on every request.

### How It Works

1. **Frontend**: User signs in via Clerk's components in the Svelte app
2. **JWT Token**: Clerk issues a JWT token stored in the browser
3. **Convex Request**: Each Convex query/mutation includes the JWT token
4. **Token Validation**: Convex validates the token and extracts user identity
5. **Authorization**: Convex functions use `ctx.auth.getUserIdentity()` to check permissions

### Setting Up Clerk with Convex

**Step 1: Create Clerk Application**

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Choose authentication methods (email, Google, GitHub, etc.)
4. Copy your publishable key and secret key

**Step 2: Configure Clerk in Convex**

Create a JWT template in your Clerk dashboard:

1. Go to **JWT Templates** in Clerk dashboard
2. Click **New Template** → **Convex**
3. Name it "convex" (lowercase, important!)
4. Copy the JWKS endpoint URL

**Step 3: Configure Convex Auth**

In your Convex dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add `CLERK_JWT_ISSUER_DOMAIN` with your Clerk domain (e.g., `https://your-app.clerk.accounts.dev`)

Alternatively, create `convex/auth.config.ts`:

```typescript
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: 'convex', // Must match JWT template name
    },
  ],
};
```

**Step 4: Add Environment Variables**

In your `.env.local` file:

```bash
# Clerk keys from dashboard
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex deployment URL (set by `npx convex dev`)
PUBLIC_CONVEX_URL=https://...
```

### Using Authentication in Convex Functions

**Protected Query Example:**

```typescript
import { query } from './_generated/server';
import { v } from 'convex/values';

export const getUserProfile = query({
  handler: async (ctx) => {
    // Get user identity from Clerk JWT
    const identity = await ctx.auth.getUserIdentity();

    // Check if user is authenticated
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // identity.subject is the Clerk user ID
    // identity.email is the user's email
    // identity.name is the user's name

    return {
      userId: identity.subject,
      email: identity.email,
      name: identity.name,
    };
  },
});
```

**Protected Mutation with User Data:**

```typescript
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { title, content }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const postId = await ctx.db.insert('posts', {
      title,
      content,
      authorId: identity.subject, // Clerk user ID
      authorName: identity.name || 'Anonymous',
      createdAt: Date.now(),
    });

    return postId;
  },
});
```

**Row-Level Security Example:**

```typescript
export const getMyPosts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Only return posts created by this user
    return await ctx.db
      .query('posts')
      .filter((q) => q.eq(q.field('authorId'), identity.subject))
      .collect();
  },
});
```

### User Identity Object

The `identity` object from `ctx.auth.getUserIdentity()` contains:

```typescript
{
  subject: string;        // Clerk user ID (e.g., "user_2abc...")
  email?: string;         // User's email
  emailVerified?: string; // Email verification status
  name?: string;          // User's full name
  givenName?: string;     // First name
  familyName?: string;    // Last name
  nickname?: string;      // Username/nickname
  pictureUrl?: string;    // Profile picture URL
  tokenIdentifier: string; // Unique token ID
  issuer: string;         // JWT issuer URL
}
```

### Best Practices

1. **Always check authentication**: Use `getUserIdentity()` in every protected function
2. **Store user ID**: Save `identity.subject` in your database for relationships
3. **Handle anonymous users**: Return empty arrays or null for unauthenticated users (don't throw errors for queries)
4. **Use indexes**: Index database tables by `userId` for efficient queries
5. **Validate ownership**: Always verify users can only access their own data
6. **Never trust client input**: Even with auth, validate all data in mutations
7. **Use helper functions**: Create reusable `getUserId()` helpers for cleaner code
8. **Separate public/private data**: Different queries for authenticated vs. anonymous users

### Security Checklist

**Authentication Security:**

- [ ] All sensitive queries/mutations check `getUserIdentity()`
- [ ] User IDs are validated before database operations
- [ ] Ownership is verified (users can't access others' data)
- [ ] Public queries don't leak private information
- [ ] Error messages don't expose sensitive data

**Authorization Patterns:**

```typescript
// ✅ GOOD: Verify ownership before updating
export const updatePost = mutation({
  args: { postId: v.id('posts'), title: v.string() },
  handler: async (ctx, { postId, title }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const post = await ctx.db.get(postId);
    if (!post) throw new Error('Post not found');
    if (post.authorId !== identity.subject) {
      throw new Error('Unauthorized');
    }

    await ctx.db.patch(postId, { title });
  },
});

// ❌ BAD: No ownership check
export const updatePost = mutation({
  args: { postId: v.id('posts'), title: v.string() },
  handler: async (ctx, { postId, title }) => {
    // Anyone can update any post!
    await ctx.db.patch(postId, { title });
  },
});
```

**Data Validation:**

```typescript
// ✅ GOOD: Validate all inputs
export const createComment = mutation({
  args: {
    postId: v.id('posts'),
    content: v.string(),
  },
  handler: async (ctx, { postId, content }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    // Validate content length
    if (content.length === 0 || content.length > 1000) {
      throw new Error('Comment must be 1-1000 characters');
    }

    // Verify post exists
    const post = await ctx.db.get(postId);
    if (!post) throw new Error('Post not found');

    await ctx.db.insert('comments', {
      postId,
      content,
      authorId: identity.subject,
      createdAt: Date.now(),
    });
  },
});
```

**Example Schema with User Indexes:**

```typescript
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.string(), // Clerk user ID
    authorName: v.string(),
    createdAt: v.number(),
  })
    .index('by_author', ['authorId'])
    .index('by_creation_time', ['createdAt']),
});
```

### Testing Clerk Integration

**Manual Testing:**

1. Sign up with a new account → Check Clerk dashboard for new user
2. Sign in → Check browser network tab for JWT token
3. Call a protected query → Verify user data returned correctly
4. Sign out → Verify protected queries return empty/null
5. Try accessing another user's data → Verify authorization fails

**Common Issues:**

- **"Not authenticated" errors**: Check that JWT template name is "convex" (lowercase)
- **Token validation fails**: Verify `CLERK_JWT_ISSUER_DOMAIN` matches Clerk dashboard
- **User identity is null**: Ensure ClerkProvider wraps your app in +layout.svelte
- **Outdated token**: Tokens expire after 1 hour; Clerk auto-refreshes them

### Troubleshooting Clerk + Convex Integration

**Problem: Convex functions can't access user identity**

Symptoms:

- `ctx.auth.getUserIdentity()` returns `null`
- Protected queries/mutations fail with "Not authenticated"

Solutions:

1. Check JWT template name is exactly `convex` (lowercase) in Clerk dashboard
2. Verify `CLERK_JWT_ISSUER_DOMAIN` environment variable in Convex dashboard
3. Make sure you're signed in (check with `<SignedIn>` component)
4. Check browser console for authentication errors
5. Try signing out and back in to refresh the token

**Problem: CORS errors when accessing Clerk**

Symptoms:

- Console shows "CORS policy blocked" errors
- Sign-in modal doesn't open

Solutions:

1. Add your development domain (`http://localhost:5173`) to Clerk's Allowed Origins
2. Go to Clerk dashboard → **Domains** → Add allowed origin
3. Make sure PUBLIC*CLERK_PUBLISHABLE_KEY starts with `pk_test*` for development

**Problem: User data not syncing between Clerk and Convex**

Symptoms:

- User exists in Clerk but not in Convex database
- User profile updates don't reflect in app

Solutions:

1. Clerk doesn't automatically create Convex records - you must do this manually
2. Create a webhook or mutation to sync user data:

```typescript
// convex/users.ts
export const syncUser = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { clerkUserId, email, name }) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkUserId', clerkUserId))
      .first();

    if (!existing) {
      await ctx.db.insert('users', {
        clerkUserId,
        email,
        name,
        createdAt: Date.now(),
      });
    }
  },
});
```

**Problem: Environment variables not loading**

Symptoms:

- `PUBLIC_CLERK_PUBLISHABLE_KEY is undefined` error
- App shows "ClerkProvider: Missing publishableKey" error

Solutions:

1. Make sure `.env.local` exists in project root
2. Restart your dev server after adding environment variables
3. Check that variable names start with `PUBLIC_` for client-side access
4. For SvelteKit, use `$env/static/public` to import:
   ```typescript
   import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
   ```

**Problem: Sign-out doesn't work properly**

Symptoms:

- User clicks sign-out but stays signed in
- Protected content still visible after sign-out

Solutions:

1. Use Clerk's `<UserButton />` component which handles sign-out correctly
2. If using custom sign-out button, use `signOut()` from svelte-clerk:
   ```svelte
   <script lang="ts">
     import { useClerk } from 'svelte-clerk';
     const clerk = useClerk();
   </script>
   <button onclick={() => clerk.signOut()}>Sign Out</button>
   ```

**Problem: "Invalid token" errors in production**

Symptoms:

- App works locally but fails in production
- Authentication errors after deploying

Solutions:

1. Make sure production environment uses production Clerk keys (`pk_live_`, `sk_live_`)
2. Add production domain to Clerk's Allowed Domains
3. Update `CLERK_JWT_ISSUER_DOMAIN` in production Convex deployment
4. Clear browser cache and cookies, then test again

---

## Phase 1: Template Migration

### 1.1 Directory Structure Changes

**Create new SvelteKit structure:**

```bash
template/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte       # Root layout
│   │   └── +page.svelte         # Home page
│   ├── lib/
│   │   ├── components/
│   │   │   ├── SignInForm.svelte
│   │   │   └── SignOutButton.svelte
│   │   └── index.ts
│   ├── app.html                 # HTML template
│   └── app.css                  # Global styles (from index.css)
├── convex/                      # Backend functions
│   ├── _generated/
│   └── schema.ts
├── static/                      # Static assets
│   └── og-preview.png
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

### 1.2 Package.json

**File: `template/package.json`**

```json
{
  "name": "flex-template",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "npm-run-all --parallel dev:frontend dev:backend",
    "dev:frontend": "vite dev",
    "dev:backend": "convex dev",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "tsc -p convex -noEmit --pretty false && tsc -p . -noEmit --pretty false && convex dev --once && vite build"
  },
  "dependencies": {
    "convex": "^1.24.2",
    "convex-svelte": "^0.1.0",
    "svelte-clerk": "^0.17.0",
    "@clerk/clerk-js": "^5.0.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.1.0",
    "sonner": "^2.0.3"
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "@types/node": "^22.13.10",
    "autoprefixer": "~10",
    "dotenv": "^16.4.7",
    "eslint": "^9.21.0",
    "npm-run-all": "^4.1.5",
    "postcss": "~8",
    "prettier": "^3.5.3",
    "prettier-plugin-svelte": "^3.2.0",
    "svelte": "^5.0.0",
    "svelte-check": "^4.0.0",
    "tailwindcss": "~3",
    "typescript": "~5.7.2",
    "vite": "^6.2.0"
  }
}
```

### 1.3 Vite Configuration

**File: `template/vite.config.ts`**

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [
    sveltekit(),
    // The code below enables dev tools like taking screenshots
    // while being developed on chef.convex.dev.
    mode === 'development'
      ? {
          name: 'inject-chef-dev',
          transform(code: string, id: string) {
            if (id.includes('+page.svelte') || id.includes('+layout.svelte')) {
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
```

### 1.4 SvelteKit Configuration

**File: `template/svelte.config.js`**

```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      $convex: './convex',
    },
  },
};

export default config;
```

### 1.5 Root Layout

**File: `template/src/routes/+layout.svelte`**

```svelte
<script lang="ts">
  import { browser } from '$app/environment';
  import { PUBLIC_CONVEX_URL, PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
  import { setupConvex } from 'convex-svelte';
  import { ClerkProvider } from 'svelte-clerk';
  import '../app.css';

  const { children } = $props();

  // Setup Convex
  if (browser) {
    setupConvex(PUBLIC_CONVEX_URL);
  }
</script>

<ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}>
  {@render children()}
</ClerkProvider>
```

### 1.6 Main Page Component

**File: `template/src/routes/+page.svelte`**

```svelte
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
```

### 1.7 SignInForm Component

**File: `template/src/lib/components/SignInForm.svelte`**

```svelte
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
```

**Note**: Clerk provides pre-built, customizable sign-in components. For a fully custom UI, you can use the `useSignIn()` and `useSignUp()` hooks from svelte-clerk.

### 1.8 SignOutButton Component

**File: `template/src/lib/components/SignOutButton.svelte`**

```svelte
<script lang="ts">
  import { UserButton } from 'svelte-clerk';
</script>

<UserButton afterSignOutUrl="/" />
```

**Note**: The `UserButton` component from Clerk provides a pre-built user menu with sign-out functionality. It automatically shows the user's avatar and profile options.

### 1.9 HTML Template

**File: `template/src/app.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

### 1.10 Global Styles

**File: `template/src/app.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: #ef4444;
    --color-primary-hover: #dc2626;
    --color-secondary: #6b7280;
  }
}

@layer components {
  .auth-input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary;
  }

  .auth-button {
    @apply w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .text-primary {
    @apply text-[var(--color-primary)];
  }

  .text-secondary {
    @apply text-[var(--color-secondary)];
  }

  .gap-section {
    @apply gap-8;
  }

  .gap-form-field {
    @apply gap-4;
  }
}
```

### 1.11 Environment Variables

**File: `template/.env.example`**

```bash
# Convex deployment URL - set by `npx convex dev`
PUBLIC_CONVEX_URL=

# Clerk publishable key - get from Clerk dashboard
PUBLIC_CLERK_PUBLISHABLE_KEY=

# Clerk secret key (for backend) - get from Clerk dashboard
CLERK_SECRET_KEY=
```

### 1.12 Clerk Dashboard Setup Guide

Users will need to complete these steps before their app works:

**Step 1: Create Clerk Account**

1. Go to [clerk.com](https://clerk.com)
2. Sign up for a free account
3. Verify your email address

**Step 2: Create Application**

1. Click "Add Application"
2. Enter application name (e.g., "My Chef App")
3. Choose authentication methods:
   - ✅ Email (recommended, always enabled)
   - ✅ Google (optional, popular)
   - ✅ GitHub (optional, popular for dev tools)
   - Other OAuth providers as needed
4. Click "Create Application"

**Step 3: Get API Keys**

1. In the Clerk dashboard, go to **API Keys**
2. Copy the **Publishable Key** (starts with `pk_`)
3. Copy the **Secret Key** (starts with `sk_`)
4. Add both to your `.env.local` file:
   ```bash
   PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

**Step 4: Configure JWT Template for Convex**

This is **required** for Clerk to work with Convex:

1. In Clerk dashboard, go to **JWT Templates**
2. Click **New Template** → **Convex**
3. Name it **`convex`** (lowercase, exactly this name!)
4. Click **Apply Changes**
5. Copy the **JWKS Endpoint URL** (you'll need this for Convex setup)

**Step 5: Configure Convex**

1. Run `npx convex dev` to get your Convex deployment URL
2. In your Convex dashboard, go to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Key**: `CLERK_JWT_ISSUER_DOMAIN`
   - **Value**: Your Clerk domain (e.g., `https://your-app.clerk.accounts.dev`)
   - Find this in Clerk's **JWT Templates** section

**Step 6: Test Authentication**

1. Start your dev server: `npm run dev`
2. Open your app in the browser
3. Click "Sign In"
4. Create a test account
5. Verify you see your name/email in the app

**Common Setup Issues:**

- **"Not authenticated" errors**: Make sure JWT template is named exactly `convex` (lowercase)
- **CORS errors**: Check that your domain is allowed in Clerk's settings
- **Token validation fails**: Verify `CLERK_JWT_ISSUER_DOMAIN` matches your Clerk dashboard
- **Environment variables not working**: Restart your dev server after adding `.env.local`

**Production Setup:**

For production deployments:

1. Create a production Clerk instance (or use the same one)
2. Use production API keys (start with `pk_live_` and `sk_live_`)
3. Add production domain to Clerk's **Allowed Domains** in settings
4. Set environment variables in your hosting platform

---

## Phase 2: System Prompt Rewrite

### 2.1 Solution Constraints Update

**File: `chef-agent/prompts/solutionConstraints.ts`**

**Changes needed in `templateInfo()` function (lines 179-242):**

Replace the entire section with:

```typescript
function templateInfo() {
  return stripIndents`
  <template_info>
    The Chef WebContainer environment starts with a full-stack app template fully loaded at '/home/project',
    the current working directory. Its dependencies are specified in the 'package.json' file and already
    installed in the 'node_modules' directory. You MUST use this template. This template uses the following
    technologies:
    - SvelteKit + Svelte 5 for the full-stack framework
    - TailwindCSS for styling
    - Convex for the database, functions, scheduling, HTTP handlers, and search
    - Clerk for authentication

    Here are some important files within the template:

    <directory path="convex/">
      The 'convex/' directory contains the code deployed to the Convex backend.
    </directory>

    <file path="convex/schema.ts">
      This file contains the schema for the Convex backend. You can add new tables here for your
      application's data. Use \`defineTable\` and \`defineSchema\` from "convex/server".
    </file>

    <file path="src/routes/+layout.svelte">
      This is the root layout component that wraps all pages. It sets up the Convex client and Clerk
      authentication provider. Do NOT modify this file under any circumstances.
    </file>

    <file path="src/routes/+page.svelte">
      This is the main page component for the app. It demonstrates Clerk authentication with SignedIn/SignedOut
      components. Add new Svelte components to their own files in the 'src/lib/components/' directory.
    </file>

    <file path="src/lib/components/SignInForm.svelte">
      This component renders the Clerk sign-in UI.
      IMPORTANT: Do NOT modify this file under any circumstances. It is locked.
    </file>

    <file path="src/lib/components/SignOutButton.svelte">
      This component renders the Clerk user button with sign-out functionality.
      IMPORTANT: Do NOT modify this file under any circumstances. It is locked.
    </file>

    <file path="src/app.html">
      This file is the HTML template for SvelteKit and includes the <head> and <body> tags.
    </file>

    <file path="svelte.config.js">
      This is the SvelteKit configuration file. Do NOT modify unless you need advanced configuration.
    </file>
  </template_info>
  `;
}
```

**Changes needed in main `solutionConstraints()` function:**

Replace client_guidelines section (lines 89-173) with:

```typescript
<client_guidelines>
  Here is an example of using Convex from a Svelte 5 app:
  \`\`\`svelte
  <script lang="ts">
    import { useQuery, useMutation } from "convex-svelte";
    import { api } from "$convex/_generated/api";

    const messagesQuery = useQuery(api.messages.list, {});
    const sendMessage = useMutation(api.messages.send);

    let newMessageText = $state("");
    let name = $state("User " + Math.floor(Math.random() * 10000));

    async function handleSendMessage(event: SubmitEvent) {
      event.preventDefault();
      await sendMessage({ body: newMessageText, author: name });
      newMessageText = "";
    }
  </script>

  <main>
    <h1>Convex Chat</h1>
    <p class="badge">
      <span>{name}</span>
    </p>

    {#if messagesQuery.isLoading}
      <p>Loading messages...</p>
    {:else if messagesQuery.error}
      <p>Error loading messages: {messagesQuery.error}</p>
    {:else}
      <ul>
        {#each messagesQuery.data as message (message._id)}
          <li>
            <span>{message.author}:</span>
            <span>{message.body}</span>
            <span>{new Date(message._creationTime).toLocaleTimeString()}</span>
          </li>
        {/each}
      </ul>
    {/if}

    <form onsubmit={handleSendMessage}>
      <input
        bind:value={newMessageText}
        placeholder="Write a message…"
      />
      <button type="submit" disabled={!newMessageText}>
        Send
      </button>
    </form>
  </main>
  \`\`\`

  The \`useQuery()\` function from convex-svelte returns a reactive query object with \`data\`, \`isLoading\`,
  and \`error\` properties. The component automatically re-renders when the query data changes, making Convex
  perfect for collaborative, live-updating websites.

  IMPORTANT Svelte 5 Patterns:

  1. STATE MANAGEMENT - Use Svelte 5 runes for reactivity:
     - \`$state()\` for reactive state
     - \`$derived()\` for computed values
     - \`$effect()\` for side effects
     - \`$props()\` for component props

  2. CONVEX QUERIES - Always check the query state:
     \`\`\`svelte
     {#if query.isLoading}
       <p>Loading...</p>
     {:else if query.error}
       <p>Error: {query.error}</p>
     {:else}
       <!-- Use query.data here -->
     {/if}
     \`\`\`

  3. CONDITIONAL LOGIC - Use Svelte's template directives:
     - Use \`{#if condition}\` for conditionals
     - Use \`{#each items as item (item.id)}\` for lists (always provide a key)
     - Use \`{#await promise}\` for async operations

  4. EVENT HANDLERS:
     - Use lowercase event names: \`onclick\`, \`onsubmit\`, \`oninput\`
     - Always use \`event.preventDefault()\` in form handlers

  5. TWO-WAY BINDING:
     - Use \`bind:value\` for form inputs
     - Example: \`<input bind:value={text} />\`

  6. COMPONENT PROPS:
     \`\`\`svelte
     <script lang="ts">
       interface Props {
         title: string;
         count?: number;
       }
       let { title, count = 0 }: Props = $props();
     </script>
     \`\`\`

  7. AUTHENTICATION WITH CLERK:
     Use Clerk components for authentication. Clerk is already set up in the template.

     \`\`\`svelte
     <script lang="ts">
       import { SignedIn, SignedOut, UserButton, SignInButton } from 'svelte-clerk';
     </script>

     <SignedIn let:user>
       <p>Welcome {user.firstName}!</p>
       <UserButton afterSignOutUrl="/" />
     </SignedIn>

     <SignedOut>
       <SignInButton mode="modal">
         <button>Sign In</button>
       </SignInButton>
     </SignedOut>
     \`\`\`

     Available Clerk components:
     - \`<SignedIn>\` - Shows content only when user is signed in
     - \`<SignedOut>\` - Shows content only when user is signed out
     - \`<UserButton />\` - Pre-built user menu with profile and sign-out
     - \`<SignInButton />\` - Sign-in button (supports modal or redirect)
     - \`<SignUpButton />\` - Sign-up button (supports modal or redirect)
     - \`<SignIn />\` - Full sign-in form component
     - \`<SignUp />\` - Full sign-up form component

     To access user data in Convex functions, use Clerk's JWT tokens.

  8. DO NOT use external UI libraries like Shadcn. Create custom components instead.

  9. DO NOT use \`sharp\` for image compression. Always use \`canvas\` for image compression.

  10. Always make sure the functions you are calling are defined in the \`convex/\` directory
      and use the \`api\` or \`internal\` object to call them.

  11. Always make sure you are using the correct arguments for convex functions. If arguments
      are not optional, make sure they are not null.

  12. NEVER import from 'svelte/store' - use Svelte 5 runes instead ($state, $derived, etc).
</client_guidelines>
```

### 2.2 Output Instructions Update

**File: `chef-agent/prompts/outputInstructions.ts`**

Update the communication example (lines 17-40):

```typescript
Example responses:

  User: "Create a collaborative todo list app"
  Assistant: "Sure. I'll start by:
  1. Update the SvelteKit template to render the TODO app with dummy data.
  2. Create a 'todos' table in the Convex schema.
  3. Implement queries and mutations to add, edit, list, and delete todos.
  4. Update the Svelte app to use the Convex functions.

  Let's start now.

  [Write files to the filesystem using artifacts]
  [Deploy the app and get type errors]
  [Fix the type errors]
  [Deploy the app again and get more type errors]
  [Fix the type errors]
  [Deploy the app successfully]

  Now you can use the collaborative to-do list app by adding and completing tasks.

  ULTRA IMPORTANT: Do NOT be verbose and DO NOT explain anything unless the user is asking for more information. That is VERY important.
```

Update artifact examples in `artifactInstructions()` to use Svelte:

```typescript
<example>
  <user_query>Build a multiplayer snake game</user_query>
  <assistant_response>
    Certainly! I'd be happy to help you build a snake game using Convex and HTML5 Canvas. This will be a basic implementation
    that you can later expand upon. Let's create the game step by step.
    <boltArtifact id="snake-game" title="Snake Game in Svelte and JavaScript">
      <boltAction type="file" filePath="convex/schema.ts">...</boltAction>
      <boltAction type="file" filePath="convex/game.ts">...</boltAction>
      <boltAction type="file" filePath="src/routes/+page.svelte">...</boltAction>
      ...
    </boltArtifact>
    Now you can play the Snake game by opening the provided local server URL in your browser. Use the arrow keys to control the
    snake. Eat the red food to grow and increase your score. The game ends if you hit the wall or your own tail.
  </assistant_response>
</example>
```

---

## Phase 3: Build Configuration

### 3.1 Update NPM Install Tool

**File: `chef-agent/tools/npmInstall.ts`**

No changes needed - tool is framework-agnostic.

### 3.2 Update Deploy Tool

**File: `chef-agent/tools/deploy.ts`**

Update description to reference SvelteKit:

```typescript
export const deployToolDescription = `
Deploy the app to Convex and start the Vite development server (if not already running).

Execute this tool call after you've used an artifact to write files to the filesystem
and the app is complete. Do NOT execute this tool if the app isn't in a working state.

After initially writing the app, you MUST execute this tool after making any changes
to the filesystem.

If this tool call fails with esbuild bundler errors, a library that requires Node.js
APIs may be being used. Isolating those dependencies into a convex file of only actions
with "use node" at the top is the only way to fix this. The files with "use node" at the
top can only contain actions. They can NEVER contains queries or mutations.
`;
```

### 3.3 Environment Variables

**File: `template/.env.example`**

```bash
# Convex deployment URL - will be set by `npx convex dev`
PUBLIC_CONVEX_URL=

# For production builds
CONVEX_DEPLOYMENT=
```

### 3.4 TypeScript Configuration

**File: `template/tsconfig.json`**

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler",
    "paths": {
      "$lib": ["./src/lib"],
      "$lib/*": ["./src/lib/*"],
      "$convex": ["./convex"],
      "$convex/*": ["./convex/*"]
    }
  }
}
```

---

## Phase 4: Snapshot Generation

### 4.1 Update Bootstrap Snapshot Script

**File: `make-bootstrap-snapshot.js`**

This script generates WebContainer snapshots of the template. Update it to:

1. Point to the new Svelte template structure
2. Include all new SvelteKit files
3. Generate snapshots with proper file paths

Key changes:

- Update file paths to match SvelteKit structure
- Include `svelte.config.js`
- Include `src/routes/` directory
- Include `src/lib/` directory
- Include `src/app.html`

### 4.2 Regenerate All Snapshots

After updating the template, regenerate snapshots:

```bash
npm run rebuild-template
```

This will create new snapshot files in `public/template-snapshot-*.bin`

---

## Phase 5: Testing & Validation

### 5.1 Manual Testing Checklist

**Basic Functionality:**

- [ ] Template loads without errors
- [ ] Vite dev server starts successfully
- [ ] Convex deployment connects

**Clerk Authentication:**

- [ ] Clerk environment variables are set correctly
- [ ] Sign-up flow works (email, OAuth providers)
- [ ] Sign-in flow works with existing account
- [ ] User profile data displays correctly
- [ ] Sign-out clears session properly
- [ ] Protected routes/components work correctly
- [ ] JWT tokens are sent with Convex requests
- [ ] `ctx.auth.getUserIdentity()` returns correct user data
- [ ] Unauthorized access is properly blocked
- [ ] Session persists after page reload
- [ ] Multi-tab session sync works (sign out in one tab affects others)

**Convex Integration:**

- [ ] Queries execute and return data
- [ ] Mutations work correctly
- [ ] Real-time updates function properly
- [ ] Type safety works with generated API
- [ ] File uploads work (if applicable)

**UI/UX:**

- [ ] TailwindCSS styles apply correctly
- [ ] Responsive design works
- [ ] Forms submit properly
- [ ] Loading states display
- [ ] Error states display

**Code Generation:**

- [ ] Chef generates valid Svelte 5 syntax
- [ ] Generated components use runes correctly
- [ ] Event handlers work
- [ ] Conditional rendering works
- [ ] List rendering with keys works

### 5.2 Test Prompts

Use these prompts to validate the migration:

1. **Basic CRUD App:**

   ```
   Create a todo list app where users can add, complete, and delete tasks
   ```

2. **Real-time Chat:**

   ```
   Build a chat application with real-time messages
   ```

3. **Authentication Flow:**

   ```
   Add a profile page that shows the current user's name, email, and profile picture
   ```

3b. **Protected Data:**

```
Create a notes app where each user can only see their own notes
```

4. **Complex State:**

   ```
   Create a shopping cart with items, quantities, and total price
   ```

5. **Form Handling:**
   ```
   Build a contact form that saves submissions to the database
   ```

### 5.3 Validation Criteria

**Generated code should:**

- Use Svelte 5 runes ($state, $derived, $effect, $props)
- Use convex-svelte for queries/mutations
- Follow SvelteKit routing conventions
- Include proper TypeScript types
- Handle loading/error states
- Use proper event handler names (onclick, onsubmit, etc.)
- Include keys in {#each} blocks
- Use bind:value for form inputs

**Generated code should NOT:**

- Use React hooks (useState, useEffect, etc.)
- Import from 'svelte/store'
- Use export let (Svelte 4 pattern)
- Use $: reactive statements (Svelte 4 pattern)
- Use .tsx or .jsx extensions
- Include React-specific patterns

---

## Implementation Checklist

### Week 1-2: Template Migration

- [ ] Create new SvelteKit directory structure
- [ ] Update package.json dependencies
- [ ] Create vite.config.ts for SvelteKit
- [ ] Create svelte.config.js
- [ ] Implement +layout.svelte with Convex and Clerk setup
- [ ] Implement +page.svelte main component
- [ ] Implement SignInForm with Clerk `<SignIn />` component
- [ ] Implement SignOutButton with Clerk `<UserButton />` component
- [ ] Create Clerk account and application
- [ ] Configure authentication methods in Clerk (email, OAuth)
- [ ] Create JWT template named "convex" in Clerk dashboard
- [ ] Get Clerk API keys (publishable and secret)
- [ ] Set up environment variables (.env.local)
- [ ] Configure CLERK_JWT_ISSUER_DOMAIN in Convex dashboard
- [ ] Test sign-up, sign-in, and sign-out flows
- [ ] Verify Convex functions can access user identity
- [ ] Create app.html template
- [ ] Migrate global styles to app.css
- [ ] Update TailwindCSS configuration
- [ ] Test template locally
- [ ] Verify Convex integration works

### Week 3-4: System Prompt Rewrite

- [ ] Update templateInfo() in solutionConstraints.ts
- [ ] Rewrite client_guidelines with Svelte 5 patterns
- [ ] Update auth guidelines to use Clerk instead of Convex Auth
- [ ] Add Clerk component examples and patterns
- [ ] Update convex_guidelines examples
- [ ] Rewrite outputInstructions examples
- [ ] Update artifact examples to Svelte
- [ ] Update tool descriptions
- [ ] Add Svelte 5 runes documentation
- [ ] Add convex-svelte usage patterns
- [ ] Add SvelteKit-specific guidelines

### Week 5: Build & Tooling

- [ ] Update vite.config.ts for screenshot injection
- [ ] Configure TypeScript for SvelteKit
- [ ] Update environment variable handling
- [ ] Test deploy tool with new template
- [ ] Verify npm install works
- [ ] Test WebContainer integration
- [ ] Update any build scripts

### Week 6: Snapshot & Integration

- [ ] Update make-bootstrap-snapshot.js
- [ ] Generate new template snapshots
- [ ] Verify snapshots load correctly
- [ ] Test in WebContainer environment
- [ ] Validate file structure
- [ ] Check all locked files work

### Week 7-8: Testing & Refinement

- [ ] Run manual test suite
- [ ] Test all example prompts
- [ ] Fix any generated code issues
- [ ] Refine system prompts based on results
- [ ] Test edge cases
- [ ] Verify authentication flows
- [ ] Test real-time features
- [ ] Validate TypeScript types
- [ ] Test error handling
- [ ] Performance testing

---

## Risk Mitigation

### Risk 1: Clerk + Convex Integration

**Risk**: Integrating Clerk authentication with Convex may require additional setup

**Mitigation**:

- Use Clerk's JWT tokens for Convex authentication
- Follow Clerk + Convex integration guide
- Test authentication flows thoroughly
- Document the integration pattern in system prompts
- Provide clear examples of protected Convex queries/mutations

### Risk 2: AI Generated Code Quality

**Risk**: LLM may generate Svelte 4 patterns instead of Svelte 5 runes

**Mitigation**:

- Make system prompts very explicit about Svelte 5
- Include many examples of correct rune usage
- Add negative examples of what NOT to do
- Test with various complexity levels
- Iterate on prompts based on results

### Risk 3: WebContainer Compatibility

**Risk**: SvelteKit may have different WebContainer requirements

**Mitigation**:

- Test early in WebContainer environment
- Verify Vite dev server works
- Check build process compatibility
- Test hot module replacement
- Validate file watching works

### Risk 4: Template Snapshot Issues

**Risk**: Snapshot generation may fail with new structure

**Mitigation**:

- Update snapshot script incrementally
- Test snapshots load correctly
- Verify all files included
- Check file permissions
- Test snapshot restoration

### Risk 5: Breaking Changes in Dependencies

**Risk**: Svelte 5 or convex-svelte updates may break things

**Mitigation**:

- Pin exact versions in package.json
- Test thoroughly before updating
- Document known working versions
- Have rollback plan

---

## Success Metrics

### Quantitative Metrics

1. **Code Generation Accuracy**: >90% of generated Svelte code should compile without errors
2. **Pattern Compliance**: >95% of generated code should use Svelte 5 runes (not legacy patterns)
3. **Deployment Success Rate**: >95% of deploys should succeed on first try
4. **Real-time Features**: 100% of Convex queries should update reactively

### Qualitative Metrics

1. **Code Quality**: Generated code should follow Svelte best practices
2. **User Experience**: Apps should feel responsive and modern
3. **Developer Experience**: Code should be readable and maintainable
4. **Type Safety**: TypeScript integration should work seamlessly

---

## Rollback Plan

If the migration encounters critical issues:

1. **Immediate Rollback**: Keep React template as `template-react/` backup
2. **Feature Flag**: Add environment variable to toggle between React/Svelte
3. **Gradual Migration**: Offer both templates, deprecate React over time
4. **Documentation**: Clearly communicate any breaking changes

---

## Post-Migration Tasks

### Documentation Updates

- [ ] Update README.md with Svelte information
- [ ] Update CONTRIBUTING.md with Svelte guidelines
- [ ] Create Svelte-specific troubleshooting guide
- [ ] Update Chef documentation website
- [ ] Create migration guide for existing users

---

## Appendix A: Complete Example App

### Todo List Application (Full Svelte 5 Example)

**convex/schema.ts:**

```typescript
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    userId: v.string(), // Clerk user ID
  }).index('by_user', ['userId']),
});
```

**convex/todos.ts:**

```typescript
import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Helper to get user ID from Clerk auth
async function getUserId(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Not authenticated');
  }
  return identity.subject;
}

export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query('todos')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect();
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    const userId = await getUserId(ctx);

    return await ctx.db.insert('todos', {
      text,
      isCompleted: false,
      userId,
    });
  },
});

export const toggle = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx);

    const todo = await ctx.db.get(id);
    if (!todo || todo.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await ctx.db.patch(id, {
      isCompleted: !todo.isCompleted,
    });
  },
});

export const remove = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx);

    const todo = await ctx.db.get(id);
    if (!todo || todo.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await ctx.db.delete(id);
  },
});
```

**src/routes/+page.svelte:**

```svelte
<script lang="ts">
  import { useQuery, useMutation } from "convex-svelte";
  import { api } from "$convex/_generated/api";
  import type { Id } from "$convex/_generated/dataModel";

  const todosQuery = useQuery(api.todos.list, {});
  const addTodo = useMutation(api.todos.add);
  const toggleTodo = useMutation(api.todos.toggle);
  const removeTodo = useMutation(api.todos.remove);

  let newTodoText = $state("");

  async function handleAddTodo(e: SubmitEvent) {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    await addTodo({ text: newTodoText });
    newTodoText = "";
  }

  async function handleToggle(id: Id<"todos">) {
    await toggleTodo({ id });
  }

  async function handleRemove(id: Id<"todos">) {
    await removeTodo({ id });
  }
</script>

<div class="max-w-2xl mx-auto p-8">
  <h1 class="text-4xl font-bold mb-8">My Todos</h1>

  <form onsubmit={handleAddTodo} class="mb-8">
    <div class="flex gap-2">
      <input
        bind:value={newTodoText}
        placeholder="What needs to be done?"
        class="flex-1 px-4 py-2 border rounded"
      />
      <button
        type="submit"
        class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add
      </button>
    </div>
  </form>

  {#if todosQuery.isLoading}
    <p class="text-gray-500">Loading todos...</p>
  {:else if todosQuery.error}
    <p class="text-red-500">Error: {todosQuery.error}</p>
  {:else if todosQuery.data.length === 0}
    <p class="text-gray-500">No todos yet. Add one above!</p>
  {:else}
    <ul class="space-y-2">
      {#each todosQuery.data as todo (todo._id)}
        <li class="flex items-center gap-3 p-3 border rounded hover:bg-gray-50">
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onchange={() => handleToggle(todo._id)}
            class="w-5 h-5"
          />
          <span class:line-through={todo.isCompleted} class="flex-1">
            {todo.text}
          </span>
          <button
            onclick={() => handleRemove(todo._id)}
            class="px-3 py-1 text-red-500 hover:bg-red-50 rounded"
          >
            Delete
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
```

---

## Appendix B: Quick Reference

### Svelte 5 Runes Cheat Sheet

```svelte
<script lang="ts">
  // State
  let count = $state(0);
  let user = $state({ name: "Alice", age: 30 });

  // Derived
  let doubled = $derived(count * 2);
  let greeting = $derived(`Hello ${user.name}`);

  // Effects
  $effect(() => {
    console.log("Count changed:", count);

    return () => {
      // Cleanup
    };
  });

  // Props
  interface Props {
    title: string;
    count?: number;
  }
  let { title, count = 0 }: Props = $props();
</script>
```

### Convex-Svelte Cheat Sheet

```svelte
<script lang="ts">
  import { useQuery, useMutation } from "convex-svelte";
  import { api } from "$convex/_generated/api";

  // Query
  const dataQuery = useQuery(api.myModule.myQuery, { arg: "value" });
  // dataQuery.data, dataQuery.isLoading, dataQuery.error

  // Mutation
  const doSomething = useMutation(api.myModule.myMutation);
  await doSomething({ arg: "value" });
</script>
```

### Event Handler Names

- `onclick` (not onClick)
- `onsubmit` (not onSubmit)
- `oninput` (not onChange)
- `onmouseenter` (not onMouseEnter)
- `onkeydown` (not onKeyDown)

### Clerk Components Cheat Sheet

```svelte
<script lang="ts">
  import {
    SignedIn,
    SignedOut,
    UserButton,
    SignInButton,
    SignUpButton,
    SignIn,
    SignUp
  } from 'svelte-clerk';
</script>

<!-- Conditional rendering based on auth state -->
<SignedIn let:user>
  <p>Welcome {user.firstName}!</p>
  <UserButton afterSignOutUrl="/" />
</SignedIn>

<SignedOut>
  <SignInButton mode="modal">
    <button>Sign In</button>
  </SignInButton>
</SignedOut>

<!-- Full sign-in form -->
<SignIn routing="path" path="/sign-in" />

<!-- Sign-up button -->
<SignUpButton mode="redirect" redirectUrl="/dashboard">
  <button>Get Started</button>
</SignUpButton>
```

### Clerk + Convex Auth Patterns

**Frontend (Svelte):**

```svelte
<script lang="ts">
  import { SignedIn, SignedOut } from 'svelte-clerk';
  import { useQuery } from 'convex-svelte';
  import { api } from '$convex/_generated/api';

  // This query is protected - requires authentication
  const userDataQuery = useQuery(api.users.getCurrentUser, {});
</script>

<SignedIn>
  {#if userDataQuery.isLoading}
    <p>Loading...</p>
  {:else if userDataQuery.data}
    <p>Hello {userDataQuery.data.name}!</p>
  {/if}
</SignedIn>

<SignedOut>
  <p>Please sign in</p>
</SignedOut>
```

**Backend (Convex):**

```typescript
// convex/users.ts
import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Helper function
async function getUserId(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');
  return identity.subject;
}

// Protected query
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return {
      id: identity.subject,
      name: identity.name,
      email: identity.email,
    };
  },
});

// Protected mutation
export const updateProfile = mutation({
  args: { bio: v.string() },
  handler: async (ctx, { bio }) => {
    const userId = await getUserId(ctx);

    await ctx.db.patch(userId, { bio });
  },
});

// Public query (no auth required)
export const getPublicPosts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('posts')
      .filter((q) => q.eq(q.field('isPublic'), true))
      .collect();
  },
});
```

---

## Conclusion

This migration plan provides a comprehensive roadmap for converting Chef from generating React applications to Svelte 5 applications. The plan maintains full compatibility with Convex, preserves the existing Chef UI, and leverages the modern Svelte 5 runes system for superior developer experience.

**Next Steps:**

1. Review and approve this plan
2. Set up a development branch for migration work
3. Begin Phase 1: Template Migration
4. Iterate based on testing results

**Estimated Timeline:** 5-8 weeks for complete implementation and testing.

**Success Criteria:** Chef should generate clean, modern Svelte 5 applications that compile without errors, use runes correctly, integrate seamlessly with Convex, and provide an excellent developer experience.
