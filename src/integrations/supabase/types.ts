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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      _archived_nav_groups: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          label: string
          position: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          label: string
          position?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          label?: string
          position?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      _archived_nav_items: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          item_type: string
          label: string
          position: number
          section_id: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          item_type?: string
          label: string
          position?: number
          section_id: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          item_type?: string
          label?: string
          position?: number
          section_id?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "nav_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "_archived_nav_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      _archived_nav_sections: {
        Row: {
          created_at: string
          description: string | null
          group_id: string
          href: string | null
          id: string
          is_visible: boolean
          label: string
          position: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_id: string
          href?: string | null
          id?: string
          is_visible?: boolean
          label: string
          position?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          group_id?: string
          href?: string | null
          id?: string
          is_visible?: boolean
          label?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nav_sections_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "_archived_nav_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          ip: string | null
          metadata: Json | null
          target_user_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          ip?: string | null
          metadata?: Json | null
          target_user_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          ip?: string | null
          metadata?: Json | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          author_id: string | null
          category_id: string | null
          challenge: string | null
          client_name: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          gallery: Json
          id: string
          industry: string | null
          preview_token: string
          published_at: string | null
          results: string | null
          slug: string
          slug_ar: string | null
          solution: string | null
          status: Database["public"]["Enums"]["post_status"]
          summary: string | null
          tags: string[]
          title: string
          translations: Json
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          challenge?: string | null
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          gallery?: Json
          id?: string
          industry?: string | null
          preview_token?: string
          published_at?: string | null
          results?: string | null
          slug: string
          slug_ar?: string | null
          solution?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          summary?: string | null
          tags?: string[]
          title: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          challenge?: string | null
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          gallery?: Json
          id?: string
          industry?: string | null
          preview_token?: string
          published_at?: string | null
          results?: string | null
          slug?: string
          slug_ar?: string | null
          solution?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          summary?: string | null
          tags?: string[]
          title?: string
          translations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_studies_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          content_type: string
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          translations: Json
          updated_at: string
        }
        Insert: {
          content_type?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          translations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_inquiry_areas: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string
          position: number
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          position?: number
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          position?: number
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      contact_offices: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string
          id: string
          image_url: string | null
          phone: string
          position: number
          translations: Json
          updated_at: string
        }
        Insert: {
          address?: string
          city: string
          created_at?: string
          email?: string
          id?: string
          image_url?: string | null
          phone?: string
          position?: number
          translations?: Json
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string
          id?: string
          image_url?: string | null
          phone?: string
          position?: number
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      contact_page: {
        Row: {
          created_at: string
          form_heading: string
          form_subheading: string
          form_submit_label: string
          hero_background_url: string | null
          hero_cta_href: string
          hero_cta_label: string
          hero_eyebrow: string
          hero_headline: string
          hero_subheadline: string
          id: string
          notification_email: string | null
          offices_heading: string
          offices_subheading: string
          quick_info: Json
          singleton: boolean
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          form_heading?: string
          form_subheading?: string
          form_submit_label?: string
          hero_background_url?: string | null
          hero_cta_href?: string
          hero_cta_label?: string
          hero_eyebrow?: string
          hero_headline?: string
          hero_subheadline?: string
          id?: string
          notification_email?: string | null
          offices_heading?: string
          offices_subheading?: string
          quick_info?: Json
          singleton?: boolean
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          form_heading?: string
          form_subheading?: string
          form_submit_label?: string
          hero_background_url?: string | null
          hero_cta_href?: string
          hero_cta_label?: string
          hero_eyebrow?: string
          hero_headline?: string
          hero_subheadline?: string
          id?: string
          notification_email?: string | null
          offices_heading?: string
          offices_subheading?: string
          quick_info?: Json
          singleton?: boolean
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          area: string
          consent: boolean
          created_at: string
          custom_data: Json
          email: string
          id: string
          message: string
          name: string
          page_path: string | null
          page_title: string | null
          phone: string
          source: string
          status: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          area?: string
          consent?: boolean
          created_at?: string
          custom_data?: Json
          email: string
          id?: string
          message?: string
          name: string
          page_path?: string | null
          page_title?: string | null
          phone?: string
          source?: string
          status?: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          area?: string
          consent?: boolean
          created_at?: string
          custom_data?: Json
          email?: string
          id?: string
          message?: string
          name?: string
          page_path?: string | null
          page_title?: string | null
          phone?: string
          source?: string
          status?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      content_revisions: {
        Row: {
          created_at: string
          editor_id: string | null
          entity_id: string
          entity_type: string
          id: string
          snapshot: Json
        }
        Insert: {
          created_at?: string
          editor_id?: string | null
          entity_id: string
          entity_type: string
          id?: string
          snapshot: Json
        }
        Update: {
          created_at?: string
          editor_id?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          snapshot?: Json
        }
        Relationships: []
      }
      events: {
        Row: {
          author_id: string | null
          category_id: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          ends_at: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          excerpt: string | null
          id: string
          location: string | null
          preview_token: string
          published_at: string | null
          registration_url: string | null
          slug: string
          slug_ar: string | null
          starts_at: string | null
          status: Database["public"]["Enums"]["post_status"]
          tags: string[]
          title: string
          translations: Json
          updated_at: string
          virtual_link: string | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          excerpt?: string | null
          id?: string
          location?: string | null
          preview_token?: string
          published_at?: string | null
          registration_url?: string | null
          slug: string
          slug_ar?: string | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          tags?: string[]
          title: string
          translations?: Json
          updated_at?: string
          virtual_link?: string | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          excerpt?: string | null
          id?: string
          location?: string | null
          preview_token?: string
          published_at?: string | null
          registration_url?: string | null
          slug?: string
          slug_ar?: string | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          tags?: string[]
          title?: string
          translations?: Json
          updated_at?: string
          virtual_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      form_settings: {
        Row: {
          fields: Json
          id: string
          key: string
          labels: Json
          labels_ar: Json
          required_fields: string[]
          updated_at: string
        }
        Insert: {
          fields?: Json
          id?: string
          key: string
          labels?: Json
          labels_ar?: Json
          required_fields?: string[]
          updated_at?: string
        }
        Update: {
          fields?: Json
          id?: string
          key?: string
          labels?: Json
          labels_ar?: Json
          required_fields?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      header_footer_settings: {
        Row: {
          created_at: string
          footer_columns: Json
          footer_copyright: string | null
          footer_logo_url: string | null
          footer_social: Json
          footer_tagline: string | null
          header_bg_color: string | null
          header_brand_text: string | null
          header_cta_bg_color: string | null
          header_cta_label: string | null
          header_cta_text_color: string | null
          header_cta_url: string | null
          header_cta_variant: string
          header_locales: Json
          header_logo_dark_url: string | null
          header_logo_height: number
          header_logo_url: string | null
          header_shadow_style: string
          header_show_brand_text: boolean
          header_show_locale_switcher: boolean
          header_show_menus: boolean
          header_sticky: boolean
          header_text_color: string | null
          header_transparent_on_hero: boolean
          id: string
          mobile_default_expanded: boolean
          mobile_drawer_bg_color: string | null
          mobile_drawer_side: string
          mobile_drawer_text_color: string | null
          mobile_drawer_width_pct: number
          mobile_menu_items: Json
          mobile_more_label: string
          mobile_show_cta: boolean
          mobile_show_lang: boolean
          mobile_show_logo: boolean
          mobile_show_social: boolean
          singleton: boolean
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          footer_columns?: Json
          footer_copyright?: string | null
          footer_logo_url?: string | null
          footer_social?: Json
          footer_tagline?: string | null
          header_bg_color?: string | null
          header_brand_text?: string | null
          header_cta_bg_color?: string | null
          header_cta_label?: string | null
          header_cta_text_color?: string | null
          header_cta_url?: string | null
          header_cta_variant?: string
          header_locales?: Json
          header_logo_dark_url?: string | null
          header_logo_height?: number
          header_logo_url?: string | null
          header_shadow_style?: string
          header_show_brand_text?: boolean
          header_show_locale_switcher?: boolean
          header_show_menus?: boolean
          header_sticky?: boolean
          header_text_color?: string | null
          header_transparent_on_hero?: boolean
          id?: string
          mobile_default_expanded?: boolean
          mobile_drawer_bg_color?: string | null
          mobile_drawer_side?: string
          mobile_drawer_text_color?: string | null
          mobile_drawer_width_pct?: number
          mobile_menu_items?: Json
          mobile_more_label?: string
          mobile_show_cta?: boolean
          mobile_show_lang?: boolean
          mobile_show_logo?: boolean
          mobile_show_social?: boolean
          singleton?: boolean
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          footer_columns?: Json
          footer_copyright?: string | null
          footer_logo_url?: string | null
          footer_social?: Json
          footer_tagline?: string | null
          header_bg_color?: string | null
          header_brand_text?: string | null
          header_cta_bg_color?: string | null
          header_cta_label?: string | null
          header_cta_text_color?: string | null
          header_cta_url?: string | null
          header_cta_variant?: string
          header_locales?: Json
          header_logo_dark_url?: string | null
          header_logo_height?: number
          header_logo_url?: string | null
          header_shadow_style?: string
          header_show_brand_text?: boolean
          header_show_locale_switcher?: boolean
          header_show_menus?: boolean
          header_sticky?: boolean
          header_text_color?: string | null
          header_transparent_on_hero?: boolean
          id?: string
          mobile_default_expanded?: boolean
          mobile_drawer_bg_color?: string | null
          mobile_drawer_side?: string
          mobile_drawer_text_color?: string | null
          mobile_drawer_width_pct?: number
          mobile_menu_items?: Json
          mobile_more_label?: string
          mobile_show_cta?: boolean
          mobile_show_lang?: boolean
          mobile_show_logo?: boolean
          mobile_show_social?: boolean
          singleton?: boolean
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      homepage_hero: {
        Row: {
          background_type: string
          background_url: string | null
          created_at: string
          cta_bg_from: string
          cta_bg_to: string
          cta_href: string
          cta_label: string
          cta_text_color: string
          heading_line1: string
          heading_line1_color: string
          heading_line2: string
          heading_line2_from: string
          heading_line2_to: string
          heading_size: string
          id: string
          is_visible: boolean
          overlay_opacity: number
          singleton: boolean
          subheadline: string
          subheadline_color: string
          text_align: string
          translations: Json
          updated_at: string
          vertical_position: string
        }
        Insert: {
          background_type?: string
          background_url?: string | null
          created_at?: string
          cta_bg_from?: string
          cta_bg_to?: string
          cta_href?: string
          cta_label?: string
          cta_text_color?: string
          heading_line1?: string
          heading_line1_color?: string
          heading_line2?: string
          heading_line2_from?: string
          heading_line2_to?: string
          heading_size?: string
          id?: string
          is_visible?: boolean
          overlay_opacity?: number
          singleton?: boolean
          subheadline?: string
          subheadline_color?: string
          text_align?: string
          translations?: Json
          updated_at?: string
          vertical_position?: string
        }
        Update: {
          background_type?: string
          background_url?: string | null
          created_at?: string
          cta_bg_from?: string
          cta_bg_to?: string
          cta_href?: string
          cta_label?: string
          cta_text_color?: string
          heading_line1?: string
          heading_line1_color?: string
          heading_line2?: string
          heading_line2_from?: string
          heading_line2_to?: string
          heading_size?: string
          id?: string
          is_visible?: boolean
          overlay_opacity?: number
          singleton?: boolean
          subheadline?: string
          subheadline_color?: string
          text_align?: string
          translations?: Json
          updated_at?: string
          vertical_position?: string
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          content: Json
          is_visible: boolean
          section_key: string
          translations: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          is_visible?: boolean
          section_key: string
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          is_visible?: boolean
          section_key?: string
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      list_page_hero: {
        Row: {
          card_labels: Json
          created_at: string
          description: string | null
          eyebrow: string | null
          is_visible: boolean
          page_key: string
          title_highlight: string | null
          title_prefix: string | null
          translations: Json
          updated_at: string
        }
        Insert: {
          card_labels?: Json
          created_at?: string
          description?: string | null
          eyebrow?: string | null
          is_visible?: boolean
          page_key: string
          title_highlight?: string | null
          title_prefix?: string | null
          translations?: Json
          updated_at?: string
        }
        Update: {
          card_labels?: Json
          created_at?: string
          description?: string | null
          eyebrow?: string | null
          is_visible?: boolean
          page_key?: string
          title_highlight?: string | null
          title_prefix?: string | null
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          folder: string
          id: string
          tags: string[]
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          folder?: string
          id?: string
          tags?: string[]
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          folder?: string
          id?: string
          tags?: string[]
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_columns: {
        Row: {
          created_at: string
          description: string | null
          group_id: string
          id: string
          is_visible: boolean
          label: string
          position: number
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_id: string
          id?: string
          is_visible?: boolean
          label: string
          position?: number
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          group_id?: string
          id?: string
          is_visible?: boolean
          label?: string
          position?: number
          translations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_columns_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "menu_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_groups: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          label: string
          position: number
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          label: string
          position?: number
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          label?: string
          position?: number
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      menu_links: {
        Row: {
          column_id: string
          created_at: string
          href_ar: string | null
          id: string
          is_visible: boolean
          label: string
          position: number
          target: string
          translations: Json
          updated_at: string
          url: string
        }
        Insert: {
          column_id: string
          created_at?: string
          href_ar?: string | null
          id?: string
          is_visible?: boolean
          label: string
          position?: number
          target?: string
          translations?: Json
          updated_at?: string
          url: string
        }
        Update: {
          column_id?: string
          created_at?: string
          href_ar?: string | null
          id?: string
          is_visible?: boolean
          label?: string
          position?: number
          target?: string
          translations?: Json
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_links_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "menu_columns"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          created_at: string
          data: Json
          id: string
          is_visible: boolean
          kind: string
          page_id: string
          position: number
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          is_visible?: boolean
          kind: string
          page_id: string
          position?: number
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          is_visible?: boolean
          kind?: string
          page_id?: string
          position?: number
          translations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          entity_id: string
          entity_type: Database["public"]["Enums"]["view_entity"]
          id: string
          referrer: string | null
          viewed_at: string
          viewed_day: string
          viewer_hash: string | null
        }
        Insert: {
          entity_id: string
          entity_type: Database["public"]["Enums"]["view_entity"]
          id?: string
          referrer?: string | null
          viewed_at?: string
          viewed_day?: string
          viewer_hash?: string | null
        }
        Update: {
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["view_entity"]
          id?: string
          referrer?: string | null
          viewed_at?: string
          viewed_day?: string
          viewer_hash?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          author_id: string
          content: string | null
          created_at: string
          featured_image_url: string | null
          id: string
          menu_column_id: string | null
          menu_position: number
          nav_label: string | null
          page_kind: string
          parent_id: string | null
          position: number
          preview_token: string
          route_path: string | null
          section_id: string | null
          slug: string
          slug_ar: string | null
          status: Database["public"]["Enums"]["page_status"]
          template: Database["public"]["Enums"]["page_template"]
          title: string
          translations: Json
          updated_at: string
        }
        Insert: {
          author_id: string
          content?: string | null
          created_at?: string
          featured_image_url?: string | null
          id?: string
          menu_column_id?: string | null
          menu_position?: number
          nav_label?: string | null
          page_kind?: string
          parent_id?: string | null
          position?: number
          preview_token?: string
          route_path?: string | null
          section_id?: string | null
          slug: string
          slug_ar?: string | null
          status?: Database["public"]["Enums"]["page_status"]
          template?: Database["public"]["Enums"]["page_template"]
          title: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string | null
          created_at?: string
          featured_image_url?: string | null
          id?: string
          menu_column_id?: string | null
          menu_position?: number
          nav_label?: string | null
          page_kind?: string
          parent_id?: string | null
          position?: number
          preview_token?: string
          route_path?: string | null
          section_id?: string | null
          slug?: string
          slug_ar?: string | null
          status?: Database["public"]["Enums"]["page_status"]
          template?: Database["public"]["Enums"]["page_template"]
          title?: string
          translations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_menu_column_id_fkey"
            columns: ["menu_column_id"]
            isOneToOne: false
            referencedRelation: "menu_columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          category_id: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          preview_token: string
          published_at: string | null
          slug: string
          slug_ar: string | null
          status: Database["public"]["Enums"]["post_status"]
          title: string
          translations: Json
          updated_at: string
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          preview_token?: string
          published_at?: string | null
          slug: string
          slug_ar?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          preview_token?: string
          published_at?: string | null
          slug?: string
          slug_ar?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          translations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      route_map: {
        Row: {
          created_at: string
          id: string
          path_ar: string | null
          path_en: string
          route_key: string
          title_ar: string | null
          title_en: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          path_ar?: string | null
          path_en: string
          route_key: string
          title_ar?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          path_ar?: string | null
          path_en?: string
          route_key?: string
          title_ar?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      seo_meta: {
        Row: {
          canonical_url: string | null
          created_at: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["seo_entity"]
          focus_keyword: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          nofollow: boolean
          noindex: boolean
          og_image_url: string | null
          translations: Json
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["seo_entity"]
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          nofollow?: boolean
          noindex?: boolean
          og_image_url?: string | null
          translations?: Json
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["seo_entity"]
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          nofollow?: boolean
          noindex?: boolean
          og_image_url?: string | null
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string | null
          body_font: string | null
          border_radius: string | null
          brand_dark_color: string | null
          created_at: string
          default_meta_description: string | null
          default_meta_description_ar: string | null
          default_meta_title: string | null
          default_meta_title_ar: string | null
          favicon_url: string | null
          heading_font: string | null
          id: string
          logo_dark_url: string | null
          og_image_url: string | null
          primary_color: string | null
          singleton: boolean
          site_description: string | null
          site_description_ar: string | null
          site_logo_url: string | null
          site_title: string | null
          site_title_ar: string | null
          site_url: string | null
          style_tokens: Json
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          body_font?: string | null
          border_radius?: string | null
          brand_dark_color?: string | null
          created_at?: string
          default_meta_description?: string | null
          default_meta_description_ar?: string | null
          default_meta_title?: string | null
          default_meta_title_ar?: string | null
          favicon_url?: string | null
          heading_font?: string | null
          id?: string
          logo_dark_url?: string | null
          og_image_url?: string | null
          primary_color?: string | null
          singleton?: boolean
          site_description?: string | null
          site_description_ar?: string | null
          site_logo_url?: string | null
          site_title?: string | null
          site_title_ar?: string | null
          site_url?: string | null
          style_tokens?: Json
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          body_font?: string | null
          border_radius?: string | null
          brand_dark_color?: string | null
          created_at?: string
          default_meta_description?: string | null
          default_meta_description_ar?: string | null
          default_meta_title?: string | null
          default_meta_title_ar?: string | null
          favicon_url?: string | null
          heading_font?: string | null
          id?: string
          logo_dark_url?: string | null
          og_image_url?: string | null
          primary_color?: string | null
          singleton?: boolean
          site_description?: string | null
          site_description_ar?: string | null
          site_logo_url?: string | null
          site_title?: string | null
          site_title_ar?: string | null
          site_url?: string | null
          style_tokens?: Json
          updated_at?: string
        }
        Relationships: []
      }
      slug_redirects: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          locale: string
          new_slug: string
          old_slug: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          locale?: string
          new_slug: string
          old_slug: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          locale?: string
          new_slug?: string
          old_slug?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_media_usage: {
        Args: { _url: string }
        Returns: {
          entity_id: string
          entity_type: string
          slug: string
          title: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      publish_scheduled_content: { Args: never; Returns: undefined }
      replace_media_url: {
        Args: { _new: string; _old: string }
        Returns: number
      }
      slugify_ar: { Args: { input: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "editor" | "author" | "subscriber"
      event_type: "webinar" | "conference" | "workshop" | "meetup" | "other"
      page_status: "draft" | "published" | "trashed"
      page_template: "default" | "full-width" | "landing"
      post_status: "draft" | "published" | "scheduled" | "trashed"
      seo_entity: "post" | "page" | "homepage" | "case_study" | "event"
      view_entity: "post" | "page"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "editor", "author", "subscriber"],
      event_type: ["webinar", "conference", "workshop", "meetup", "other"],
      page_status: ["draft", "published", "trashed"],
      page_template: ["default", "full-width", "landing"],
      post_status: ["draft", "published", "scheduled", "trashed"],
      seo_entity: ["post", "page", "homepage", "case_study", "event"],
      view_entity: ["post", "page"],
    },
  },
} as const
