// The visitor's theme choice. Light is the default and the system preference
// decides until the visitor picks a side with the toggle; the pick is stored
// per browser and applied before first paint by THEME_INIT_SCRIPT, so a
// returning dark-mode visitor never sees a light flash.
//
// The brand tokens (`@davideimola/brand/tokens.css`) key the dark palette off
// `data-theme="dark"` on <html>, or the system preference unless the page pins
// `data-theme="light"`. Absent attribute = follow the system.

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** The theme the page is showing right now, attribute first, then the system. */
export function resolveTheme(
  attribute: string | null | undefined,
  systemPrefersDark: boolean
): Theme {
  if (isTheme(attribute)) return attribute;
  return systemPrefersDark ? "dark" : "light";
}

// Inlined into <head>. Runs before the body is parsed; storage can throw in a
// private window or with site data blocked, and the page must render anyway.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;
