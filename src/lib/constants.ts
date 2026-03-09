export const TEAM_MEMBERS = [
  { name: 'Nerya', title: 'ABM Manager', emoji: '\u{1F3AF}', color: '#ef4444', role: 'member' as const },
  { name: 'Barr', title: 'Product Marketing', emoji: '\u{1F4E6}', color: '#f59e0b', role: 'member' as const },
  { name: 'Udi', title: 'Product Marketing Director', emoji: '\u{1F3AC}', color: '#8b5cf6', role: 'member' as const },
  { name: 'Tiffany', title: 'Events Manager', emoji: '\u{1F389}', color: '#ec4899', role: 'member' as const },
  { name: 'James G', title: 'Website and SEO Manager', emoji: '\u{1F310}', color: '#06b6d4', role: 'member' as const },
  { name: 'Anoop', title: 'AI & ABM Strategy, Marketing Ops', emoji: '\u{1F916}', color: '#10b981', role: 'admin' as const },
  { name: 'Shawn Fontenot', title: 'Boss', emoji: '\u{1F451}', color: '#f97316', role: 'admin' as const },
] as const

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TASK_PRIORITIES = ['high', 'medium', 'low'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export const STATUS_CONFIG = {
  todo: { label: 'To Do', bgClass: 'bg-sky-50', textClass: 'text-sky-700', borderClass: 'border-sky-200', dotColor: 'bg-[#38BDF8]' },
  in_progress: { label: 'In Progress', bgClass: 'bg-orange-50', textClass: 'text-orange-700', borderClass: 'border-orange-200', dotColor: 'bg-[#FF6B35]' },
  done: { label: 'Done', bgClass: 'bg-emerald-50', textClass: 'text-emerald-700', borderClass: 'border-emerald-200', dotColor: 'bg-[#22C55E]' },
} as const

export const PRIORITY_CONFIG = {
  high: { label: 'High', dotColor: 'bg-[#E5484D]', bgClass: 'bg-red-50', textClass: 'text-red-700', borderClass: 'border-red-200' },
  medium: { label: 'Medium', dotColor: 'bg-[#FACC15]', bgClass: 'bg-yellow-50', textClass: 'text-yellow-700', borderClass: 'border-yellow-200' },
  low: { label: 'Low', dotColor: 'bg-[#A3E635]', bgClass: 'bg-lime-50', textClass: 'text-lime-700', borderClass: 'border-lime-200' },
} as const

export const ACTIVITY_ICONS: Record<string, string> = {
  task_created: 'created',
  task_updated: 'updated',
  task_status_changed: 'moved',
  task_reassigned: 'reassigned',
  task_deleted: 'deleted',
  task_completed: 'completed',
  comment_added: 'commented',
}
