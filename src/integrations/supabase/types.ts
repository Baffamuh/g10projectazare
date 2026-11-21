export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      areas: {
        Row: {
          created_at: string
          id: string
          name: string
          zone_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          zone_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "areas_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          created_at: string
          id: string
          message: string | null
          name: string
          phone: string
          property_code: string | null
          property_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          name: string
          phone: string
          property_code?: string | null
          property_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          property_code?: string | null
          property_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          created_at: string
          estate: string
          id: string
          name: string
          note: string | null
          phone: string
          preferred_date: string
          status: string
          time_slot: string
        }
        Insert: {
          created_at?: string
          estate: string
          id?: string
          name: string
          note?: string | null
          phone: string
          preferred_date: string
          status?: string
          time_slot: string
        }
        Update: {
          created_at?: string
          estate?: string
          id?: string
          name?: string
          note?: string | null
          phone?: string
          preferred_date?: string
          status?: string
          time_slot?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          area_id: string | null
          category: string
          code: string
          condition: string | null
          contact_phone: string | null
          cover_key: string | null
          created_at: string
          description: string | null
          easy_buy: boolean
          featured: boolean
          id: string
          lat: number | null
          lng: number | null
          price: number
          published: boolean
          size_text: string | null
          status: string
          title: string
          transaction: string
          unit_no: string | null
          units_available: number
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          area_id?: string | null
          category: string
          code: string
          condition?: string | null
          contact_phone?: string | null
          cover_key?: string | null
          created_at?: string
          description?: string | null
          easy_buy?: boolean
          featured?: boolean
          id?: string
          lat?: number | null
          lng?: number | null
          price?: number
          published?: boolean
          size_text?: string | null
          status?: string
          title: string
          transaction: string
          unit_no?: string | null
          units_available?: number
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          area_id?: string | null
          category?: string
          code?: string
          condition?: string | null
          contact_phone?: string | null
          cover_key?: string | null
          created_at?: string
          description?: string | null
          easy_buy?: boolean
          featured?: boolean
          id?: string
          lat?: number | null
          lng?: number | null
          price?: number
          published?: boolean
          size_text?: string | null
          status?: string
          title?: string
          transaction?: string
          unit_no?: string | null
          units_available?: number
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      property_photos: {
        Row: {
          created_at: string
          id: string
          path: string | null
          property_id: string
          sort: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          path?: string | null
          property_id: string
          sort?: number
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          path?: string | null
          property_id?: string
          sort?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_photos_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          amount: number
          amount_paid: number
          buyer_address: string | null
          buyer_name: string
          buyer_phone: string
          created_at: string
          created_by: string | null
          id: string
          monthly: number | null
          months: number | null
          notes: string | null
          payment_method: string
          plot_details: string | null
          property_code: string | null
          property_id: string | null
          property_title: string | null
          receipt_no: string
          sale_date: string
        }
        Insert: {
          amount?: number
          amount_paid?: number
          buyer_address?: string | null
          buyer_name: string
          buyer_phone: string
          created_at?: string
          created_by?: string | null
          id?: string
          monthly?: number | null
          months?: number | null
          notes?: string | null
          payment_method: string
          plot_details?: string | null
          property_code?: string | null
          property_id?: string | null
          property_title?: string | null
          receipt_no: string
          sale_date?: string
        }
        Update: {
          amount?: number
          amount_paid?: number
          buyer_address?: string | null
          buyer_name?: string
          buyer_phone?: string
          created_at?: string
          created_by?: string | null
          id?: string
          monthly?: number | null
          months?: number | null
          notes?: string | null
          payment_method?: string
          plot_details?: string | null
          property_code?: string | null
          property_id?: string | null
          property_title?: string | null
          receipt_no?: string
          sale_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          easy_buy_enabled: boolean
          id: number
          updated_at: string
        }
        Insert: {
          easy_buy_enabled?: boolean
          id?: number
          updated_at?: string
        }
        Update: {
          easy_buy_enabled?: boolean
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      streets: {
        Row: {
          area_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          area_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          area_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "streets_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      zones: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          sort: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      next_property_code: { Args: { _prefix: string }; Returns: string }
      next_receipt_no: { Args: never; Returns: string }
    }
    Enums: {
      app_role: "admin" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff"],
    },
  },
} as const
