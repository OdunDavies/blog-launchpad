export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      challenges: {
        Row: { id: string; creator_id: string; creator_name: string | null; name: string; description: string | null; goal_metric: string; goal_target: number; duration_days: number; visibility: string; invite_code: string | null; created_at: string | null; start_date: string | null; end_date: string | null; participant_count: number | null }
        Insert: { id: string; creator_id: string; creator_name?: string | null; name: string; description?: string | null; goal_metric: string; goal_target: number; duration_days: number; visibility: string; invite_code?: string | null; created_at?: string | null; start_date?: string | null; end_date?: string | null; participant_count?: number | null }
        Update: { id?: string; creator_id?: string; creator_name?: string | null; name?: string; description?: string | null; goal_metric?: string; goal_target?: number; duration_days?: number; visibility?: string; invite_code?: string | null; created_at?: string | null; start_date?: string | null; end_date?: string | null; participant_count?: number | null }
        Relationships: [{ foreignKeyName: "challenges_creator_id_fkey"; columns: ["creator_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"] }]
      }
      challenge_participants: {
        Row: { challenge_id: string; user_id: string; display_name: string | null; joined_at: string | null; progress: number | null; goal_target: number | null; completed: boolean | null; completed_at: string | null }
        Insert: { challenge_id: string; user_id: string; display_name?: string | null; joined_at?: string | null; progress?: number | null; goal_target?: number | null; completed?: boolean | null; completed_at?: string | null }
        Update: { challenge_id?: string; user_id?: string; display_name?: string | null; joined_at?: string | null; progress?: number | null; goal_target?: number | null; completed?: boolean | null; completed_at?: string | null }
        Relationships: [
          { foreignKeyName: "challenge_participants_challenge_id_fkey"; columns: ["challenge_id"]; isOneToOne: false; referencedRelation: "challenges"; referencedColumns: ["id"] },
          { foreignKeyName: "challenge_participants_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"] }
        ]
      }
      shared_workouts: {
        Row: { created_at: string | null; id: string; views: number | null; workout_data: Json; user_id: string | null }
        Insert: { created_at?: string | null; id: string; views?: number | null; workout_data: Json; user_id?: string | null }
        Update: { created_at?: string | null; id?: string; views?: number | null; workout_data?: Json; user_id?: string | null }
        Relationships: [{ foreignKeyName: "shared_workouts_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"] }]
      }
      user_profiles: {
        Row: { id: string; display_name: string | null; avatar_url: string | null; created_at: string | null; updated_at: string | null; profile_data: Json | null; weight_unit: string | null }
        Insert: { id: string; display_name?: string | null; avatar_url?: string | null; created_at?: string | null; updated_at?: string | null; profile_data?: Json | null; weight_unit?: string | null }
        Update: { id?: string; display_name?: string | null; avatar_url?: string | null; created_at?: string | null; updated_at?: string | null; profile_data?: Json | null; weight_unit?: string | null }
        Relationships: [{ foreignKeyName: "user_profiles_id_fkey"; columns: ["id"]; isOneToOne: true; referencedRelation: "users"; referencedColumns: ["id"] }]
      }
      workout_logs: {
        Row: { id: string; user_id: string; date: string; start_time: string; end_time: string | null; duration: number | null; workout_name: string | null; template_id: string | null; template_day_index: number | null; exercises: Json; notes: string | null; mood: string | null; source: string | null; source_id: string | null; source_day_index: number | null; created_at: string | null; updated_at: string | null }
        Insert: { id: string; user_id: string; date: string; start_time: string; end_time?: string | null; duration?: number | null; workout_name?: string | null; template_id?: string | null; template_day_index?: number | null; exercises?: Json; notes?: string | null; mood?: string | null; source?: string | null; source_id?: string | null; source_day_index?: number | null; created_at?: string | null; updated_at?: string | null }
        Update: { id?: string; user_id?: string; date?: string; start_time?: string; end_time?: string | null; duration?: number | null; workout_name?: string | null; template_id?: string | null; template_day_index?: number | null; exercises?: Json; notes?: string | null; mood?: string | null; source?: string | null; source_id?: string | null; source_day_index?: number | null; created_at?: string | null; updated_at?: string | null }
        Relationships: [{ foreignKeyName: "workout_logs_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"] }]
      }
      exercise_prs: {
        Row: { exercise_id: string; user_id: string; exercise_name: string; weight: number; weight_unit: string; reps: number; estimated_1rm: number; date: string; workout_log_id: string | null; created_at: string | null; updated_at: string | null }
        Insert: { exercise_id: string; user_id: string; exercise_name: string; weight: number; weight_unit: string; reps: number; estimated_1rm: number; date: string; workout_log_id?: string | null; created_at?: string | null; updated_at?: string | null }
        Update: { exercise_id?: string; user_id?: string; exercise_name?: string; weight?: number; weight_unit?: string; reps?: number; estimated_1rm?: number; date?: string; workout_log_id?: string | null; created_at?: string | null; updated_at?: string | null }
        Relationships: [{ foreignKeyName: "exercise_prs_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"] }]
      }
      favorite_exercises: {
        Row: { user_id: string; exercise_id: string; created_at: string | null }
        Insert: { user_id: string; exercise_id: string; created_at?: string | null }
        Update: { user_id?: string; exercise_id?: string; created_at?: string | null }
        Relationships: [{ foreignKeyName: "favorite_exercises_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"] }]
      }
      custom_templates: {
        Row: { id: string; user_id: string; name: string; description: string | null; difficulty: string | null; days_per_week: number | null; goal: string | null; schedule: Json; created_at: string | null; updated_at: string | null }
        Insert: { id: string; user_id: string; name: string; description?: string | null; difficulty?: string | null; days_per_week?: number | null; goal?: string | null; schedule?: Json; created_at?: string | null; updated_at?: string | null }
        Update: { id?: string; user_id?: string; name?: string; description?: string | null; difficulty?: string | null; days_per_week?: number | null; goal?: string | null; schedule?: Json; created_at?: string | null; updated_at?: string | null }
        Relationships: [{ foreignKeyName: "custom_templates_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"] }]
      }
      saved_plans: {
        Row: { id: string; user_id: string; name: string; split_days: number | null; goal: string | null; gender: string | null; target_muscles: Json | null; schedule: Json; saved_at: string | null; updated_at: string | null }
        Insert: { id: string; user_id: string; name: string; split_days?: number | null; goal?: string | null; gender?: string | null; target_muscles?: Json | null; schedule?: Json; saved_at?: string | null; updated_at?: string | null }
        Update: { id?: string; user_id?: string; name?: string; split_days?: number | null; goal?: string | null; gender?: string | null; target_muscles?: Json | null; schedule?: Json; saved_at?: string | null; updated_at?: string | null }
        Relationships: [{ foreignKeyName: "saved_plans_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"] }]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
