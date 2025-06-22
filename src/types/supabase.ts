export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      creative_requests: {
        Row: {
          created_at: string | null
          cta_text: string | null
          description: string | null
          headline: string | null
          id: string
          logo_url: string | null
          primary_color: string | null
          product_images: Json | null
          prompt: string
          requested_formats: string[]
          secondary_color: string | null
          status: Database["public"]["Enums"]["creative_request_status"] | null
          style: string | null
          sub_headline: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          cta_text?: string | null
          description?: string | null
          headline?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          product_images?: Json | null
          prompt: string
          requested_formats: string[]
          secondary_color?: string | null
          status?: Database["public"]["Enums"]["creative_request_status"] | null
          style?: string | null
          sub_headline?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          cta_text?: string | null
          description?: string | null
          headline?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          product_images?: Json | null
          prompt?: string
          requested_formats?: string[]
          secondary_color?: string | null
          status?: Database["public"]["Enums"]["creative_request_status"] | null
          style?: string | null
          sub_headline?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      creatives: {
        Row: {
          background: Database["public"]["Enums"]["background_type"] | null
          created_at: string
          cta_text: string | null
          description: string | null
          error_message: string | null
          format: Database["public"]["Enums"]["creative_format"] | null
          generated_image_url: string | null
          headline: string | null
          id: string
          logo_url: string | null
          output_compression: number | null
          output_format: Database["public"]["Enums"]["output_format"] | null
          primary_color: string | null
          processed_at: string | null
          processing_time_ms: number | null
          product_images: Json | null
          prompt: string
          quality: Database["public"]["Enums"]["image_quality"] | null
          request_id: string | null
          result_url: string | null
          secondary_color: string | null
          status: Database["public"]["Enums"]["creative_status"] | null
          style: string | null
          sub_headline: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          background?: Database["public"]["Enums"]["background_type"] | null
          created_at?: string
          cta_text?: string | null
          description?: string | null
          error_message?: string | null
          format?: Database["public"]["Enums"]["creative_format"] | null
          generated_image_url?: string | null
          headline?: string | null
          id?: string
          logo_url?: string | null
          output_compression?: number | null
          output_format?: Database["public"]["Enums"]["output_format"] | null
          primary_color?: string | null
          processed_at?: string | null
          processing_time_ms?: number | null
          product_images?: Json | null
          prompt: string
          quality?: Database["public"]["Enums"]["image_quality"] | null
          request_id?: string | null
          result_url?: string | null
          secondary_color?: string | null
          status?: Database["public"]["Enums"]["creative_status"] | null
          style?: string | null
          sub_headline?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          background?: Database["public"]["Enums"]["background_type"] | null
          created_at?: string
          cta_text?: string | null
          description?: string | null
          error_message?: string | null
          format?: Database["public"]["Enums"]["creative_format"] | null
          generated_image_url?: string | null
          headline?: string | null
          id?: string
          logo_url?: string | null
          output_compression?: number | null
          output_format?: Database["public"]["Enums"]["output_format"] | null
          primary_color?: string | null
          processed_at?: string | null
          processing_time_ms?: number | null
          product_images?: Json | null
          prompt?: string
          quality?: Database["public"]["Enums"]["image_quality"] | null
          request_id?: string | null
          result_url?: string | null
          secondary_color?: string | null
          status?: Database["public"]["Enums"]["creative_status"] | null
          style?: string | null
          sub_headline?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creatives_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "creative_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creatives_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      queue_jobs: {
        Row: {
          attempts: number | null
          created_at: string
          creative_id: string
          error_message: string | null
          id: string
          max_attempts: number | null
          priority: number | null
          processing_completed_at: string | null
          processing_started_at: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string
          creative_id: string
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          priority?: number | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number | null
          created_at?: string
          creative_id?: string
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          priority?: number | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_jobs_creative_id_fkey"
            columns: ["creative_id"]
            isOneToOne: false
            referencedRelation: "creatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          auto_refresh_interval: number | null
          created_at: string
          default_background:
            | Database["public"]["Enums"]["background_type"]
            | null
          default_moderation:
            | Database["public"]["Enums"]["moderation_level"]
            | null
          default_output_compression: number | null
          default_output_format:
            | Database["public"]["Enums"]["output_format"]
            | null
          default_quality: Database["public"]["Enums"]["image_quality"] | null
          enable_auto_refresh: boolean | null
          language: string | null
          model: string | null
          openai_api_key: string | null
          retries: number | null
          theme: string | null
          timeout: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_refresh_interval?: number | null
          created_at?: string
          default_background?:
            | Database["public"]["Enums"]["background_type"]
            | null
          default_moderation?:
            | Database["public"]["Enums"]["moderation_level"]
            | null
          default_output_compression?: number | null
          default_output_format?:
            | Database["public"]["Enums"]["output_format"]
            | null
          default_quality?: Database["public"]["Enums"]["image_quality"] | null
          enable_auto_refresh?: boolean | null
          language?: string | null
          model?: string | null
          openai_api_key?: string | null
          retries?: number | null
          theme?: string | null
          timeout?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_refresh_interval?: number | null
          created_at?: string
          default_background?:
            | Database["public"]["Enums"]["background_type"]
            | null
          default_moderation?:
            | Database["public"]["Enums"]["moderation_level"]
            | null
          default_output_compression?: number | null
          default_output_format?:
            | Database["public"]["Enums"]["output_format"]
            | null
          default_quality?: Database["public"]["Enums"]["image_quality"] | null
          enable_auto_refresh?: boolean | null
          language?: string | null
          model?: string | null
          openai_api_key?: string | null
          retries?: number | null
          theme?: string | null
          timeout?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      background_type: "auto" | "transparent" | "opaque"
      creative_format: "9:16" | "1:1" | "16:9" | "4:3" | "3:4"
      creative_request_status:
        | "pending"
        | "processing"
        | "completed"
        | "partial"
        | "failed"
      creative_status:
        | "draft"
        | "queued"
        | "processing"
        | "completed"
        | "failed"
      image_quality: "auto" | "high" | "medium" | "low"
      job_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      moderation_level: "auto" | "low"
      output_format: "png" | "jpeg" | "webp"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      background_type: ["auto", "transparent", "opaque"],
      creative_format: ["9:16", "1:1", "16:9", "4:3", "3:4"],
      creative_request_status: [
        "pending",
        "processing",
        "completed",
        "partial",
        "failed",
      ],
      creative_status: ["draft", "queued", "processing", "completed", "failed"],
      image_quality: ["auto", "high", "medium", "low"],
      job_status: ["pending", "processing", "completed", "failed", "cancelled"],
      moderation_level: ["auto", "low"],
      output_format: ["png", "jpeg", "webp"],
      user_role: ["admin", "user"],
    },
  },
} as const 