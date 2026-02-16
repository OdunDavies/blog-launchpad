

## Domain Migration Banner

**Goal:** Show a banner to users visiting from the old `.netlify.app` domain, prompting them to switch to `www.muscleatlas.site`.

### How it works

When the app loads, it checks `window.location.hostname`. If it contains `.netlify.app`, a dismissible banner appears at the top of the page with a link to the new domain.

### Implementation

1. **Create `src/components/DomainMigrationBanner.tsx`**
   - A component that checks if `window.location.hostname` includes `netlify.app`
   - If yes, renders a sticky banner at the top with a message like: "We've moved! Visit us at www.muscleatlas.site for the best experience."
   - Includes a "Go to new site" button that navigates to `https://www.muscleatlas.site` (preserving the current path/hash)
   - Includes a dismiss (X) button that hides the banner for the session (using `sessionStorage` so it doesn't nag on every page)
   - Styled with a distinct background (e.g., primary/red) so it stands out

2. **Update `src/App.tsx`**
   - Import and render `<DomainMigrationBanner />` at the top level, above the router, so it appears on every page

### Technical details

- Detection: `window.location.hostname.includes('netlify.app')`
- Redirect URL construction: `https://www.muscleatlas.site${window.location.pathname}${window.location.hash}`
- Dismissal persisted via `sessionStorage.setItem('domain-banner-dismissed', 'true')`
- No external dependencies needed

