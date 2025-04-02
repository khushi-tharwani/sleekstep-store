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
      addresses: {
        Row: {
          city: string
          country: string
          id: string
          is_default: boolean | null
          state: string
          street: string
          user_id: string | null
          zip_code: string
        }
        Insert: {
          city: string
          country?: string
          id?: string
          is_default?: boolean | null
          state: string
          street: string
          user_id?: string | null
          zip_code: string
        }
        Update: {
          city?: string
          country?: string
          id?: string
          is_default?: boolean | null
          state?: string
          street?: string
          user_id?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color: string
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
          size: string
        }
        Insert: {
          color: string
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity: number
          size: string
        }
        Update: {
          color?: string
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
          size?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          created_at: string | null
          id: string
          payment_method: string | null
          status: string
          total: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address_id?: string | null
          created_at?: string | null
          id?: string
          payment_method?: string | null
          status?: string
          total: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address_id?: string | null
          created_at?: string | null
          id?: string
          payment_method?: string | null
          status?: string
          total?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      product_colors: {
        Row: {
          available: boolean | null
          id: string
          name: string
          product_id: string | null
          value: string
        }
        Insert: {
          available?: boolean | null
          id?: string
          name: string
          product_id?: string | null
          value: string
        }
        Update: {
          available?: boolean | null
          id?: string
          name?: string
          product_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_colors_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_sizes: {
        Row: {
          available: boolean | null
          id: string
          product_id: string | null
          value: string
        }
        Insert: {
          available?: boolean | null
          id?: string
          product_id?: string | null
          value: string
        }
        Update: {
          available?: boolean | null
          id?: string
          product_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_sizes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string
          category: string
          created_at: string | null
          description: string
          id: string
          images: string[]
          is_featured: boolean | null
          is_trending: boolean | null
          name: string
          price: number
          qr_code: string | null
          rating: number | null
          sale_price: number | null
          stock: number
          updated_at: string | null
        }
        Insert: {
          brand: string
          category: string
          created_at?: string | null
          description: string
          id?: string
          images: string[]
          is_featured?: boolean | null
          is_trending?: boolean | null
          name: string
          price: number
          qr_code?: string | null
          rating?: number | null
          sale_price?: number | null
          stock?: number
          updated_at?: string | null
        }
        Update: {
          brand?: string
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          images?: string[]
          is_featured?: boolean | null
          is_trending?: boolean | null
          name?: string
          price?: number
          qr_code?: string | null
          rating?: number | null
          sale_price?: number | null
          stock?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          product_id: string | null
          rating: number
          user_id: string | null
          user_name: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          rating: number
          user_id?: string | null
          user_name: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          rating?: number
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      make_user_admin: {
        Args: {
          user_email: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
