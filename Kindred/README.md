# Kindred — Volunteer platform

A GitHub Pages frontend backed by Supabase authentication and Postgres with Row Level Security.

## Publish on GitHub Pages
This project lives at `Kindred/` in `SimR2013/Biology`. In that repository, open **Settings → Pages**, select **Deploy from a branch**, branch **main**, folder **/(root)**, and save. After GitHub finishes deploying, open:

https://simr2013.github.io/Biology/Kindred/

If Pages is already configured for main/root, changes publish automatically.

## Connect the real backend
1. Create a project at https://supabase.com/dashboard and use the **SQL Editor** to execute `schema.sql` once.
2. In Supabase **Project Settings → API**, copy the project URL and **publishable key** (or legacy `anon` key). NEVER put the secret/service_role key in client code.
3. Edit the top of the inline script in `index.html`:
   `const CONFIG={url:"https://YOURPROJECT.supabase.co",anonKey:"YOUR_PUBLISHABLE_KEY"};`
4. In Supabase **Authentication → URL Configuration**, set Site URL to `https://simr2013.github.io/Biology/Kindred/` and add that URL to allowed redirect URLs.
5. Commit the modified file. GitHub Pages deploys the updated site.

## Included
- Responsive landing page and discover pages
- Real email/password signup and login with Supabase Auth once configured
- Profiles and scored recommendations (interest 30%, availability 25%, distance 20%, commitment 10%, activity 15%)
- Age eligibility filtering and server-side application eligibility checks
- Organizations and listing creation
- Applications and organization accept/decline actions
- Hours logging from accepted applications (pending verification), saved listings, dashboards
- Row Level Security policies to separate volunteer and organization data

## Important limitations / to build before a public launch
- **Backend credentials must be configured**. Without this, actions tell the visitor that the service has not been activated.
- No organizations, opportunity listings, user counts, or verified badges are fabricated.
- Organization verification is admin-controlled in SQL; there is no browser admin verification screen yet.
- Organization **hours verification UI is not implemented** yet; the underlying SQL schema supports owner-authorized status changes. Add that screen before claiming hours verification works end-to-end.
- Match distance is meaningful only if each opportunity has an accurate distance_miles for each user; currently listing distance is a basic entered number. Replace with geocoding/road-distance calculation for trustworthy personalized results.
- Email notifications, external applications, rich availability, badges/streaks, photo uploads, abuse reports, and full accessibility/security testing remain future work.
- Real deployments should add rate limits, CAPTCHA/anti-spam, privacy policy, terms, user deletion workflow, moderation and parental/age safeguards.
- The dashboard counts only `verified` sessions. Do not mark unapproved sessions as verified.

## Security
Supabase's public/publishable key is designed for browser use. Sensitive permissions are enforced via Postgres RLS. Do not expose the service-role or secret key in GitHub. Keep Supabase project administration private.

## Test
Test with two distinct emails: volunteer (complete profile with valid age) and organization owner (register organization, post a listing, review an application). Confirm users cannot see each other's private application histories. Use Supabase SQL Editor for inspecting or administering backend data.
