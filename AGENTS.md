<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Trip payments: amounts computed server-side from src/home/trips.ts reservePerPerson; bookings are marked paid only by confirmBooking (re-reads the Razorpay order) — never trust the browser or webhook body.
- Trip notifications share one root-mounted component and sessionStorage state; public booking signals come only from the bounded anonymous RPC, keeping customer data private.
- Trip-specific early-bird prices resolve in getTrip using India-local dates and an exclusive cutoff, so displayed options and server-side booking validation share the same price.
- Unpriced trips use null departure prices and empty price options; canBookOnline gates payment controls until a positive advance and verified options exist. Explore Group Trips lists all upcoming departures; the homepage keeps its four-trip preview.
- Generate itinerary terms through one shared formatter, with trip-specific payment amounts, meals and camping accommodation, so policies remain consistent without misrepresenting package inclusions.
