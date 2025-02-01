import { createClient } from "@supabase/supabase-js";

const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const db = async () => {
  if(!hasEnvVars) throw new Error("Missing env vars");
  return await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
};
