// Placeholder so the function folder is recognized.
// Real assertions live in `rls_test.ts` and run via `supabase test functions`.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
serve(() => new Response("Use Deno test runner: rls_test.ts", { status: 200 }));
