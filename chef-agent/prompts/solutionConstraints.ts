import { stripIndents } from '../utils/stripIndent.js';
import type { SystemPromptOptions } from '../types.js';
import { convexGuidelines } from './convexGuidelines.js';

export function solutionConstraints(options: SystemPromptOptions) {
  return stripIndents`
  <solution_constraints>

    ${options.includeTemplate ? templateInfo() : ''}

    <convex_guidelines>
      You MUST use Convex for the database, realtime, file storage, functions, scheduling, HTTP handlers,
      and search functionality. Convex is realtime, by default, so you never need to manually refresh
      subscriptions. Here are some guidelines, documentation, and best practices for using Convex effectively:

      ${convexGuidelines(options)}

      <http_guidelines>
        - All user-defined HTTP endpoints should be defined in \`convex/http.ts\` using \`httpRouter\` and \`httpAction\`.
        - Example: Create an HTTP endpoint by defining an httpAction in convex/http.ts
      </http_guidelines>

      <auth_server_guidelines>
        Here are some guidelines for using Clerk authentication with Convex:

        When writing Convex handlers, use \`ctx.auth.getUserIdentity()\` to get the logged in user's identity from Clerk.
        The identity object contains user information from Clerk's JWT token. For example:
        \`\`\`ts "convex/users.ts"
        import { query } from "./_generated/server";

        export const currentLoggedInUser = query({
          handler: async (ctx) => {
            const identity = await ctx.auth.getUserIdentity();
            if (!identity) {
              return null;
            }
            // identity.subject is the Clerk user ID
            // identity.email is the user's email
            // identity.name is the user's name
            console.log("User", identity.name, identity.email, identity.subject);
            return {
              id: identity.subject,
              name: identity.name,
              email: identity.email,
            };
          }
        })
        \`\`\`

        The \`identity\` object from Clerk contains:
        \`\`\`ts
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
        \`\`\`

        When storing user data in your database, use \`identity.subject\` as the user ID:
        \`\`\`ts
        await ctx.db.insert('posts', {
          title,
          content,
          authorId: identity.subject, // Clerk user ID
          createdAt: Date.now(),
        });
        \`\`\`
      </auth_server_guidelines>

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

           To access user data in Convex functions, use Clerk's JWT tokens with \`ctx.auth.getUserIdentity()\`.

        8. DO NOT use external UI libraries like Shadcn. Create custom components instead.

        9. DO NOT use \`sharp\` for image compression. Always use \`canvas\` for image compression.

        10. Always make sure the functions you are calling are defined in the \`convex/\` directory
            and use the \`api\` or \`internal\` object to call them.

        11. Always make sure you are using the correct arguments for convex functions. If arguments
            are not optional, make sure they are not null.

        12. NEVER import from 'svelte/store' - use Svelte 5 runes instead ($state, $derived, etc).

        When writing a UI component and you want to use a Convex function, you MUST import the \`api\` object. For example:

        \`\`\`svelte
        import { api } from "$convex/_generated/api";
        \`\`\`

        You can use the \`api\` object to call any public Convex function.
      </client_guidelines>
    </convex_guidelines>
  </solution_constraints>
  `;
}

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
