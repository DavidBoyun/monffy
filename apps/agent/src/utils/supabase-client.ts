import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config.js";
import { dbLog } from "./logger.js";

// Service role client - full access for autonomous agent operations
export const supabase: SupabaseClient = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("questions")
      .select("id")
      .limit(1);

    if (error) {
      dbLog.error({ error }, "Supabase connection test failed");
      return false;
    }

    dbLog.info(
      { url: config.SUPABASE_URL, rowsFound: data?.length ?? 0 },
      "Supabase connected"
    );
    return true;
  } catch (err) {
    dbLog.error({ err }, "Supabase connection error");
    return false;
  }
}
