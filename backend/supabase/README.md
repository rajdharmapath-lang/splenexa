# Supabase database and Edge Function setup

1. Create a Supabase project.
2. Configure the backend-only values `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `MSG91_TOKEN_AUTH`, and
   `MSG91_WIDGET_ID` in `backend/.env`. Use credentials from the Splenexa
   Supabase project only. The service-role key is server-only and must never
   be included in the app bundle.
3. Configure `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SUPABASE_URL`, and
   `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `frontend/.env`. These values are
   embedded in the app; never put a service-role key in this file. For an
   Android emulator using a backend on the same computer, use
   `http://10.0.2.2:3000` for `EXPO_PUBLIC_API_URL`. For a physical device,
   use the computer's LAN IP instead.
4. Apply `backend/supabase/migrations/20261022000000_create_users.sql` to the
   project database. The API accesses the table with the service role; client
   access for `anon` and `authenticated` is revoked.
5. Install the Supabase CLI, authenticate, and link the `backend/` directory to
   the Splenexa Supabase project. Create an untracked
   `backend/supabase/.env.edge` file containing only the same Splenexa
   `JWT_SECRET` used by the Express backend, then set it as an Edge Function
   secret:

   ```powershell
   cd backend
   supabase login
   supabase link --project-ref YOUR_SPLENEXA_PROJECT_REF
   supabase secrets set --env-file supabase/.env.edge
   supabase functions deploy super-worker
   ```

   The file should have one line: `JWT_SECRET=...`. Supabase provides
   `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the Edge Function from the
   linked project. Never copy values from the reference project or place a
   service-role key in the frontend.

   `verify_jwt` is disabled for the Supabase gateway because Splenexa issues its
   own API session JWT rather than a Supabase Auth JWT. The function verifies
   that session signature and expiry itself before using the service role.

MSG91 sends and verifies phone OTPs. After verification, the API creates or
loads the corresponding database user and returns a signed API session token.
The Expo app stores that token in SecureStore; the `super-worker` Edge Function
validates it before reading or updating only that user's profile.
