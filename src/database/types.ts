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
      additional_values: {
        Row: {
          full_pallet_price: number
          half_pallet_price: number
          id: number
          mini_pallet_price: number
          plain_cup_markup_percent: number
        }
        Insert: {
          full_pallet_price: number
          half_pallet_price: number
          id?: number
          mini_pallet_price: number
          plain_cup_markup_percent?: number
        }
        Update: {
          full_pallet_price?: number
          half_pallet_price?: number
          id?: number
          mini_pallet_price?: number
          plain_cup_markup_percent?: number
        }
        Relationships: []
      }
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
          trend_color_lowered_edge: Json
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
          trend_color_lowered_edge: Json
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
          trend_color_lowered_edge?: Json
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
          deep_effect: boolean | null
          deep_effect_plus: boolean | null
          digital_print: boolean | null
          digital_print_additional: boolean | null
          direct_print: boolean | null
          full_pallet: number | null
          full_pallet_singular: number | null
          half_pallet: number | null
          half_pallet_singular: number | null
          icon: string | null
          id: number
          link: string
          material: string
          mini_pallet: number | null
          mini_pallet_singular: number | null
          nadruk_apla: boolean | null
          nadruk_dookola_pod_uchem: boolean | null
          nadruk_na_dnie: boolean | null
          nadruk_na_powloce_magicznej_1_kolor: boolean | null
          nadruk_na_spodzie: boolean | null
          nadruk_na_uchu: boolean | null
          nadruk_przez_rant: boolean | null
          nadruk_wewnatrz_na_sciance: boolean | null
          nadruk_zlotem_do_25cm2: boolean | null
          nadruk_zlotem_do_50cm2: boolean | null
          naklejka_papierowa_z_nadrukiem: boolean | null
          name: string
          personalizacja: boolean | null
          polylux: boolean | null
          pro_color: boolean | null
          soft_touch: boolean | null
          supplier: string | null
          supplier_code: string | null
          transfer_plus: boolean | null
          trend_color: boolean | null
          trend_color_lowered_edge: boolean | null
          volume: string
          wkladanie_ulotek_do_kubka: boolean | null
          zdobienie_paskiem_bez_laczenia: boolean | null
          zdobienie_paskiem_z_laczeniem: boolean | null
          zdobienie_tapeta_na_barylce_I_stopien_trudnosci: boolean | null
          zdobienie_tapeta_na_barylce_II_stopien_trudnosci: boolean | null
        }
        Insert: {
          category: string
          code: string
          color: string
          deep_effect?: boolean | null
          deep_effect_plus?: boolean | null
          digital_print?: boolean | null
          digital_print_additional?: boolean | null
          direct_print?: boolean | null
          full_pallet?: number | null
          full_pallet_singular?: number | null
          half_pallet?: number | null
          half_pallet_singular?: number | null
          icon?: string | null
          id?: number
          link: string
          material: string
          mini_pallet?: number | null
          mini_pallet_singular?: number | null
          nadruk_apla?: boolean | null
          nadruk_dookola_pod_uchem?: boolean | null
          nadruk_na_dnie?: boolean | null
          nadruk_na_powloce_magicznej_1_kolor?: boolean | null
          nadruk_na_spodzie?: boolean | null
          nadruk_na_uchu?: boolean | null
          nadruk_przez_rant?: boolean | null
          nadruk_wewnatrz_na_sciance?: boolean | null
          nadruk_zlotem_do_25cm2?: boolean | null
          nadruk_zlotem_do_50cm2?: boolean | null
          naklejka_papierowa_z_nadrukiem?: boolean | null
          name: string
          personalizacja?: boolean | null
          polylux?: boolean | null
          pro_color?: boolean | null
          soft_touch?: boolean | null
          supplier?: string | null
          supplier_code?: string | null
          transfer_plus?: boolean | null
          trend_color?: boolean | null
          trend_color_lowered_edge?: boolean | null
          volume: string
          wkladanie_ulotek_do_kubka?: boolean | null
          zdobienie_paskiem_bez_laczenia?: boolean | null
          zdobienie_paskiem_z_laczeniem?: boolean | null
          zdobienie_tapeta_na_barylce_I_stopien_trudnosci?: boolean | null
          zdobienie_tapeta_na_barylce_II_stopien_trudnosci?: boolean | null
        }
        Update: {
          category?: string
          code?: string
          color?: string
          deep_effect?: boolean | null
          deep_effect_plus?: boolean | null
          digital_print?: boolean | null
          digital_print_additional?: boolean | null
          direct_print?: boolean | null
          full_pallet?: number | null
          full_pallet_singular?: number | null
          half_pallet?: number | null
          half_pallet_singular?: number | null
          icon?: string | null
          id?: number
          link?: string
          material?: string
          mini_pallet?: number | null
          mini_pallet_singular?: number | null
          nadruk_apla?: boolean | null
          nadruk_dookola_pod_uchem?: boolean | null
          nadruk_na_dnie?: boolean | null
          nadruk_na_powloce_magicznej_1_kolor?: boolean | null
          nadruk_na_spodzie?: boolean | null
          nadruk_na_uchu?: boolean | null
          nadruk_przez_rant?: boolean | null
          nadruk_wewnatrz_na_sciance?: boolean | null
          nadruk_zlotem_do_25cm2?: boolean | null
          nadruk_zlotem_do_50cm2?: boolean | null
          naklejka_papierowa_z_nadrukiem?: boolean | null
          name?: string
          personalizacja?: boolean | null
          polylux?: boolean | null
          pro_color?: boolean | null
          soft_touch?: boolean | null
          supplier?: string | null
          supplier_code?: string | null
          transfer_plus?: boolean | null
          trend_color?: boolean | null
          trend_color_lowered_edge?: boolean | null
          volume?: string
          wkladanie_ulotek_do_kubka?: boolean | null
          zdobienie_paskiem_bez_laczenia?: boolean | null
          zdobienie_paskiem_z_laczeniem?: boolean | null
          zdobienie_tapeta_na_barylce_I_stopien_trudnosci?: boolean | null
          zdobienie_tapeta_na_barylce_II_stopien_trudnosci?: boolean | null
        }
        Relationships: []
      }
      restrictions: {
        Row: {
          anotherValue: string
          id: number
          imprintType: string
        }
        Insert: {
          anotherValue: string
          id?: number
          imprintType: string
        }
        Update: {
          anotherValue?: string
          id?: number
          imprintType?: string
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
            referencedColumns: ["user_id"]
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
      cup_ids_in_pricings: {
        Row: {
          cup_id: number | null
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
