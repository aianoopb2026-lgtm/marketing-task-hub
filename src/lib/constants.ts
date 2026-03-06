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
  todo: { label: 'To Do', emoji: '\u{1F4CB}', bgClass: 'bg-slate-50', textClass: 'text-slate-700', borderClass: 'border-slate-200', dotColor: 'bg-slate-400' },
  in_progress: { label: 'In Progress', emoji: '\u{1F525}', bgClass: 'bg-blue-50', textClass: 'text-blue-700', borderClass: 'border-blue-200', dotColor: 'bg-blue-500' },
  done: { label: 'Done', emoji: '\u2705', bgClass: 'bg-green-50', textClass: 'text-green-700', borderClass: 'border-green-200', dotColor: 'bg-green-500' },
} as const

export const PRIORITY_CONFIG = {
  high: { emoji: '\u{1F534}', label: 'High', bgClass: 'bg-red-50', textClass: 'text-red-700', borderClass: 'border-red-200' },
  medium: { emoji: '\u{1F7E1}', label: 'Medium', bgClass: 'bg-yellow-50', textClass: 'text-yellow-700', borderClass: 'border-yellow-200' },
  low: { emoji: '\u{1F7E2}', label: 'Low', bgClass: 'bg-green-50', textClass: 'text-green-700', borderClass: 'border-green-200' },
} as const

export const ACTIVITY_ICONS: Record<string, string> = {
  task_created: '\u2728',
  task_updated: '\u{1F4DD}',
  task_status_changed: '\u{1F504}',
  task_reassigned: '\u{1F465}',
  task_deleted: '\u{1F5D1}\uFE0F',
  task_completed: '\u{1F389}',
  comment_added: '\u{1F4AC}',
}
