export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cup_pricings: {
        Row: {
          cup_id: number
          id: number
        }
        Insert: {
          cup_id: number
          id?: number
        }
        Update: {
          cup_id?: number
          id?: number
        }
        Relationships: []
      }
      cups: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          adress: string
          city: string
          company_name: string
          country: string
          email: string
          eu: boolean
          first_name: string
          last_name: string
          NIP: string
          phone: string
          postal_code: string
          region: string
          role: Database["public"]["Enums"]["role_enum"]
          user_id: string
        }
        Insert: {
          adress: string
          city: string
          company_name: string
          country: string
          email: string
          eu: boolean
          first_name: string
          last_name: string
          NIP: string
          phone: string
          postal_code: string
          region: string
          role?: Database["public"]["Enums"]["role_enum"]
          user_id: string
        }
        Update: {
          adress?: string
          city?: string
          company_name?: string
          country?: string
          email?: string
          eu?: boolean
          first_name?: string
          last_name?: string
          NIP?: string
          phone?: string
          postal_code?: string
          region?: string
          role?: Database["public"]["Enums"]["role_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users_restricted: {
        Row: {
          activated: boolean
          color_pricing: string | null
          cup_pricing: string | null
          role: Database["public"]["Enums"]["role_enum"]
          user_id: string
        }
        Insert: {
          activated?: boolean
          color_pricing?: string | null
          cup_pricing?: string | null
          role?: Database["public"]["Enums"]["role_enum"]
          user_id: string
        }
        Update: {
          activated?: boolean
          color_pricing?: string | null
          cup_pricing?: string | null
          role?: Database["public"]["Enums"]["role_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_restricted_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      role_enum: "User" | "Salesman" | "Admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
