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
      course_translations: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          language: Database["public"]["Enums"]["app_language"]
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          language: Database["public"]["Enums"]["app_language"]
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          language?: Database["public"]["Enums"]["app_language"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_translations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_codes: {
        Row: {
          class_code: string
          created_at: string
          group_id: string
          updated_at: string
        }
        Insert: {
          class_code: string
          created_at?: string
          group_id: string
          updated_at?: string
        }
        Update: {
          class_code?: string
          created_at?: string
          group_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_codes_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: true
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          student_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          student_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          class_name: string
          created_at: string
          id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          class_name: string
          created_at?: string
          id?: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          class_name?: string
          created_at?: string
          id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      homework_assignments: {
        Row: {
          ai_evaluation_criteria: string | null
          course_id: string
          created_at: string
          deadline: string | null
          description: string | null
          group_id: string | null
          id: string
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          ai_evaluation_criteria?: string | null
          course_id: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          group_id?: string | null
          id?: string
          teacher_id: string
          title: string
          updated_at?: string
        }
        Update: {
          ai_evaluation_criteria?: string | null
          course_id?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          group_id?: string | null
          id?: string
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_assignments_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      homework_submissions: {
        Row: {
          ai_comment: string | null
          ai_score: number | null
          answer_text: string | null
          assignment_id: string
          file_url: string | null
          id: string
          reviewed_at: string | null
          status: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at: string
          teacher_comment: string | null
          teacher_grade: number | null
        }
        Insert: {
          ai_comment?: string | null
          ai_score?: number | null
          answer_text?: string | null
          assignment_id: string
          file_url?: string | null
          id?: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at?: string
          teacher_comment?: string | null
          teacher_grade?: number | null
        }
        Update: {
          ai_comment?: string | null
          ai_score?: number | null
          answer_text?: string | null
          assignment_id?: string
          file_url?: string | null
          id?: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          student_id?: string
          submitted_at?: string
          teacher_comment?: string | null
          teacher_grade?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "homework_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "homework_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean
          course_id: string
          created_at: string
          id: string
          last_viewed_at: string
          lesson_id: string
          progress_pct: number
          student_id: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          course_id: string
          created_at?: string
          id?: string
          last_viewed_at?: string
          lesson_id: string
          progress_pct?: number
          student_id: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          course_id?: string
          created_at?: string
          id?: string
          last_viewed_at?: string
          lesson_id?: string
          progress_pct?: number
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_translations: {
        Row: {
          created_at: string
          id: string
          language: Database["public"]["Enums"]["app_language"]
          lesson_id: string
          task_description: string
          theory_content: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          language: Database["public"]["Enums"]["app_language"]
          lesson_id: string
          task_description?: string
          theory_content?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: Database["public"]["Enums"]["app_language"]
          lesson_id?: string
          task_description?: string
          theory_content?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_translations_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string
          created_at: string
          grade: number
          id: string
          language: string
          subject: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string
          created_at?: string
          grade: number
          id?: string
          language?: string
          subject: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          grade?: number
          id?: string
          language?: string
          subject?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          assigned_class: number | null
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          last_course_id: string | null
          last_lesson_id: string | null
          preferred_language: Database["public"]["Enums"]["app_language"]
          subject: string | null
          total_lessons_completed: number
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_class?: number | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          last_course_id?: string | null
          last_lesson_id?: string | null
          preferred_language?: Database["public"]["Enums"]["app_language"]
          subject?: string | null
          total_lessons_completed?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_class?: number | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          last_course_id?: string | null
          last_lesson_id?: string | null
          preferred_language?: Database["public"]["Enums"]["app_language"]
          subject?: string | null
          total_lessons_completed?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_lesson_states: {
        Row: {
          created_at: string
          error_history: Json
          hint_level: number
          id: string
          is_completed: boolean
          lesson_id: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_history?: Json
          hint_level?: number
          id?: string
          is_completed?: boolean
          lesson_id: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_history?: Json
          hint_level?: number
          id?: string
          is_completed?: boolean
          lesson_id?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_lesson_states_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_stats: {
        Row: {
          avg_student_score: number | null
          id: string
          interactive_lessons_count: number | null
          teacher_id: string
          topics_covered_pct: number | null
          updated_at: string | null
        }
        Insert: {
          avg_student_score?: number | null
          id?: string
          interactive_lessons_count?: number | null
          teacher_id: string
          topics_covered_pct?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_student_score?: number | null
          id?: string
          interactive_lessons_count?: number | null
          teacher_id?: string
          topics_covered_pct?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_class_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_group_member: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
      is_group_teacher: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
      join_group_by_code: { Args: { _code: string }; Returns: Json }
    }
    Enums: {
      app_language: "kk" | "ru" | "en"
      app_role: "admin" | "teacher" | "student"
      submission_status:
        | "submitted"
        | "ai_reviewed"
        | "pending_review"
        | "graded"
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
      app_language: ["kk", "ru", "en"],
      app_role: ["admin", "teacher", "student"],
      submission_status: [
        "submitted",
        "ai_reviewed",
        "pending_review",
        "graded",
      ],
    },
  },
} as const
