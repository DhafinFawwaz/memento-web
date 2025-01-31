import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { hasEnvVars } from "./check-env-vars";

export const db = async () => {
  if(!hasEnvVars) throw new Error("Missing env vars");
  return await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
};
