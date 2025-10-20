import "clsx";
import { s as setClerkContext } from "../../chunks/index2.js";
import "@clerk/shared/authorization";
import { deriveState } from "@clerk/shared/deriveState";
import { setClerkJsLoadingErrorPackageName } from "@clerk/shared/loadClerkJsScript";
import { p as public_env, z as spread_props } from "../../chunks/index.js";
import { isTruthy } from "@clerk/shared/underscore";
import { p as page } from "../../chunks/index3.js";
import { g as goto } from "../../chunks/client.js";
const PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_example";
function ClerkProvider($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { children, initialState, $$slots, $$events, ...props } = $$props;
    let clerk = null;
    let isLoaded = false;
    let resources = {
      client: void 0,
      session: void 0,
      user: void 0,
      organization: void 0
    };
    const auth = deriveState(isLoaded, resources, initialState);
    const client = resources.client;
    const session = auth.session;
    const user = auth.user;
    const organization = auth.organization;
    setClerkJsLoadingErrorPackageName("svelte-clerk");
    setClerkContext({
      get clerk() {
        return clerk;
      },
      get isLoaded() {
        return isLoaded;
      },
      get auth() {
        return auth;
      },
      get client() {
        return client;
      },
      get session() {
        return session;
      },
      get user() {
        return user;
      },
      get organization() {
        return organization;
      }
    });
    children($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
function getEnvVariable(name, defaultValue) {
  return name in public_env ? public_env[name] : defaultValue;
}
function getDynamicPublicEnvVariables() {
  return {
    publishableKey: getEnvVariable("PUBLIC_CLERK_PUBLISHABLE_KEY"),
    domain: getEnvVariable("PUBLIC_CLERK_DOMAIN"),
    isSatellite: getEnvVariable("PUBLIC_CLERK_IS_SATELLITE"),
    proxyUrl: getEnvVariable("PUBLIC_CLERK_PROXY_URL"),
    signInUrl: getEnvVariable("PUBLIC_CLERK_SIGN_IN_URL"),
    signUpUrl: getEnvVariable("PUBLIC_CLERK_SIGN_UP_URL"),
    clerkJSUrl: getEnvVariable("PUBLIC_CLERK_JS_URL"),
    clerkJSVersion: getEnvVariable("PUBLIC_CLERK_JS_VERSION"),
    signInForceRedirectUrl: getEnvVariable("PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL"),
    signUpForceRedirectUrl: getEnvVariable("PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL"),
    signInFallbackRedirectUrl: getEnvVariable("PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL"),
    signUpFallbackRedirectUrl: getEnvVariable("PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL"),
    telemetryDisabled: isTruthy(getEnvVariable("PUBLIC_CLERK_TELEMETRY_DISABLED")),
    telemetryDebug: isTruthy(getEnvVariable("PUBLIC_CLERK_TELEMETRY_DEBUG"))
  };
}
function mergeWithPublicEnvVariables(clerkInitOptions) {
  const { publishableKey, signInUrl, signUpUrl, signInForceRedirectUrl, signUpForceRedirectUrl, signInFallbackRedirectUrl, signUpFallbackRedirectUrl, clerkJSUrl, clerkJSVersion, proxyUrl, domain, telemetry } = clerkInitOptions;
  return {
    publishableKey: publishableKey || getDynamicPublicEnvVariables().publishableKey,
    signInUrl: signInUrl || getDynamicPublicEnvVariables().signInUrl,
    signUpUrl: signUpUrl || getDynamicPublicEnvVariables().signUpUrl,
    signInForceRedirectUrl: signInForceRedirectUrl || getDynamicPublicEnvVariables().signInForceRedirectUrl,
    signUpForceRedirectUrl: signUpForceRedirectUrl || getDynamicPublicEnvVariables().signUpForceRedirectUrl,
    signInFallbackRedirectUrl: signInFallbackRedirectUrl || getDynamicPublicEnvVariables().signInFallbackRedirectUrl,
    signUpFallbackRedirectUrl: signUpFallbackRedirectUrl || getDynamicPublicEnvVariables().signUpFallbackRedirectUrl,
    clerkJSUrl: clerkJSUrl || getDynamicPublicEnvVariables().clerkJSUrl,
    clerkJSVersion: clerkJSVersion || getDynamicPublicEnvVariables().clerkJSVersion,
    proxyUrl: proxyUrl || getDynamicPublicEnvVariables().proxyUrl,
    domain: domain || getDynamicPublicEnvVariables().domain,
    telemetry: telemetry || {
      debug: getDynamicPublicEnvVariables().telemetryDebug,
      disabled: getDynamicPublicEnvVariables().telemetryDisabled
    }
  };
}
function ClerkProvider_1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { children, $$slots, $$events, ...props } = $$props;
    const mergedProps = {
      ...props,
      ...mergeWithPublicEnvVariables(props),
      routerPush: (to) => goto(),
      routerReplace: (to) => goto(to, {})
    };
    ClerkProvider($$renderer2, spread_props([
      { initialState: page?.data?.initialState },
      mergedProps,
      {
        children: ($$renderer3) => {
          children($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { children } = $$props;
    ClerkProvider_1($$renderer2, {
      publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY,
      children: ($$renderer3) => {
        children($$renderer3);
        $$renderer3.push(`<!---->`);
      },
      $$slots: { default: true }
    });
  });
}
export {
  _layout as default
};
