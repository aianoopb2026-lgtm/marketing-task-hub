-- =============================================================
-- MARKETING TASK MANAGER - Initial Schema
-- =============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================
-- CUSTOM TYPES
-- ========================
CREATE TYPE task_status  AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE task_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE user_role     AS ENUM ('member', 'admin');

-- ========================
-- PROFILES TABLE
-- ========================
CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT        NOT NULL,
  email        TEXT        NOT NULL UNIQUE,
  title        TEXT,
  emoji        TEXT        NOT NULL DEFAULT '👤',
  avatar_color TEXT        NOT NULL DEFAULT '#6366f1',
  role         user_role   NOT NULL DEFAULT 'member',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========================
-- TASKS TABLE
-- ========================
CREATE TABLE public.tasks (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT         NOT NULL,
  description  TEXT,
  status       task_status  NOT NULL DEFAULT 'todo',
  priority     task_priority NOT NULL DEFAULT 'medium',
  due_date     DATE,
  assignee_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  creator_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  position     INTEGER      NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_status      ON public.tasks(status);
CREATE INDEX idx_tasks_assignee    ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_creator     ON public.tasks(creator_id);
CREATE INDEX idx_tasks_due_date    ON public.tasks(due_date);
CREATE INDEX idx_tasks_priority    ON public.tasks(priority);

-- ========================
-- COMMENTS TABLE
-- ========================
CREATE TABLE public.comments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id    UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  parent_id  UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_task   ON public.comments(task_id);
CREATE INDEX idx_comments_parent ON public.comments(parent_id);

-- ========================
-- ACTIVITY LOG TABLE
-- ========================
CREATE TABLE public.activity_log (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action     TEXT NOT NULL,
  task_id    UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  details    JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_user     ON public.activity_log(user_id);
CREATE INDEX idx_activity_task     ON public.activity_log(task_id);
CREATE INDEX idx_activity_created  ON public.activity_log(created_at DESC);

-- ========================
-- TRIGGERS: updated_at
-- ========================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ========================
-- TRIGGER: Auto-create profile on signup
-- ========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================
-- TRIGGER: Auto-log task activity
-- ========================
CREATE OR REPLACE FUNCTION public.log_task_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_log (user_id, action, task_id, details)
    VALUES (NEW.creator_id, 'task_created', NEW.id, jsonb_build_object('title', NEW.title));
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO public.activity_log (user_id, action, task_id, details)
      VALUES (NEW.creator_id,
        CASE WHEN NEW.status = 'done' THEN 'task_completed' ELSE 'task_status_changed' END,
        NEW.id,
        jsonb_build_object('old', OLD.status::text, 'new', NEW.status::text, 'title', NEW.title));
    END IF;
    IF OLD.assignee_id IS DISTINCT FROM NEW.assignee_id THEN
      INSERT INTO public.activity_log (user_id, action, task_id, details)
      VALUES (NEW.creator_id, 'task_reassigned', NEW.id,
        jsonb_build_object('old_assignee', OLD.assignee_id, 'new_assignee', NEW.assignee_id, 'title', NEW.title));
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_log (user_id, action, task_id, details)
    VALUES (OLD.creator_id, 'task_deleted', OLD.id, jsonb_build_object('title', OLD.title));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER task_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.log_task_activity();

-- ========================
-- RLS HELPER
-- ========================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ========================
-- ROW LEVEL SECURITY
-- ========================

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Admins update any profile" ON public.profiles
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- TASKS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tasks viewable by authenticated" ON public.tasks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated create tasks" ON public.tasks
  FOR INSERT TO authenticated WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators/assignees update tasks" ON public.tasks
  FOR UPDATE TO authenticated
  USING (creator_id = auth.uid() OR assignee_id = auth.uid())
  WITH CHECK (creator_id = auth.uid() OR assignee_id = auth.uid());

CREATE POLICY "Admins update any task" ON public.tasks
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Creators delete own tasks" ON public.tasks
  FOR DELETE TO authenticated USING (creator_id = auth.uid());

CREATE POLICY "Admins delete any task" ON public.tasks
  FOR DELETE TO authenticated USING (public.is_admin());

-- COMMENTS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments viewable by authenticated" ON public.comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated create comments" ON public.comments
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own comments" ON public.comments
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users delete own comments" ON public.comments
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins delete any comment" ON public.comments
  FOR DELETE TO authenticated USING (public.is_admin());

-- ACTIVITY LOG
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activity viewable by authenticated" ON public.activity_log
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated insert activity" ON public.activity_log
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ========================
-- ENABLE REALTIME
-- ========================
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
