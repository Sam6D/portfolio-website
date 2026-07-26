# Replace Spotify preview playback with iTunes Search API

## Why

The "Recently Listened" footer module (`src/components/ui/RecentlyListened.tsx`)
shows top albums from Last.fm, then looks up a 30-second preview clip via
Spotify so visitors can play a snippet on hover/tap. That preview lookup is
now permanently broken.

**Root cause:** Spotify changed its Developer Mode API policy to require the
app owner's Spotify account to have an active Premium subscription before
apps using the Client Credentials flow (server-to-server auth, no user
login - which is what this site uses) can call endpoints like Search.
Confirmed live against production:

```
GET https://www.samidesir.com/api/spotify/token   → 200 OK (auth itself still works)
GET https://api.spotify.com/v1/search?...         → 403 Forbidden
  "Active premium subscription required for the owner of the app.
   When the subscription status changes, it can take a few hours
   before requests are allowed again."
```

This account never had Premium, so the previous setup can't be restored
without paying for a subscription just to power a footer widget. Reported
by TechCrunch: https://techcrunch.com/2026/02/06/spotify-changes-developer-mode-api-to-require-premium-accounts-limits-test-users/

**Symptom this caused:** the hover play icon disappeared entirely (not just
"click does nothing"), because `RecentlyListened.tsx` only renders the
play button/icon when a Spotify match with a `previewUrl` exists
(see lines ~424, ~436, ~458). Since the search call now 403s before ever
returning a match, every album gets `null`, so the play affordance never
renders.

## The fix: iTunes Search API

Free, no API key, no OAuth, no subscription requirement. Verified live
against the site's actual current albums (Kid Cudi - "Free", Oliver Tree -
"Love You Madly Hate You Badly"):

- `https://itunes.apple.com/search?term={artist}+{album}&entity=album&limit=5`
  correctly matches the album and returns a `collectionId`.
- `https://itunes.apple.com/lookup?id={collectionId}&entity=song` returns
  the track list, each with a `previewUrl` field populated.
- The preview audio files are reachable (200 OK) and served with
  `access-control-allow-origin: *`, so `new Audio(previewUrl)` will play
  them fine cross-origin from the browser - no change needed to the
  playback code in `RecentlyListened.tsx` (`handlePlay`/`handlePlayMobile`).

This is a clean swap because `RecentlyListened.tsx` already sources album
artwork from Last.fm, not Spotify - Spotify's `coverUrl` field is currently
unused. Only `previewUrl` needs a new source.

## Implementation steps

1. **New route:** `src/app/api/itunes/search/route.ts`
   - `GET` with `albumName` and `artistName` query params (same contract as
     the current `/api/spotify/search`, so the client-side diff is small).
   - Call `https://itunes.apple.com/search?term=<artist> <album>&entity=album&limit=5`
     (no auth headers needed at all - delete the token-fetch step entirely).
   - Reuse the existing `normalizeString()` matching logic from
     `src/app/api/spotify/search/route.ts` to score/pick the best album
     match from the results (name + artist comparison).
   - Call `https://itunes.apple.com/lookup?id={collectionId}&entity=song`
     to get tracks, pick the first track with a non-null `previewUrl`.
   - Return the same shape shell as today's `SpotifyAlbumMatch` (rename to
     something provider-neutral, e.g. `AlbumPreviewMatch`) so
     `RecentlyListened.tsx` needs minimal changes:
     ```ts
     { albumId: string; albumTitle: string; artistName: string; previewUrl: string | null; coverUrl: string }
     ```
   - Add basic caching headers like the current route does
     (`Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`).

2. **Types:** replace `src/types/spotify.ts` with `src/types/itunes.ts`
   (or a neutral `src/types/albumPreview.ts`) modeling iTunes's actual
   response shape (`resultCount`, `results[]` with `collectionId`,
   `collectionName`, `artistName`, `previewUrl`, `trackName`, etc.) plus the
   shared `AlbumPreviewMatch` return type.

3. **Update the client:** `src/components/ui/RecentlyListened.tsx`
   - Change the fetch URL from `/api/spotify/search` to `/api/itunes/search`.
   - Swap the `SpotifyAlbumMatch` type import for the new one.
   - No other logic changes expected - `spotifyMatches` state, `handlePlay`,
     `handlePlayMobile`, and the play-button rendering all key off
     `previewUrl`, which keeps working the same way.
   - Consider renaming the `spotifyMatches`/`spotifyLoading` state variables
     for clarity (optional, purely cosmetic).

4. **Delete the dead Spotify integration:**
   - `src/app/api/spotify/token/route.ts`
   - `src/app/api/spotify/search/route.ts`
   - `src/types/spotify.ts` (after step 2 replaces it)
   - Remove `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` from Vercel
     project env vars (Settings → Environment Variables) once the new
     route is live and confirmed working - no rush, but no reason to keep
     dead credentials around.

5. **Test before shipping:**
   - Hit the new route directly for a few known albums (including ones
     with special characters / remixes / deluxe editions, since iTunes'
     matching may behave differently than Spotify's for edge cases).
   - Confirm play button appears on hover (desktop) and tap (mobile) for
     both footer albums.
   - Confirm actual playback works, including pause/switch-between-albums
     behavior (existing `audioRef` cleanup logic shouldn't need changes).
   - Check a case where an album genuinely isn't on iTunes/Apple Music -
     confirm graceful degradation (no play button, no crash), same as
     today's Spotify "no match" behavior.

## Notes / open questions for later

- iTunes' matching quality for obscure/regional releases is unverified -
  worth spot-checking against a few months of real Last.fm data before
  fully trusting it.
- No rate limits are documented for the public iTunes Search API, but it's
  still someone else's free service - keep the existing per-request
  caching headers to avoid hammering it unnecessarily.
