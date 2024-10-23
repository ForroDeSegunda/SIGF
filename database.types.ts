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
          name: string
          periodId: string
          size: number
          status: Database["public"]["Enums"]["classStatus"]
          teacherId: string | null
          weekDays: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          franchiseId?: string | null
          id?: string
          name: string
          periodId: string
          size: number
          status?: Database["public"]["Enums"]["classStatus"]
          teacherId?: string | null
          weekDays: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          franchiseId?: string | null
          id?: string
          name?: string
          periodId?: string
          size?: number
          status?: Database["public"]["Enums"]["classStatus"]
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
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          createdAt: string
          id: string
          parentCommentId: string | null
          postId: string
          userId: string
        }
        Insert: {
          content: string
          createdAt?: string
          id?: string
          parentCommentId?: string | null
          postId: string
          userId: string
        }
        Update: {
          content?: string
          createdAt?: string
          id?: string
          parentCommentId?: string | null
          postId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parentCommentId_fkey"
            columns: ["parentCommentId"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
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
      posts: {
        Row: {
          content: string | null
          createdAt: string
          id: string
          threadId: string
          title: string
          userId: string
        }
        Insert: {
          content?: string | null
          createdAt?: string
          id?: string
          threadId: string
          title: string
          userId: string
        }
        Update: {
          content?: string | null
          createdAt?: string
          id?: string
          threadId?: string
          title?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_authorId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_threadId_fkey"
            columns: ["threadId"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      threads: {
        Row: {
          createdAt: string
          id: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "threads_creatorId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          commentId: string | null
          createdAt: string
          id: string
          postId: string | null
          userId: string
          vote: Database["public"]["Enums"]["voteType"]
        }
        Insert: {
          commentId?: string | null
          createdAt?: string
          id?: string
          postId?: string | null
          userId: string
          vote: Database["public"]["Enums"]["voteType"]
        }
        Update: {
          commentId?: string | null
          createdAt?: string
          id?: string
          postId?: string | null
          userId?: string
          vote?: Database["public"]["Enums"]["voteType"]
        }
        Relationships: [
          {
            foreignKeyName: "votes_commentId_fkey"
            columns: ["commentId"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
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
      classStatus: "hidden" | "open" | "ongoing" | "archived"
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
      userRole: "student" | "teacher" | "admin" | "director"
      voteType: "upVote" | "downVote"
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

