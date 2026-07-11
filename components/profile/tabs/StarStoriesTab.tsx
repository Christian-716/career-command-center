'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StarStoryCard } from '@/components/profile/StarStoryCard'
import { StarStorySheet } from '@/components/profile/StarStorySheet'
import { StarStory, UserProfile } from '@/lib/types/profile'

interface StarStoriesTabProps {
  stories: StarStory[]
  editing: boolean
  patch: (key: keyof UserProfile, value: unknown) => void
}

export function StarStoriesTab({ stories, editing, patch }: StarStoriesTabProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  function handleSave(story: StarStory) {
    if (editingIndex !== null) {
      patch('starStories', stories.map((s, i) => i === editingIndex ? story : s))
    } else {
      patch('starStories', [...stories, story])
    }
    setEditingIndex(null)
  }

  function handleEdit(index: number) {
    setEditingIndex(index)
    setSheetOpen(true)
  }

  function handleDelete(index: number) {
    patch('starStories', stories.filter((_, i) => i !== index))
  }

  function handleAdd() {
    setEditingIndex(null)
    setSheetOpen(true)
  }

  return (
    <div className="p-6">
      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-[hsl(var(--muted))]">
          <p className="text-sm mb-3">No STAR stories yet</p>
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Add Your First Story
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {stories.map((story, i) => (
            <StarStoryCard
              key={i}
              story={story}
              editing={editing}
              onEdit={() => handleEdit(i)}
              onDelete={() => handleDelete(i)}
            />
          ))}
          {editing && (
            <Button variant="outline" size="sm" onClick={handleAdd}>
              <Plus className="h-4 w-4" />
              Add Story
            </Button>
          )}
        </div>
      )}

      <StarStorySheet
        open={sheetOpen}
        onClose={() => { setSheetOpen(false); setEditingIndex(null) }}
        initial={editingIndex !== null ? stories[editingIndex] : undefined}
        onSave={handleSave}
      />
    </div>
  )
}
