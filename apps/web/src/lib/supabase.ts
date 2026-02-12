import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (generated from Supabase schema)
export interface Database {
  public: {
    Tables: {
      questions: {
        Row: {
          id: string;
          lane: "luck" | "prediction" | "sponsor";
          category: string;
          question_text: string;
          options: string[];
          correct_answer: number | null;
          sponsor_id: string | null;
          created_at: string;
          expires_at: string | null;
          is_active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["questions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
      };
      responses: {
        Row: {
          id: string;
          question_id: string;
          wallet_address: string;
          selected_option: number;
          is_correct: boolean | null;
          points_earned: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["responses"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["responses"]["Insert"]>;
      };
      sponsors: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          tier: "basic" | "premium" | "exclusive";
          monthly_fee: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sponsors"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["sponsors"]["Insert"]>;
      };
      daily_streaks: {
        Row: {
          wallet_address: string;
          current_streak: number;
          longest_streak: number;
          last_activity_date: string;
          total_points: number;
        };
        Insert: Database["public"]["Tables"]["daily_streaks"]["Row"];
        Update: Partial<Database["public"]["Tables"]["daily_streaks"]["Insert"]>;
      };
      badges: {
        Row: {
          id: string;
          wallet_address: string;
          badge_type: string;
          token_id: number;
          minted_at: string;
          tx_hash: string;
        };
        Insert: Omit<Database["public"]["Tables"]["badges"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["badges"]["Insert"]>;
      };
    };
  };
}
