import "clsx";
import { c as ssr_context, g as getContext, a as setContext } from "./context.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
const _contextKey = "$$_clerk";
const useClerkContext = () => {
  const client = getContext(_contextKey);
  if (!client) {
    throw new Error("No Clerk data was found in Svelte context. Did you forget to wrap your component with ClerkProvider?");
  }
  return client;
};
const setClerkContext = (context) => {
  setContext(_contextKey, context);
};
function ClerkLoaded($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { children } = $$props;
    const ctx = useClerkContext();
    if (ctx.isLoaded) {
      $$renderer2.push("<!--[-->");
      children($$renderer2, ctx.clerk);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function UserButton$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { children: customMenuItems, $$slots, $$events, ...props } = $$props;
    let updatedProps = props;
    useClerkContext();
    setContext("$$_userButton", {
      addCustomMenuItem(_, item) {
        updatedProps.customMenuItems = [...updatedProps.customMenuItems || [], item];
      },
      addCustomPage(page) {
        updatedProps.userProfileProps = {
          ...updatedProps.userProfileProps,
          customPages: [...updatedProps.userProfileProps?.customPages || [], page]
        };
      }
    });
    onDestroy(() => {
    });
    ClerkLoaded($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div></div>`);
      }
    });
    $$renderer2.push(`<!----> `);
    customMenuItems?.($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
function UserButtonAction($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { addCustomMenuItem } = getContext("$$_userButtonMenuItems");
    const { $$slots, $$events, ...props } = $$props;
  });
}
function UserButtonLink($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { addCustomMenuItem } = getContext("$$_userButtonMenuItems");
    const { label, href, labelIcon } = $$props;
  });
}
function UserButtonMenuItems($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const context = getContext("$$_userButton");
    const { children } = $$props;
    setContext("$$_userButtonMenuItems", context);
    children($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
function UserButtonUserProfilePage($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { addCustomPage } = getContext("$$_userButton");
    const { children, labelIcon, label, url } = $$props;
  });
}
const UserButton = Object.assign(UserButton$1, {
  MenuItems: UserButtonMenuItems,
  Action: UserButtonAction,
  Link: UserButtonLink,
  UserProfilePage: UserButtonUserProfilePage
});
export {
  ClerkLoaded as C,
  UserButton as U,
  setClerkContext as s,
  useClerkContext as u
};
