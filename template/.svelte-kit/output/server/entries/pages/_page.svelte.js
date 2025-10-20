import "clsx";
import { i as invalid_default_snippet } from "../../chunks/context.js";
import { C as ClerkLoaded, u as useClerkContext, U as UserButton } from "../../chunks/index2.js";
import "@clerk/shared/authorization";
import "@clerk/shared/deriveState";
import "@clerk/shared/loadClerkJsScript";
import "@clerk/shared/underscore";
import "../../chunks/client.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import { Toaster } from "sonner";
function SignIn($$renderer, $$props) {
  const { $$slots, $$events, ...props } = $$props;
  {
    let children = function($$renderer2, clerk) {
      $$renderer2.push(`<div></div>`);
    };
    ClerkLoaded($$renderer, { children });
  }
}
function SignedIn($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { children } = $$props;
    const ctx = useClerkContext();
    if (ctx.auth.userId) {
      $$renderer2.push("<!--[-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function SignedOut($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { children } = $$props;
    const ctx = useClerkContext();
    if (ctx.auth.userId === null) {
      $$renderer2.push("<!--[-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function SignInForm($$renderer) {
  $$renderer.push(`<div class="w-full flex justify-center">`);
  SignIn($$renderer, {
    appearance: { elements: { rootBox: "w-full", card: "shadow-none" } }
  });
  $$renderer.push(`<!----></div>`);
}
function _page($$renderer) {
  $$renderer.push(`<div class="min-h-screen flex flex-col bg-gray-50"><header class="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4"><h2 class="text-xl font-semibold text-primary">Chef</h2> `);
  SignedIn($$renderer, {
    children: ($$renderer2) => {
      UserButton($$renderer2, { afterSignOutUrl: "/" });
    }
  });
  $$renderer.push(`<!----></header> <main class="flex-1 flex items-center justify-center p-8"><div class="w-full max-w-md mx-auto"><div class="flex flex-col gap-section"><div class="text-center"><h1 class="text-5xl font-bold text-primary mb-4">Cook with Chef</h1> `);
  SignedIn($$renderer, {
    children: invalid_default_snippet
  });
  $$renderer.push(`<!----> `);
  SignedOut($$renderer, {
    children: ($$renderer2) => {
      $$renderer2.push(`<p class="text-xl text-secondary">Sign in to get started</p>`);
    }
  });
  $$renderer.push(`<!----></div> `);
  SignedOut($$renderer, {
    children: ($$renderer2) => {
      SignInForm($$renderer2);
    }
  });
  $$renderer.push(`<!----></div></div></main> `);
  Toaster($$renderer, {});
  $$renderer.push(`<!----></div>`);
}
export {
  _page as default
};
