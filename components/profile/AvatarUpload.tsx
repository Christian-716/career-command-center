'use client'
import { useRef } from 'react'
import { Camera } from 'lucide-react'

interface AvatarUploadProps {
  avatarUrl?: string
  name: string
  editing: boolean
  onUpload: (dataUrl: string) => void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()
}

export function AvatarUpload({ avatarUrl, name, editing, onUpload }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target?.result as string
      const img = new Image()
      img.onload = () => {
        const SIZE = 256
        const canvas = document.createElement('canvas')
        canvas.width = SIZE
        canvas.height = SIZE
        const ctx = canvas.getContext('2d')!
        const scale = Math.max(SIZE / img.width, SIZE / img.height)
        const w = img.width * scale
        const h = img.height * scale
        ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h)
        onUpload(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = src
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="relative inline-block">
      <div
        onClick={() => editing && inputRef.current?.click()}
        className={`flex items-center justify-center w-20 h-20 rounded-full overflow-hidden bg-[hsl(var(--primary))] text-white text-xl font-bold select-none ${editing ? 'cursor-pointer' : ''}`}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          getInitials(name)
        )}
      </div>
      {editing && (
        <div
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Camera className="h-5 w-5 text-white" />
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
