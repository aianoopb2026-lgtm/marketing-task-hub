'use client'

import { Select } from '@/components/ui/select'
import { TASK_PRIORITIES, PRIORITY_CONFIG } from '@/lib/constants'
import type { Profile } from '@/types/database'

interface TaskFiltersProps {
  priority: string
  assignee: string
  onPriorityChange: (value: string) => void
  onAssigneeChange: (value: string) => void
  profiles: Profile[]
}

export function TaskFilters({
  priority,
  assignee,
  onPriorityChange,
  onAssigneeChange,
  profiles,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        placeholder={'\u{1F3AF} All Priorities'}
        options={TASK_PRIORITIES.map((p) => ({
          value: p,
          label: `${PRIORITY_CONFIG[p].emoji} ${PRIORITY_CONFIG[p].label}`,
        }))}
        className="w-40"
      />
      <Select
        value={assignee}
        onChange={(e) => onAssigneeChange(e.target.value)}
        placeholder={'\u{1F465} All Members'}
        options={profiles.map((p) => ({
          value: p.id,
          label: `${p.emoji} ${p.full_name}`,
        }))}
        className="w-48"
      />
      {(priority || assignee) && (
        <button
          onClick={() => {
            onPriorityChange('')
            onAssigneeChange('')
          }}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {'\u2715'} Clear filters
        </button>
      )}
    </div>
  )
}
