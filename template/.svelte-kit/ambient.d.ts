
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const SHELL: string;
	export const npm_command: string;
	export const SESSION_MANAGER: string;
	export const ZPLUG_ROOT: string;
	export const __ETC_PROFILE_DONE: string;
	export const npm_config_userconfig: string;
	export const COLORTERM: string;
	export const __HM_SESS_VARS_SOURCED: string;
	export const XDG_CONFIG_DIRS: string;
	export const npm_config_cache: string;
	export const XDG_SESSION_PATH: string;
	export const XDG_MENU_PREFIX: string;
	export const TERM_PROGRAM_VERSION: string;
	export const VITE_WORKOS_API_HOSTNAME: string;
	export const SPEECHD_CMD: string;
	export const _ZPLUG_VERSION: string;
	export const TMUX: string;
	export const ZSH_CACHE_DIR: string;
	export const ICEAUTHORITY: string;
	export const FPATH: string;
	export const NODE: string;
	export const ZPLUG_CACHE_DIR: string;
	export const LC_ADDRESS: string;
	export const _ZPLUG_PREZTO: string;
	export const LC_NAME: string;
	export const SSH_AUTH_SOCK: string;
	export const XCURSOR_PATH: string;
	export const MEMORY_PRESSURE_WRITE: string;
	export const COLOR: string;
	export const LOCALE_ARCHIVE_2_27: string;
	export const npm_config_local_prefix: string;
	export const _ZPLUG_AWKPATH: string;
	export const ZPLUG_THREADS: string;
	export const DESKTOP_SESSION: string;
	export const ZPLUG_FILTER: string;
	export const LC_MONETARY: string;
	export const GDK_PIXBUF_MODULE_FILE: string;
	export const KITTY_PID: string;
	export const GTK_RC_FILES: string;
	export const NO_AT_BRIDGE: string;
	export const npm_config_globalconfig: string;
	export const EDITOR: string;
	export const DISABLE_BEDROCK: string;
	export const XDG_SEAT: string;
	export const PWD: string;
	export const NIX_PROFILES: string;
	export const LOGNAME: string;
	export const XDG_SESSION_DESKTOP: string;
	export const XDG_SESSION_TYPE: string;
	export const _ZPLUG_URL: string;
	export const CUPS_DATADIR: string;
	export const NIX_PATH: string;
	export const npm_config_init_module: string;
	export const SYSTEMD_EXEC_PID: string;
	export const NIXPKGS_CONFIG: string;
	export const _: string;
	export const XAUTHORITY: string;
	export const _ZPLUG_OHMYZSH: string;
	export const KITTY_PUBLIC_KEY: string;
	export const PERIOD: string;
	export const ZSH_TMUX_CONFIG: string;
	export const XKB_DEFAULT_MODEL: string;
	export const GTK2_RC_FILES: string;
	export const NIXPKGS_QT6_QML_IMPORT_PATH: string;
	export const HOME: string;
	export const OPENCODE: string;
	export const SSH_ASKPASS: string;
	export const LANG: string;
	export const LC_PAPER: string;
	export const TMUX_TMPDIR: string;
	export const LS_COLORS: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const npm_package_version: string;
	export const _ZSH_TMUX_FIXED_CONFIG: string;
	export const MEMORY_PRESSURE_WATCH: string;
	export const STARSHIP_SHELL: string;
	export const WAYLAND_DISPLAY: string;
	export const GIO_EXTRA_MODULES: string;
	export const KITTY_WINDOW_ID: string;
	export const XDG_SEAT_PATH: string;
	export const INVOCATION_ID: string;
	export const DISABLE_USAGE_REPORTING: string;
	export const MANAGERPID: string;
	export const INIT_CWD: string;
	export const GTK_A11Y: string;
	export const STARSHIP_SESSION_KEY: string;
	export const KDE_SESSION_UID: string;
	export const NIX_USER_PROFILE_DIR: string;
	export const INFOPATH: string;
	export const npm_lifecycle_script: string;
	export const XKB_DEFAULT_LAYOUT: string;
	export const npm_config_npm_version: string;
	export const XDG_SESSION_CLASS: string;
	export const LC_IDENTIFICATION: string;
	export const TERM: string;
	export const TERMINFO: string;
	export const npm_package_name: string;
	export const VITE_WORKOS_REDIRECT_URI: string;
	export const ZSH: string;
	export const GTK_PATH: string;
	export const npm_config_prefix: string;
	export const LESSOPEN: string;
	export const USER: string;
	export const TMUX_PANE: string;
	export const ZPLUG_BIN: string;
	export const VITE_WORKOS_CLIENT_ID: string;
	export const ZPLUG_PROTOCOL: string;
	export const TZDIR: string;
	export const QT_WAYLAND_RECONNECT: string;
	export const KDE_SESSION_VERSION: string;
	export const PAM_KWALLET5_LOGIN: string;
	export const ZPLUG_USE_CACHE: string;
	export const DISPLAY: string;
	export const npm_lifecycle_event: string;
	export const SHLVL: string;
	export const ZPLUG_HOME: string;
	export const PAGER: string;
	export const __HM_ZSH_SESS_VARS_SOURCED: string;
	export const LC_TELEPHONE: string;
	export const QTWEBKIT_PLUGIN_PATH: string;
	export const LC_MEASUREMENT: string;
	export const __NIXOS_SET_ENVIRONMENT_DONE: string;
	export const XDG_VTNR: string;
	export const ZPLUG_REPOS: string;
	export const XDG_SESSION_ID: string;
	export const LOCALE_ARCHIVE: string;
	export const ATUIN_SESSION: string;
	export const LESSKEYIN_SYSTEM: string;
	export const npm_config_user_agent: string;
	export const ZPLUG_LOADFILE: string;
	export const QML2_IMPORT_PATH: string;
	export const TERMINFO_DIRS: string;
	export const npm_execpath: string;
	export const ATUIN_HISTORY_ID: string;
	export const LD_LIBRARY_PATH: string;
	export const XDG_RUNTIME_DIR: string;
	export const ZSH_TMUX_TERM: string;
	export const NIX_XDG_DESKTOP_PORTAL_DIR: string;
	export const npm_package_json: string;
	export const LC_TIME: string;
	export const _ZPLUG_CONFIG_SUBSHELL: string;
	export const QT_AUTO_SCREEN_SCALE_FACTOR: string;
	export const JOURNAL_STREAM: string;
	export const XDG_DATA_DIRS: string;
	export const KDE_FULL_SESSION: string;
	export const LIBEXEC_PATH: string;
	export const npm_config_noproxy: string;
	export const PATH: string;
	export const ZPLUG_ERROR_LOG: string;
	export const npm_config_node_gyp: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const npm_config_global_prefix: string;
	export const KDE_APPLICATIONS_AS_SCOPE: string;
	export const tmux_version: string;
	export const KPACKAGE_DEP_RESOLVERS_PATH: string;
	export const QT_PLUGIN_PATH: string;
	export const KITTY_INSTALLATION_DIR: string;
	export const XKB_DEFAULT_OPTIONS: string;
	export const npm_node_execpath: string;
	export const LC_NUMERIC: string;
	export const OLDPWD: string;
	export const TERM_PROGRAM: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_CONVEX_URL: string;
	export const PUBLIC_CLERK_PUBLISHABLE_KEY: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		SHELL: string;
		npm_command: string;
		SESSION_MANAGER: string;
		ZPLUG_ROOT: string;
		__ETC_PROFILE_DONE: string;
		npm_config_userconfig: string;
		COLORTERM: string;
		__HM_SESS_VARS_SOURCED: string;
		XDG_CONFIG_DIRS: string;
		npm_config_cache: string;
		XDG_SESSION_PATH: string;
		XDG_MENU_PREFIX: string;
		TERM_PROGRAM_VERSION: string;
		VITE_WORKOS_API_HOSTNAME: string;
		SPEECHD_CMD: string;
		_ZPLUG_VERSION: string;
		TMUX: string;
		ZSH_CACHE_DIR: string;
		ICEAUTHORITY: string;
		FPATH: string;
		NODE: string;
		ZPLUG_CACHE_DIR: string;
		LC_ADDRESS: string;
		_ZPLUG_PREZTO: string;
		LC_NAME: string;
		SSH_AUTH_SOCK: string;
		XCURSOR_PATH: string;
		MEMORY_PRESSURE_WRITE: string;
		COLOR: string;
		LOCALE_ARCHIVE_2_27: string;
		npm_config_local_prefix: string;
		_ZPLUG_AWKPATH: string;
		ZPLUG_THREADS: string;
		DESKTOP_SESSION: string;
		ZPLUG_FILTER: string;
		LC_MONETARY: string;
		GDK_PIXBUF_MODULE_FILE: string;
		KITTY_PID: string;
		GTK_RC_FILES: string;
		NO_AT_BRIDGE: string;
		npm_config_globalconfig: string;
		EDITOR: string;
		DISABLE_BEDROCK: string;
		XDG_SEAT: string;
		PWD: string;
		NIX_PROFILES: string;
		LOGNAME: string;
		XDG_SESSION_DESKTOP: string;
		XDG_SESSION_TYPE: string;
		_ZPLUG_URL: string;
		CUPS_DATADIR: string;
		NIX_PATH: string;
		npm_config_init_module: string;
		SYSTEMD_EXEC_PID: string;
		NIXPKGS_CONFIG: string;
		_: string;
		XAUTHORITY: string;
		_ZPLUG_OHMYZSH: string;
		KITTY_PUBLIC_KEY: string;
		PERIOD: string;
		ZSH_TMUX_CONFIG: string;
		XKB_DEFAULT_MODEL: string;
		GTK2_RC_FILES: string;
		NIXPKGS_QT6_QML_IMPORT_PATH: string;
		HOME: string;
		OPENCODE: string;
		SSH_ASKPASS: string;
		LANG: string;
		LC_PAPER: string;
		TMUX_TMPDIR: string;
		LS_COLORS: string;
		XDG_CURRENT_DESKTOP: string;
		npm_package_version: string;
		_ZSH_TMUX_FIXED_CONFIG: string;
		MEMORY_PRESSURE_WATCH: string;
		STARSHIP_SHELL: string;
		WAYLAND_DISPLAY: string;
		GIO_EXTRA_MODULES: string;
		KITTY_WINDOW_ID: string;
		XDG_SEAT_PATH: string;
		INVOCATION_ID: string;
		DISABLE_USAGE_REPORTING: string;
		MANAGERPID: string;
		INIT_CWD: string;
		GTK_A11Y: string;
		STARSHIP_SESSION_KEY: string;
		KDE_SESSION_UID: string;
		NIX_USER_PROFILE_DIR: string;
		INFOPATH: string;
		npm_lifecycle_script: string;
		XKB_DEFAULT_LAYOUT: string;
		npm_config_npm_version: string;
		XDG_SESSION_CLASS: string;
		LC_IDENTIFICATION: string;
		TERM: string;
		TERMINFO: string;
		npm_package_name: string;
		VITE_WORKOS_REDIRECT_URI: string;
		ZSH: string;
		GTK_PATH: string;
		npm_config_prefix: string;
		LESSOPEN: string;
		USER: string;
		TMUX_PANE: string;
		ZPLUG_BIN: string;
		VITE_WORKOS_CLIENT_ID: string;
		ZPLUG_PROTOCOL: string;
		TZDIR: string;
		QT_WAYLAND_RECONNECT: string;
		KDE_SESSION_VERSION: string;
		PAM_KWALLET5_LOGIN: string;
		ZPLUG_USE_CACHE: string;
		DISPLAY: string;
		npm_lifecycle_event: string;
		SHLVL: string;
		ZPLUG_HOME: string;
		PAGER: string;
		__HM_ZSH_SESS_VARS_SOURCED: string;
		LC_TELEPHONE: string;
		QTWEBKIT_PLUGIN_PATH: string;
		LC_MEASUREMENT: string;
		__NIXOS_SET_ENVIRONMENT_DONE: string;
		XDG_VTNR: string;
		ZPLUG_REPOS: string;
		XDG_SESSION_ID: string;
		LOCALE_ARCHIVE: string;
		ATUIN_SESSION: string;
		LESSKEYIN_SYSTEM: string;
		npm_config_user_agent: string;
		ZPLUG_LOADFILE: string;
		QML2_IMPORT_PATH: string;
		TERMINFO_DIRS: string;
		npm_execpath: string;
		ATUIN_HISTORY_ID: string;
		LD_LIBRARY_PATH: string;
		XDG_RUNTIME_DIR: string;
		ZSH_TMUX_TERM: string;
		NIX_XDG_DESKTOP_PORTAL_DIR: string;
		npm_package_json: string;
		LC_TIME: string;
		_ZPLUG_CONFIG_SUBSHELL: string;
		QT_AUTO_SCREEN_SCALE_FACTOR: string;
		JOURNAL_STREAM: string;
		XDG_DATA_DIRS: string;
		KDE_FULL_SESSION: string;
		LIBEXEC_PATH: string;
		npm_config_noproxy: string;
		PATH: string;
		ZPLUG_ERROR_LOG: string;
		npm_config_node_gyp: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		npm_config_global_prefix: string;
		KDE_APPLICATIONS_AS_SCOPE: string;
		tmux_version: string;
		KPACKAGE_DEP_RESOLVERS_PATH: string;
		QT_PLUGIN_PATH: string;
		KITTY_INSTALLATION_DIR: string;
		XKB_DEFAULT_OPTIONS: string;
		npm_node_execpath: string;
		LC_NUMERIC: string;
		OLDPWD: string;
		TERM_PROGRAM: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_CONVEX_URL: string;
		PUBLIC_CLERK_PUBLISHABLE_KEY: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
