/**
 * Primary app content column: same horizontal track as `Header` (max-w-content, horizontal padding).
 * Use for the bottom `Navigation` inner container so the bar lines up with the app bar on every page.
 */
export const appShellContentClass = 'mx-auto w-full min-w-0 max-w-content px-4 sm:px-6 md:px-8';

/** Page root under `AppShellColumn`: fills the shell; flex column for header / body / nav (see CLAUDE.md). */
export const pageRootClassName = 'min-h-0 flex-1 flex flex-col';

/** Same as {@link pageRootClassName} but clips at the shell so scroll stays in the middle band. */
export const pageRootClipClassName = `${pageRootClassName} overflow-hidden`;
