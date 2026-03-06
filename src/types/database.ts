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
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          title: string | null
          emoji: string
          avatar_color: string
          role: 'member' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          title?: string | null
          emoji?: string
          avatar_color?: string
          role?: 'member' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          title?: string | null
          emoji?: string
          avatar_color?: string
          role?: 'member' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'done'
          priority: 'high' | 'medium' | 'low'
          due_date: string | null
          assignee_id: string | null
          creator_id: string
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          priority?: 'high' | 'medium' | 'low'
          due_date?: string | null
          assignee_id?: string | null
          creator_id: string
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          priority?: 'high' | 'medium' | 'low'
          due_date?: string | null
          assignee_id?: string | null
          creator_id?: string
          position?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          content: string
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          content: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          content?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_log: {
        Row: {
          id: string
          user_id: string
          action: string
          task_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          task_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          task_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      task_status: 'todo' | 'in_progress' | 'done'
      task_priority: 'high' | 'medium' | 'low'
      user_role: 'member' | 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type ActivityLog = Database['public']['Tables']['activity_log']['Row']

export type TaskWithProfiles = Task & {
  assignee: Profile | null
  creator: Profile
}

export type CommentWithProfile = Comment & {
  profile: Profile
}
