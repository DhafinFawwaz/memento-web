import { env } from "@/app/env";
import { createClient } from "@supabase/supabase-js";

const hasEnvVars =
  env.supabaseUrl &&
  env.supabaseAnonKey;

export const db = async () => {
  if(!hasEnvVars) throw new Error("Missing env vars");
  return await createClient(
    env.supabaseUrl!,
    env.supabaseAnonKey!,
  )
};
