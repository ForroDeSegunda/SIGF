export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      address: {
        Row: {
          city: string
          complement: string | null
          createdAt: string
          id: string
          number: number
          reference: string | null
          state: Database["public"]["Enums"]["state"]
          street: string
          zipCode: number
        }
        Insert: {
          city: string
          complement?: string | null
          createdAt?: string
          id?: string
          number: number
          reference?: string | null
          state: Database["public"]["Enums"]["state"]
          street: string
          zipCode: number
        }
        Update: {
          city?: string
          complement?: string | null
          createdAt?: string
          id?: string
          number?: number
          reference?: string | null
          state?: Database["public"]["Enums"]["state"]
          street?: string
          zipCode?: number
        }
        Relationships: []
      }
      attendance: {
        Row: {
          classDateId: string
          createdAt: string
          id: string
          presence: Database["public"]["Enums"]["presenceEnum"]
          userId: string
        }
        Insert: {
          classDateId: string
          createdAt?: string
          id?: string
          presence?: Database["public"]["Enums"]["presenceEnum"]
          userId: string
        }
        Update: {
          classDateId?: string
          createdAt?: string
          id?: string
          presence?: Database["public"]["Enums"]["presenceEnum"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_classDateId_fkey"
            columns: ["classDateId"]
            isOneToOne: false
            referencedRelation: "classDates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar: {
        Row: {
          created_at: string
          id: string
          name: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          url?: string
        }
        Relationships: []
      }
      classDates: {
        Row: {
          classId: string
          createdAt: string
          date: string
          id: string
        }
        Insert: {
          classId: string
          createdAt?: string
          date: string
          id?: string
        }
        Update: {
          classId?: string
          createdAt?: string
          date?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classDates_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          createdAt: string
          description: string | null
          franchiseId: string | null
          id: string
          isActive: boolean
          name: string
          periodId: string
          size: number
          teacherId: string | null
          weekDays: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          franchiseId?: string | null
          id?: string
          isActive?: boolean
          name: string
          periodId: string
          size: number
          teacherId?: string | null
          weekDays: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          franchiseId?: string | null
          id?: string
          isActive?: boolean
          name?: string
          periodId?: string
          size?: number
          teacherId?: string | null
          weekDays?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_franchiseId_fkey"
            columns: ["franchiseId"]
            isOneToOne: false
            referencedRelation: "franchise"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_periodId_fkey"
            columns: ["periodId"]
            isOneToOne: false
            referencedRelation: "period"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_teacherId_fkey"
            columns: ["teacherId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_teacherId_fkey"
            columns: ["teacherId"]
            isOneToOne: false
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollment: {
        Row: {
          classId: string
          createdAt: string
          danceRole: Database["public"]["Enums"]["danceRole"]
          danceRolePreference:
            | Database["public"]["Enums"]["danceRolePreference"]
            | null
          status: Database["public"]["Enums"]["enrollmentStatus"]
          userId: string
        }
        Insert: {
          classId: string
          createdAt?: string
          danceRole?: Database["public"]["Enums"]["danceRole"]
          danceRolePreference?:
            | Database["public"]["Enums"]["danceRolePreference"]
            | null
          status?: Database["public"]["Enums"]["enrollmentStatus"]
          userId: string
        }
        Update: {
          classId?: string
          createdAt?: string
          danceRole?: Database["public"]["Enums"]["danceRole"]
          danceRolePreference?:
            | Database["public"]["Enums"]["danceRolePreference"]
            | null
          status?: Database["public"]["Enums"]["enrollmentStatus"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollment_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollment_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollment_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise: {
        Row: {
          addressId: string
          createdAt: string
          id: string
          name: string
        }
        Insert: {
          addressId: string
          createdAt?: string
          id?: string
          name: string
        }
        Update: {
          addressId?: string
          createdAt?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_addressId_fkey"
            columns: ["addressId"]
            isOneToOne: false
            referencedRelation: "address"
            referencedColumns: ["id"]
          },
        ]
      }
      period: {
        Row: {
          active: boolean
          createdAt: string
          endDate: string
          id: string
          semester: Database["public"]["Enums"]["semesterEnum"]
          startDate: string
          year: number
        }
        Insert: {
          active?: boolean
          createdAt?: string
          endDate: string
          id?: string
          semester: Database["public"]["Enums"]["semesterEnum"]
          startDate: string
          year: number
        }
        Update: {
          active?: boolean
          createdAt?: string
          endDate?: string
          id?: string
          semester?: Database["public"]["Enums"]["semesterEnum"]
          startDate?: string
          year?: number
        }
        Relationships: []
      }
      transaction: {
        Row: {
          amount: number
          createdAt: string
          date: string
          description: string | null
          id: string
          lastEdited: string
          type: Database["public"]["Enums"]["transactionType"]
        }
        Insert: {
          amount: number
          createdAt?: string
          date?: string
          description?: string | null
          id?: string
          lastEdited?: string
          type: Database["public"]["Enums"]["transactionType"]
        }
        Update: {
          amount?: number
          createdAt?: string
          date?: string
          description?: string | null
          id?: string
          lastEdited?: string
          type?: Database["public"]["Enums"]["transactionType"]
        }
        Relationships: []
      }
      user: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["userRole"]
        }
        Insert: {
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["userRole"]
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["userRole"]
        }
        Relationships: [
          {
            foreignKeyName: "user_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      users_view: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string | null
          password: string | null
        }
        Insert: {
          avatar_url?: never
          email?: string | null
          full_name?: never
          id?: string | null
          password?: string | null
        }
        Update: {
          avatar_url?: never
          email?: string | null
          full_name?: never
          id?: string | null
          password?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      danceRole: "indifferent" | "led" | "leader"
      danceRolePreference: "led" | "leader"
      enrollmentStatus: "pending" | "approved" | "rejected" | "abandonment"
      presenceEnum: "notRegistered" | "present" | "absent" | "justified"
      semesterEnum: "first" | "second" | "firstVacation" | "secondVacation"
      state:
        | "AC"
        | "AL"
        | "AP"
        | "AM"
        | "BA"
        | "CE"
        | "ES"
        | "GO"
        | "MA"
        | "MT"
        | "MS"
        | "MG"
        | "PA"
        | "PB"
        | "PR"
        | "PE"
        | "PI"
        | "RJ"
        | "RN"
        | "RS"
        | "RO"
        | "RR"
        | "SC"
        | "SP"
        | "SE"
        | "TO"
      transactionType: "income" | "expense"
      userRole: "student" | "teacher" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

