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
      color_pricings: {
        Row: {
          additional_costs: Json
          cardboard_print: Json[]
          cardboards: Json[]
          deep_effect: Json[]
          deep_effect_plus: Json[]
          digital_print: Json
          direct_print: Json[]
          id: number
          polylux: Json[]
          pricing_name: string
          pro_color: Json[]
          soft_touch: Json
          transfer_plus: Json[]
          trend_color: Json[]
          trend_color_z_obnizonym: Json
        }
        Insert: {
          additional_costs: Json
          cardboard_print: Json[]
          cardboards: Json[]
          deep_effect: Json[]
          deep_effect_plus: Json[]
          digital_print: Json
          direct_print: Json[]
          id?: number
          polylux: Json[]
          pricing_name: string
          pro_color: Json[]
          soft_touch: Json
          transfer_plus: Json[]
          trend_color: Json[]
          trend_color_z_obnizonym: Json
        }
        Update: {
          additional_costs?: Json
          cardboard_print?: Json[]
          cardboards?: Json[]
          deep_effect?: Json[]
          deep_effect_plus?: Json[]
          digital_print?: Json
          direct_print?: Json[]
          id?: number
          polylux?: Json[]
          pricing_name?: string
          pro_color?: Json[]
          soft_touch?: Json
          transfer_plus?: Json[]
          trend_color?: Json[]
          trend_color_z_obnizonym?: Json
        }
        Relationships: []
      }
      cup_pricings: {
        Row: {
          cup_id: number
          id: number
          price_1008: number
          price_108: number
          price_216: number
          price_24: number
          price_2520: number
          price_504: number
          price_72: number
          pricing_name: string
        }
        Insert: {
          cup_id: number
          id?: number
          price_1008: number
          price_108: number
          price_216: number
          price_24: number
          price_2520: number
          price_504: number
          price_72: number
          pricing_name: string
        }
        Update: {
          cup_id?: number
          id?: number
          price_1008?: number
          price_108?: number
          price_216?: number
          price_24?: number
          price_2520?: number
          price_504?: number
          price_72?: number
          pricing_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "cup_pricings_cup_id_fkey"
            columns: ["cup_id"]
            referencedRelation: "cups"
            referencedColumns: ["id"]
          }
        ]
      }
      cups: {
        Row: {
          category: string
          code: string
          color: string
          deep_effect: boolean
          deep_effect_plus: boolean
          digital_print: boolean
          digital_print_additional: boolean | null
          direct_print: boolean
          full_pallet: number
          half_pallet: number
          icon: string | null
          id: number
          material: string
          mini_pallet: number
          nadruk_apla: boolean
          nadruk_dookola_pod_uchem: boolean
          nadruk_na_dnie: boolean
          nadruk_na_powloce_magicznej_1_kolor: boolean
          nadruk_na_uchu: boolean
          nadruk_przez_rant: boolean
          nadruk_wewnatrz_na_sciance: boolean
          nadruk_zlotem_do_25cm2: boolean
          nadruk_zlotem_do_50cm2: boolean
          naklejka_papierowa_z_nadrukiem: boolean
          name: string
          personalizacja: boolean
          polylux: boolean
          pro_color: boolean
          soft_touch: boolean
          supplier: string
          supplier_name: string
          transfer_plus: boolean
          trend_color: boolean
          trend_color_lowered_edge: boolean
          volume: string
          wkladanie_ulotek_do_kubka: boolean
          zdobienie_paskiem_bez_laczenia: boolean
          zdobienie_paskiem_z_laczeniem: boolean
          zdobienie_tapeta_na_barylce_I_stopien_trudnosci: boolean
          zdobienie_tapeta_na_barylce_II_stopien_trudnosci: boolean
        }
        Insert: {
          category: string
          code: string
          color: string
          deep_effect: boolean
          deep_effect_plus: boolean
          digital_print: boolean
          digital_print_additional?: boolean | null
          direct_print: boolean
          full_pallet: number
          half_pallet: number
          icon?: string | null
          id?: number
          material: string
          mini_pallet: number
          nadruk_apla: boolean
          nadruk_dookola_pod_uchem: boolean
          nadruk_na_dnie: boolean
          nadruk_na_powloce_magicznej_1_kolor: boolean
          nadruk_na_uchu: boolean
          nadruk_przez_rant: boolean
          nadruk_wewnatrz_na_sciance: boolean
          nadruk_zlotem_do_25cm2: boolean
          nadruk_zlotem_do_50cm2: boolean
          naklejka_papierowa_z_nadrukiem: boolean
          name: string
          personalizacja: boolean
          polylux: boolean
          pro_color: boolean
          soft_touch: boolean
          supplier: string
          supplier_name: string
          transfer_plus: boolean
          trend_color: boolean
          trend_color_lowered_edge: boolean
          volume: string
          wkladanie_ulotek_do_kubka: boolean
          zdobienie_paskiem_bez_laczenia: boolean
          zdobienie_paskiem_z_laczeniem: boolean
          zdobienie_tapeta_na_barylce_I_stopien_trudnosci: boolean
          zdobienie_tapeta_na_barylce_II_stopien_trudnosci: boolean
        }
        Update: {
          category?: string
          code?: string
          color?: string
          deep_effect?: boolean
          deep_effect_plus?: boolean
          digital_print?: boolean
          digital_print_additional?: boolean | null
          direct_print?: boolean
          full_pallet?: number
          half_pallet?: number
          icon?: string | null
          id?: number
          material?: string
          mini_pallet?: number
          nadruk_apla?: boolean
          nadruk_dookola_pod_uchem?: boolean
          nadruk_na_dnie?: boolean
          nadruk_na_powloce_magicznej_1_kolor?: boolean
          nadruk_na_uchu?: boolean
          nadruk_przez_rant?: boolean
          nadruk_wewnatrz_na_sciance?: boolean
          nadruk_zlotem_do_25cm2?: boolean
          nadruk_zlotem_do_50cm2?: boolean
          naklejka_papierowa_z_nadrukiem?: boolean
          name?: string
          personalizacja?: boolean
          polylux?: boolean
          pro_color?: boolean
          soft_touch?: boolean
          supplier?: string
          supplier_name?: string
          transfer_plus?: boolean
          trend_color?: boolean
          trend_color_lowered_edge?: boolean
          volume?: string
          wkladanie_ulotek_do_kubka?: boolean
          zdobienie_paskiem_bez_laczenia?: boolean
          zdobienie_paskiem_z_laczeniem?: boolean
          zdobienie_tapeta_na_barylce_I_stopien_trudnosci?: boolean
          zdobienie_tapeta_na_barylce_II_stopien_trudnosci?: boolean
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
      available_color_pricings: {
        Row: {
          pricing_name: string | null
        }
        Relationships: []
      }
      available_cup_pricings: {
        Row: {
          pricing_name: string | null
        }
        Relationships: []
      }
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
